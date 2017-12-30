const express = require("express"),
      app = express();
      
app.get("/", (req, res)=>{
    res.send("root route");
});

app.listen(process.env.PORT, process.env.IP);