const express=require("express")
const cors=require("cors")
require("dotenv").config();
const port=process.env.PORT || 5000;
const app=express();

app.use(cors());
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mhzhu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const taskCollection=client.db("todo").collection("tasklist");
        const completeTaskCollection=client.db("todo").collection("complete");

        app.get("/task",async(req,res)=>{
            const query={};
            const cursor=taskCollection.find(query);

            let tasks=await cursor.toArray();
            res.send(tasks);
        })

        app.post("/task",async(req,res)=>{
            const newTask = req.body;
            const result = await  taskCollection.insertOne(newTask);
            res.send(result);
        })

        app.post("/complete",async(req,res)=>{
            const completeTask=req.body;
            const result=await completeTaskCollection.insertOne(completeTask);
            res.send(result);
        })

        app.delete("/task/:id",async(req,res)=>{
            const id=req.params.id;
            const query= {_id:ObjectId(id)};
            const result= await taskCollection.deleteOne(query);
            res.send(result);
        })

        app.get("/complete",async(req,res)=>{
            const query={};
            const cursor=completeTaskCollection.find(query);

            let completeTasks=await cursor.toArray();
            res.send(completeTasks);
        })

        app.put('/task/:id',async(req,res)=>{
            const id=req.params.id
            const updatedProduct=req.body
            const filter ={_id:ObjectId(id)}
            const options = { upsert: true }
            const updatedDoc={
              $set:{
                task: updatedProduct.task
              }
            }
            const result=await taskCollection.updateOne(filter,updatedDoc,options)
            res.send(result)
          })
    }
    finally{

    }
    

}
run().catch(console.dir);

    app.get("/",(req,res)=>{
        res.send("endgame start");
    })

    app.listen(port,(req,res)=>{
        console.log("running on",port)
    })