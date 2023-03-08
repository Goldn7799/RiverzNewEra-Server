import fs from "fs"

//configure
let data = {};

//function script
const save = async ()=>{
  fs.writeFile("./database.json", JSON.stringify(data), (err)=>{
    if(err){
      console.error(err);
    }else {
      console.log("updated")
      check();
    }
  })
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
          }else { check(); }
        }else { check(); }
      }
    })
  }, 100);
}

check()