var express = require('express');
var router = express.Router();
var admin={id:"afsalcp",pass:"afsalcp@786"}

var ObjectId = require("mongodb").ObjectId;


const db=require("../connection")

var loginCheck=(req,res,next)=>{
  if(req.session.login){
    next()
  }else{
    res.redirect("/admin")
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.login){
    res.redirect("/admin/home")
  }
  else{
  res.render('admin', { title: "admin panel"});
  }
});
router.post('/adminLogin',(req,res)=>{
  var data=req.body
  console.log(data)
  if(String(data.id)==="afsalcp"&&String(data.password)==="afsalcp@786"){
    console.log("if state")
    req.session.login=true
    res.redirect("/admin/home")
  }else{
    console.error("else state")
    res.redirect("/admin/")
  }
})
router.get("/home",loginCheck,async(req,res)=>{
  var mess=await db.get().collection("message").find().toArray()
  mess=mess.reverse()
  //console.log(mess)
  res.render("admin",{title:"ADMIN HOME PAGE",login:true,message:mess})
})

router.post("/deleteMessage",loginCheck,(req,res)=>{
  var id=req.body.id
  console.log(id)
  db.get().collection("message").deleteOne({_id:ObjectId(id)}).then(data=>{
    res.json({sts:true})
  }).catch(err=>{
    console.log(err)
    res.json({sts:false})
  })
})
router.get("/getMessData",loginCheck,(req,res)=>{
  var id=req.query.id;
  db.get().collection("message").findOne({_id:ObjectId(id)}).then(data=>{
    res.json({sts:true,data:data})
  }).catch(err=>{
    res.json({sts:false})
  })
})


module.exports = router;
