const mongoClient=require("mongodb").MongoClient

const state={
  db:null,
}

module.exports.connect=(done)=>{
  const url="mongodb+srv://afsalcp:afsalcp@786@cluster0.cuezd.mongodb.net/telagram-bot?retryWrites=true&w=majority"
  //const url="mongodb://localhost:192.168.43.212"
  const dbname="youdow"
  
  mongoClient.connect(url,{ useUnifiedTopology: true },(err,data)=>{
    if(err) return done(err)
    state.db=data.db(dbname)
    done()
  })
}
module.exports.get=()=>{
  return state.db
}
