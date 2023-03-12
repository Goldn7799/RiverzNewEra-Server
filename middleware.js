module.exports = (req, res, next) => {
  if(req.url === "/request"&&req.method === "GET"){
    res.sendStatus(403);
  }else if(req.url === "/ping"&&req.method === "GET"){
    next();
  }else if(req.url === "/users"&&req.method === "GET"){
    next();
  }else if(req.url === "/post"&&req.method === "GET"){
    next();
  }else {
    if(req.url === "/request"&&req.method === "POST"){
      next();
    }else if(req.url === "/ping"&&req.method === "POST"){
      res.sendStatus(403);
    }else if(req.url === "/users"&&req.method === "POST"){
      res.sendStatus(403);
    }else if(req.url === "/post"&&req.method === "POST"){
      res.sendStatus(403);
    }else {
      res.sendStatus(404)
    }
  }
}