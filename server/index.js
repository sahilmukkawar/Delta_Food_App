const express = require("express")
const path = require("path");
const cors = require("cors");
const app = express()
const { mongodb } = require("./mongooseConnect")
const foodRoutes = require("./Routes/foodRoutes");


mongodb();
app.use(cors());

app.use(express.json());
app.use("/api", require("./Routes/CreateUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/CartOrderData"));
app.use("/api", require("./Routes/CustOrderData"));
app.use("/api", foodRoutes);


// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "/client/build/index"));

// app.use(express.static(path.join(__dirname, "../client/build")));
// app.get("*", (req, res) =>
//   res.sendFile(path.join(__dirname, "../client/build/index.html"))
// );
app.listen(5000, () => {
  console.log("server Started")
})
