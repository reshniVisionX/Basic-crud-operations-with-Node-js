const express = require('express');
const app = express()
const mongoose = require('mongoose');
//DB CONNECTION

app.use(express.json());
mongoose.connect("mongodb://0.0.0.0:27017/DemoDB",{
    useNewUrlParser : true,
    UseUnifiedTopology : true
},(err)=>{
    if(!err)
     console.log("Connected to DB");
    else
      console.log("Error");
})

//SCHEMA
const sch = {
    name : String,
    email : String,
    id : Number
}
    //attaching schema with the mongoose model
const monmodel = mongoose.model("CITIZENS",sch);

//POST request
app.post("/post",async(req,res)=>{
    console.log("Inside post Function");
    const data = new monmodel({
        name:req.body.name,
        email:req.body.email,
        id:req.body.id
    })
    //storing data in mongodb collection
    const val = await data.save();
    res.json(val);//send the data back to the postman
    
})

//PUT request
app.put("/update/:id",async(req,res)=>{
    let upid = req.params.id;//find it
    let upname = req.body.name;//update
    let upemail = req.body.email;

    monmodel.findOneAndUpdate({id:upid},{$set :{name:upname,email:upemail}},{new:true},(err,data)=>{//new:true => is to print the updated data in the postman API
        if(err)
        {
            res.send("ERROR "+err.message);
        }
        else{
        if(data == null){
            res.send("nothing found")
        }
        else{
            res.send(data);
        }
    }
    })
})

//FETCH or GET
app.get('/fetch/:id',function(req,res){
    fetchid = req.params.id;//getting id through param(parameter)
    monmodel.find(({id:fetchid}),function(err,val){//val->value present in the db
        if(err){
            res.send("Error..");
         console.log("ERROR. ");
        }
        else{
            if(val.length==0){//[]
                res.send("Data Doesnt Exist");
            }
       
        else{
            res.send(val);
        }
    }
    })

})

//FETCH or GET ALL
app.get("/fetchall",(req,res)=>{
    monmodel.find((err,val)=>{
        if(err){
            console.log("Errorr");
        }
        else{
            res.json(val);
        }
    })
})

//DELETE
app.delete("/del/:id",function(req,res){
  let delid = req.params.id;
  monmodel.findOneAndDelete(({id:delid}),function(err,docs){
    if(err){
        res.send("ERROR "+err.message);
    }
    else{
     if(docs==null){
         res.send("ID deosn't Exist");
     }
     else
     {
        res.send(docs);
     }
    }
  })

})

app.listen(3000,()=>{
    console.log("On Port 3000... Ready");
})