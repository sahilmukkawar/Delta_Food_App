import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Modal from '../Modals';
import Cart from '../screens/Cart';
import { useCart, useDispatchCart } from '../components/ContextReducer';
import CustOrderfd from "../screens/CustOrderfd";

export default function Navbar() {
  const [cartView, setCartView] = useState(false);
  const [custOrder, setCustOrder] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    role: "user" // default role
  });
  
  const data = useCart();
  const dispatch = useDispatchCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userEmail = localStorage.getItem("userEmail");
      const authToken = localStorage.getItem("authToken");
      
      if (userEmail && authToken) {
        try {
          const response = await fetch("http://localhost:5000/api/getUserInfo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({ email: userEmail })
          });
          
          const userData = await response.json();
          if (userData.success) {
            setUserInfo({
              name: userData.user.name,
              role: userData.user.role || 'user'
            });
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    dispatch({ type: "ORDERRECEIVED" });
    navigate("/");
  };

  const renderAdminNav = () => (
    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
      <span style={{ color: 'white', fontWeight: 'bold' }}>
        Admin: {userInfo.name}
      </span>
      
      <Link to="/orders" style={{
        padding: '8px 20px',
        backgroundColor: '#2196f3',
        color: 'white',
        borderRadius: '25px',
        textDecoration: 'none',
        fontWeight: '500'
      }}>
        All Orders
      </Link>
      
      <Link to="/AddFood" style={{
        padding: '8px 20px',
        backgroundColor: '#4caf50',
        color: 'white',
        borderRadius: '25px',
        textDecoration: 'none',
        fontWeight: '500'
      }}>
        Add Food 
      </Link>
      
      <Link to="/admin/food-items" style={{
        padding: '8px 20px',
        backgroundColor: '#ff9800',
        color: 'white',
        borderRadius: '25px',
        textDecoration: 'none',
        fontWeight: '500'
      }}>
        Food Items
      </Link>
      
      <button
        onClick={handleLogout}
        style={{
          padding: '8px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer'
        }}>
        Logout
      </button>
    </div>
  );

  const renderUserNav = () => (
    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
      <span style={{ color: 'white', fontWeight: 'bold' }}>
        Hello, {userInfo.name}
      </span>

      <button
        onClick={() => setCartView(true)}
        style={{
          padding: '8px 20px',
          backgroundColor: '#ff3d00',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer'
        }}>
        <i className="fas fa-shopping-cart"></i> Cart
        {data.length > 0 && (
          <span style={{
            backgroundColor: 'white',
            color: '#ff3d00',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {data.length}
          </span>
        )}
      </button>

      <button
        onClick={() => setCustOrder(true)}
        style={{
          padding: '8px 20px',
          backgroundColor: 'transparent',
          color: 'white',
          border: '2px solid #ff3d00',
          borderRadius: '25px',
          cursor: 'pointer'
        }}>
        My Orders
      </button>

      <button
        onClick={handleLogout}
        style={{
          padding: '8px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          cursor: 'pointer'
        }}>
        Logout
      </button>
    </div>
  );

  return (
    <nav style={{
      backgroundColor: '#1a1a1a',
      padding: '15px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{
              fontSize: '28px',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #ff3d00, #ff6e40)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Delta Food Court
            </span>
            <i className="fas fa-utensils" style={{ color: '#ff3d00', fontSize: '24px' }}></i>
          </Link>

          <div style={{
            display: isMenuOpen ? 'flex' : 'flex',
            flexDirection: isMenuOpen ? 'column' : 'row',
            alignItems: 'center',
            gap: '15px',
          }}>
            {!localStorage.getItem("authToken") ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to="/login" style={{
                  padding: '8px 20px',
                  backgroundColor: '#ff3d00',
                  color: 'white',
                  borderRadius: '25px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}>
                  Login
                </Link>
                <Link to="/createuser" style={{
                  padding: '8px 20px',
                  backgroundColor: 'transparent',
                  color: '#ff3d00',
                  borderRadius: '25px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  border: '2px solid #ff3d00'
                }}>
                  Sign Up
                </Link>
              </div>
            ) : (
              userInfo.role === 'admin' ? renderAdminNav() : renderUserNav()
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {cartView && <Modal onClose={() => setCartView(false)}><Cart onCheckout={() => setCartView(false)} /></Modal>}
      {custOrder && <Modal onClose={() => setCustOrder(false)}><CustOrderfd /></Modal>}
    </nav>
  );
}