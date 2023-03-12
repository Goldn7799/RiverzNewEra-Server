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
  setTimeout(async () => {
    try {
      let date = new Date();
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
              console.log("- New User -");
              console.log(`Total : ${Object.keys(data.users).length} User's`)
              save();
            }else if(data.request.action === "like"){
              const index = data.post.findIndex(dt => dt.id === data.request.id)
              if(index > -1&&data.post[index]){
                if((data.post[index].likes.filter(dts => dts === data.request.data)).length > 0){
                  data.post[index].likes = data.post[index].likes.filter(dts => dts !== data.request.data);
                  data.users[data.request.data].likes = data.users[data.request.data].likes.filter(dts => dts !== data.request.id);
                  backTo()
                }else{
                  data.post[index].likes.push(`${data.request.data}`);
                  data.users[data.request.data].likes.push(`${data.request.id}`);
                  data.users[data.post[index].sender].notify.push({"id": data.request.data, "text": "Liked Your Post", "target": data.post[index].id, "time": `${date}`})
                  backTo()
                }
              }else { backTo(); }
            }else if(data.request.action === "likeComment"){
              const indexPost = data.post.findIndex(dt => dt.id === data.request.data.postId)
              if(indexPost > -1){
                const index = data.post[indexPost].comment.findIndex(dts => dts.id === data.request.id)
                if(index > -1&&data.post[indexPost]&&data.post[indexPost].comment[index]){
                  if((data.post[indexPost].comment[index].likes.filter(dts => dts === data.request.data.myId)).length > 0){
                    data.post[indexPost].comment[index].likes = data.post[indexPost].comment[index].likes.filter(dts => dts !== data.request.data.myId);
                    backTo()
                  }else{
                    data.post[indexPost].comment[index].likes.push(`${data.request.data.myId}`);
                    data.users[data.post[indexPost].sender].notify.push({"id": data.request.data.myId, "text": `Liked Your Comment`, "target": data.post[indexPost].comment[index].id, "post": data.post[indexPost].id, "time": `${date}`})
                    backTo()
                  }
                }else { backTo(); }
              }else { backTo() }
            }else if(data.request.action === "createPost"&&(!`${data.request.data}`.includes("<")&&!`${data.request.data}`.includes(">"))){
              if(data.request.id === data.request.data.sender){
                data.post.push(data.request.data);
                console.log("- Created Post -");
                backTo();
              }else { backTo(); }
            }else if(data.request.action === "sendComment"&&(!`${data.request.data}`.includes("<")&&!`${data.request.data}`.includes(">"))){
              if(data.request.id){
                const postindex = data.post.findIndex(dt => dt.id === data.request.id);
                if(postindex){
                  data.post[postindex].comment.push(data.request.data);
                  console.log("- Send Comment -");
                  backTo()
                }else { backTo() }
              }else { backTo() }
            }else if(data.request.action === "deleteComment"){
              if(data.request.id&&data.request.data.commentId){
                const postIndex = data.post.findIndex(dt => dt.id === data.request.id);
                if(postIndex){
                  data.post[postIndex].comment = data.post[postIndex].comment.filter(dts => dts.id !== data.request.data.commentId);
                  console.log("- Deleted Comment -");
                  backTo();
                }else{ backTo() }
              }else { backTo() }
            }else if(data.request.action === "deletePost"){
              if(data.request.id&&data.request.data){
                const post = data.post.filter(dt => dt.id === data.request.id)[0];
                if(post&&post.sender === data.request.data){
                  data.post = data.post.filter(dts => dts.id !== data.request.id);
                  console.log("- Deleted Post -");
                  backTo();
                }else{ backTo() }
              }else { backTo() }
            }else if(data.request.action === "followUser"){
              if(data.request.id&&data.request.data){
                if(data.users[data.request.data].follower.includes(data.request.id)){
                  data.users[data.request.data].follower = data.users[data.request.data].follower.filter(dt => dt !== data.request.id);
                  data.users[data.request.id].following = data.users[data.request.id].following.filter(dt => dt !== data.request.data);
                  backTo();
                }else {
                  data.users[data.request.data].follower.push(data.request.id);
                  data.users[data.request.id].following.push(data.request.data);
                  data.users[data.request.data].notify.push({"id": data.request.id, "text": "Following You", "target": "following", "time": `${date}`});
                  backTo();
                }
              }else { backTo() }
            }else { check(); }
          }else { check(); }
        }
      })
    }catch(e) {
      console.log("Restarted...")
      backTo()
    }
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