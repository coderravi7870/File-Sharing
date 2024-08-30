const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require("dotenv").config();
const connetion = require("./config/db");
connetion();

app.use(express.json());
app.use(cors());

// Template engine
app.set('views', path.join(__dirname,'/views'))
app.set('view engine','ejs');
app.use(express.static('public'));

// file routes
const fileRoutes = require("./routes/fileRoutes");
app.use("/files",fileRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
    
})

// iMwC0pbhK7aHkD3B