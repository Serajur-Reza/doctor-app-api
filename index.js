let express= require('express');
const MongoClient = require('mongodb').MongoClient;
let bodyParser = require('body-parser')
var cors = require('cors')

const app=express();
app.use(cors())
app.use(bodyParser.json())

const user = 'dbUser'
const pass = 'a120f'
let uri = `mongodb+srv://${user}:${pass}@cluster0-lu2mu.mongodb.net/test?retryWrites=true&w=majority`;

let client = new MongoClient(uri, { useNewUrlParser: true });

app.get('/', (req, res)=>{
  client = new MongoClient(uri, { useNewUrlParser: true },{ useUnifiedTopology: true });

  client.connect(err=>{
      const collection = client.db("doctor_app").collection("appointments");
      collection.find().toArray((err, documents)=>{
          if(err){
              console.log(err)
              res.status(500).send({message: err})
          }
          else{
              // console.log("sucessfully inserted", result)
              res.send(documents)
          }
      })
      client.close();
  })
})

app.post('/addappointment', (req,res)=>{
  const appointment= req.body
  console.log(appointment)
  client = new MongoClient(uri, { useNewUrlParser: true });

  client.connect(err => {
    const collection = client.db("doctor_app").collection("appointments");

    collection.insertOne(appointment, (err, result)=>{
      if(err){
        console.log(err)
        res.status(500).send({message:err})
      }
      else{
        res.send(result.ops[0])
      }
    })
    client.close();
  });
})

app.post("/getAppointmentsByDate", (req,res)=>{
  const date=req.params.date
  const appointmentDates= req.body.date;
  console.log(appointmentDates)

  client = new MongoClient(uri, { useNewUrlParser: true });

  client.connect(err=>{
      const collection = client.db("doctor_app").collection("appointments");
      collection.find({date: {$in: [appointmentDates]}}).toArray((err, documents)=>{
          if(err){
              console.log(err)
              res.status(500).send({message: err})
          }
          else{
              // console.log("sucessfully inserted", result)
              res.send(documents)
          }
      })
      client.close();
  })

  // const name=users[id]
  // res.send({id, name})
})



const port= process.env.PORT || 4200
app.listen(port, console.log('thank you'))