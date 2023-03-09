import fs from "fs"

//configure
let data = {};

//function script
const save = async ()=>{
  let date = new Date();
  fs.writeFile("./database.json", JSON.stringify(data), (err)=>{
    if(err){
      console.error(err);
    }else {
      console.log(`Updated Database at ${date}`)
      check();
    }
  })
}
const backTo = ()=>{
  data.request = {
    action : ""
  }
  save();
}
const check = async ()=>{
  setTimeout(() => {
    fs.readFile("./database.json", "utf-8", (err,res)=>{
      if(err){
        console.error(err);
      }else {
        data = JSON.parse(res);
        if(data.request.action.length > 0){
          if(data.request.action === "user"){
            data.users[data.request.id] = data.request.data;
            data.request = {
              action : ""
            }
            save();
          }else if(data.request.action === "like"){
            const index = data.post.findIndex(dt => dt.id === data.request.id)
            if(index > -1&&data.post[index]){
              if((data.post[index].likes.filter(dts => dts === data.request.data)).length > 0){
                data.post[index].likes = data.post[index].likes.filter(dts => dts !== data.request.data);
                backTo()
              }else{
                data.post[index].likes.push(`${data.request.data}`);
                backTo()
              }
            }else { backTo(); }
          }else if(data.request.action === "likeComment"){
            const indexPost = data.post.findIndex(dt => dt.id === data.request.data.postId)
            const index = data.post[indexPost].comment.findIndex(dts => dts.id === data.request.id)
            console.log(data.post[indexPost].comment)
            if(index > -1&&data.post[indexPost]&&data.post[indexPost].comment[index]){
              if((data.post[indexPost].comment[index].likes.filter(dts => dts === data.request.data.myId)).length > 0){
                data.post[indexPost].comment[index].likes = data.post[indexPost].comment[index].likes.filter(dts => dts !== data.request.data.myId);
                backTo()
              }else{
                data.post[indexPost].comment[index].likes.push(`${data.request.data.myId}`);
                backTo()
              }
            }else { backTo(); }
          }else { check(); }
        }else { check(); }
      }
    })
  }, 100);
}

const timeUpdate = ()=>{
  setTimeout(() => {
    const date = new Date();
    fs.writeFile("./time.json", JSON.stringify({"time": { "now": `${date}` }}), (err)=>{
      if(err){
        console.error(err);
      }else {
        timeUpdate();
      }
    })
  }, 1000);
}
timeUpdate()

check()