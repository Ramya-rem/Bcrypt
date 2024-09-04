const express=require("express");
const jsonwebtoken=require ("jsonwebtoken");
const bcrypt=require('bcrypt');
const app=express();
const port=4332;

const secret="mysecretkey";
app.use(express.json())
const arr=[]
app.post('/reg',async(req,res)=>{
    const {username,password}=req.body;
    const hashpassword=await bcrypt.hash(password,10);
    arr.push({username,password:hashpassword});
    res.json({msg:"Success"}).status(200);
})

app.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    const user=arr.find(f=>f.username==username);
    if(!(user)){
        return res.json({msg: " User not exist"}).status(400);

    }



    const ispassword=await bcrypt.compare(password,user.password)
    if(!(ispassword)){
        return res.json({msg: "Password incorrect"}).status(400);
    }

    const token=jsonwebtoken.sign({username:user.username},secret,{expiresIn:"1h"});
    res.json({token});
   
})

app.get('/secure',(req,res)=>{
    const authorization=req.headers.authorization;

    if(!(authorization)){
        return res.status(405).json({msg:"header is missing"});

    }
    const token=authorization.split(" ")[1];
    try{
        const decode= jsonwebtoken.verify(token,secret);
        res.json({msg:`verified succeful....welcome ${decode.username}`});
    }
    catch(e){
        res.status(404).json({msg: " error"});

    }
})


app.listen(port,()=>{
    console.log(`server running at ${port}`);
})