const express = require("express")
const mongoose = require("mongoose")
const path = require("path");
const cors = require("cors");
const app = express()
const mongodb = require("./mongooseConnect")
const foodRoutes = require('./Routes/foodRoutes');


mongodb();
app.use(cors());

// app.use((req,res,next)=>{
//     res.setHeader("Access-Control-Allow-Origin","https://BCACCCCC.onrender.com/");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin,X-Requested-With,Content-Type,Accept"
//     );
//     next();
// })

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://user1:hCHt58AfgDP5X@foodapp.vquc4.mongodb.net/foodapp", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("DB connected");

    // Initial fetch of food items
    const foodCollection = mongoose.connection.db.collection("food");
    const foodData = await foodCollection.find({}).toArray();
    global.food_items = foodData;
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};


app.use(express.json());
app.use("/api", require("./Routes/CreateUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/CartOrderData"));
app.use("/api", require("./Routes/CustOrderData"));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/client/build/index"));

app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/build/index.html"))
);
app.listen(5000, () => {
  console.log("server Started")
})
