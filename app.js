const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const morgan = require('morgan')
const mysql = require('mysql')
const bodyParser = require('body-parser')
var config = require('./config');
 
app.use(morgan('short'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})


app.get("/", (req, res) => {
  console.log("responding to root route");
  res.send("Yoo")
})

// Check if user exists
app.get("/user/:id", (req, res) => {
  console.log('HOSTTTT',process.env.HOST);
  console.log(`Fetching user of id: ${req.params.id}`);
  const query = `SELECT * from Users where uid = ?`
  const values = [req.params.id]
  connection.query(query, values, (err, rows, fields) => {
    if (err) {
      console.log(query);
      console.log(`Failed to query for user. ${err}`);
      res.sendStatus(500)
      return
    }
    console.log("Successful query");

    console.log(rows);
    res.send(rows)
  })
  // res.end()
})

// Get Competition Categories
app.get("/competition_categories", (req, res) => {
  console.log(`Fetching competition categories`);
  const query = `SELECT * from CompetitionCategories`
  connection.query(query, (err, rows, fields) => {
    if (err) {
      console.log(query);
      console.log(`Failed to query all competition categories`);
      res.sendStatus(500)
      return
    }
    console.log("Successful query");

    console.log(rows);
    res.send(rows)
  })
  // res.end()
})

// Login user, update lastSignInTime
app.post('/user_login', (req,res) => {

  const query = "insert into Login (uid, time) values (?,?)"
  const values = [req.body.uid, req.body.lastSignInTime]
  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.log(query);
      console.log(`Failed to query for users: ${err}`);
      res.sendStatus(500)
      return
    }

    console.log(`Logged in and updated lastSignInTime for user: ${req.body.uid}, ${req.body.lastSignInTime}`);
    res.end()
  })
  res.end()
})

// Register User
app.post('/user_create', (req,res) => {
  const query = "insert into Users (uid, first_name, last_name, display_name, email, profile_uri, profile_uri_480, creation_time) values (?,?,?,?,?,?,?,?)"
  const values = [req.body.uid,
    req.body.first_name,
    req.body.last_name,
    req.body.display_name,
    req.body.email,
    req.body.profile_uri,
    req.body.profile_uri_480,
    req.body.creation_time,
  ]
  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.log(query);
      console.log(req.body.creationTime);
      console.log(`Failed to query for users: ${err}`);
      res.sendStatus(500)
      return
    }

    console.log(`Inserted new user into users table of id: ${req.body.uid}`);
    res.end()
  })
  res.end()
})

// app.post('/upload_post', (req,res) => {
//   const query = "insert into Login (uid, time) values (?,?)"
//   const values = [req.body.uid, req.body.lastSignInTime]
//   connection.query(query, values, (err, results, fields) => {
//     if (err) {
//       console.log(query);
//       console.log(`Failed to query for users: ${err}`);
//       res.sendStatus(500)
//       return
//     }
//
//     console.log(`Logged in and updated lastSignInTime for user: ${req.body.uid}, ${req.body.lastSignInTime}`);
//     res.end()
//   })
//   res.end()
// })








app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
})
