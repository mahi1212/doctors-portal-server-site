const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tecyb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db('doctors_portal')
    const appointmentsCollection = database.collection('appointments')

    // Get value from database
    app.get('/appointments', async (req, res) => {
      const email = req.query.email
      const date = new Date(req.query.date).toLocaleDateString()
      console.log(date)
      const query = {email: email, date: date}
      const cursor = appointmentsCollection.find(query) //set query in find funtion
      const appointments = await cursor.toArray()
      res.json(appointments)
    })
    
    // post appointments details
    app.post('/appointments', async (req, res) => {
      const appointments = req.body
      const result = await appointmentsCollection.insertOne(appointments)
      console.log(result)
      res.json(result)
    })

  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Doctors portal')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
