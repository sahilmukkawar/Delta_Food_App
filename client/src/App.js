import Home from "./screens/Home";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Order from "./screens/Orders.js";
import AddFood from './screens/AddFood.js';
import AddCategory from './screens/AddCategory.js';
import Food_item from "./screens/Food_item.js";


import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css"
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
import { CartProvider } from "./components/ContextReducer";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/createuser" element={<Signup />} />
            <Route exact path="/orders" element={<Order />} />
            <Route exact path="/addfood" element={<AddFood />} />
            <Route exact path="/addcategory" element={<AddCategory />} />
            <Route exact path="/Food_item" element={<Food_item />} />

          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
