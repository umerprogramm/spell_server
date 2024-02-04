const express = require('express')
const app = express()
const bodyParser = require('body-parser') 
const port = 5000
var cors = require('cors')
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.json())
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const uri = process.env.URI;
const client = new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true });





app.post('/update_score' , async (req,res)=>{
     const  { score  ,email} = req.body
     console.log(email);
     const options = { upsert: true };
     const filter = { Email : email };
     const updateDoc = {
      $set: {
        score: score
      },
    };
   
    const result = await collection.updateOne(filter, updateDoc, options);

})


app.post('/get_user', async (req ,res)=>{
  const { email } = req.body
  console.log(email);
  await client.connect();
  const db = client.db('spelling');
  const collection = db.collection('score_info');

  const data = await collection.findOne({
    Email : email
  });
  res.send({
    score : data.score
  })
})

app.post('/getinfo_and_check', cors(corsOptions), async (req, res)=>{
  const {name, email  } = req.body
  try {
    await client.connect();
    const db = client.db('spelling');
    const collection = db.collection('score_info');

    const data = await collection.findOne({
      Email : email
    });
    if(data == null) {
       await collection.insertOne({
        username : name,
        Email : email,
        score : 0,
      })
      const getdata = await collection.findOne({Email : email})
      res.send(getdata)
    }else {
          res.send(data)
    }
  } finally {

    await client.close();
  }
})

app.get('/all_user',async(req,res)=>{
  await client.connect();
  const db = client.db('spelling');
  const collection = db.collection('score_info');
  const result  = await collection.find({}).toArray()
  res.send(result)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
