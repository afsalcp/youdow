var express = require('express');
var router = express.Router();
var fs = require("fs");

var ytdl=require("ytdl-core")
const nodemailer=require('nodemailer')
var transporter=nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:"cpafsal66@gmail.com",
    pass:"9496130662"
  }
})


/* GET users listing. */
router.get('/', function(req, res, ) {
  res.render("home", {
    title: "HOME PAGE"
  })
});
router.get('/search', (req, res)=> {
  try{
  var url = req.query.url
  console.log(url)
  var jsonDet;
  var remove=[]
  ytdl(url).on("info",(info)=>{
    try{
    for (var i in info.formats){
   //   console.log(i)
      if(String(info.formats[i].audioCodec)=="null" || String(info.formats[i].videoCodec)=="null"){
        remove.push(i)
      }
      
    }
    var audioOnly=info.formats[info.formats.findIndex(x=>String(x.qualityLabel)=="null")]
    //console.log(info.formats)
    var videoOnly=info.formats[info.formats.findIndex(x=>x.hasAudio==false&&x.qualityLabel=="480p")]
    for(var i=remove.length-1;i>=0;i-=1){
      //console.log(info.formats[remove[i]])
      info.formats.splice(remove[i],1)
    }
    //console.log(info.formats)
    var det=info.videoDetails
    //console.log(det.author.thumbnails )
    var format=info.formats
    var data=[]
    data.push({quality:"mp3",itag:audioOnly.itag,size:"MP3"})
    console.log(videoOnly)
    data.push({quality:"vid only",itag:videoOnly.itag,size:String(parseFloat(videoOnly.bitrate)*parseFloat(det.lengthSeconds)/8000000)})
    for(var i in format){
      var quade={
        quality: format[i].qualityLabel,
        itag:format[i].itag,
        size:String(parseFloat(det.lengthSeconds*format[i].bitrate)/8000000)
      }
      data.push(quade)
    }
    var jsonData={
      title:det.title,
      thumbnail:det.thumbnails[det.thumbnails.length-1].url,
      duration:det.lengthSeconds,
      profile:det.author.thumbnails[det.author.thumbnails.length-1].url,
      url:url,
      download:data,
      channel:det.author.name
    }
    //console.log(format)
    res.json(jsonData)
    }catch(err){
      console.log("afsal")
      res.send("false")
    }
  })
  }catch(err){
    console.log("afsl")
  }
})
router.get("/download",async(req,res)=>{
  try{
  var url=req.query.url
  var file_name=req.query.file_name.replace(/ /g,"")
  console.log("afsal.    "+url)
  res.attachment(file_name+".mp4")
  console.log(req.query)
  ytdl(url,{quality:req.query.itag,format:"mp4"}).pipe(res)
  }catch(err){
    console.log(err)
  }
})
router.post("/message",(req,res)=>{
  var data=req.body
  console.log(data)
  var mailer={
        from:"cpafsal66@gmail.com",
        to:"afsalcpats@gmail.com",
        subject:"YOUDOW USER FEEDBACK",
        text:`${data.name} has been sended a feedback\n\nmessage_type: - ${data.type}\nuser_email :-${data.email}\nmessage :- ${data.message}\n\nPlease replay`
      }
      transporter.sendMail(mailer,(err,data)=>{
        if(err) {
          console.log(err)
          res.json({sts:false})
        }
        else{
          console.log("success")
          res.json({sts:true})
        }
      })
})


module.exports = router;