import React from 'react';
import { useCart, useDispatchCart } from '../components/ContextReducer';

export default function Cart(props) {
  const data = useCart();
  const dispatch = useDispatchCart();

  const totalPrice = data.reduce((total, food) => total + food.price, 0);

  async function handleCheckOut() {
    try {
      const response = await fetch("http://localhost:5000/api/cartorderdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
          order: data,
          price: totalPrice
        })
      });

      const json = await response.json();
      if (json.success) {
        dispatch({ type: "ORDERRECEIVED" });
        alert("YAY! Order Received");
        props.onCheckout();
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an error processing your order. Please try again.");
    }
  }

  if (data.length === 0) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        color: '#fff'
      }}>
        <i className="fas fa-shopping-cart" style={{
          fontSize: '48px',
          color: '#666',
          marginBottom: '20px'
        }}></i>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '500',
          color: '#888'
        }}>Your Cart is Empty!</h3>
        <p style={{ color: '#666' }}>Add some delicious items to get started</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div className="container">
        <h2 style={{
          color: '#fff',
          marginBottom: '20px',
          fontSize: '24px',
          fontWeight: '600'
        }}>Your Cart</h2>

        <div className="table-responsive">
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 8px'
          }}>
            <thead>
              <tr style={{
                borderBottom: '2px solid #333'
              }}>
                <th style={{ color: '#888', padding: '12px', textAlign: 'left' }}>#</th>
                <th style={{ color: '#888', padding: '12px', textAlign: 'left' }}>Item</th>
                <th style={{ color: '#888', padding: '12px', textAlign: 'center' }}>Qty</th>
                <th style={{ color: '#888', padding: '12px', textAlign: 'center' }}>Size</th>
                <th style={{ color: '#888', padding: '12px', textAlign: 'right' }}>Price</th>
                <th style={{ color: '#888', padding: '12px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((food, index) => (
                <tr key={index} style={{
                  backgroundColor: '#222',
                  borderRadius: '8px',
                  transition: 'all 0.3s'
                }}>
                  <td style={{ color: '#fff', padding: '16px', borderRadius: '8px 0 0 8px' }}>
                    {index + 1}
                  </td>
                  <td style={{ color: '#fff', padding: '16px' }}>
                    <div style={{ fontWeight: '500' }}>{food.name}</div>
                  </td>
                  <td style={{ color: '#fff', padding: '16px', textAlign: 'center' }}>
                    {food.qty}
                  </td>
                  <td style={{ color: '#fff', padding: '16px', textAlign: 'center' }}>
                    {food.size}
                  </td>
                  <td style={{ color: '#ff3d00', padding: '16px', textAlign: 'right', fontWeight: '600' }}>
                    ₹{food.price}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', borderRadius: '0 8px 8px 0' }}>
                    <button
                      onClick={() => dispatch({ type: "REMOVE", index: index })}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseOver={e => e.target.style.backgroundColor = '#c82333'}
                      onMouseOut={e => e.target.style.backgroundColor = '#dc3545'}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          marginTop: '30px',
          borderTop: '1px solid #333',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{
            color: '#fff',
            fontSize: '24px',
            fontWeight: '600'
          }}>
            Total: <span style={{ color: '#ff3d00' }}>₹{totalPrice}/-</span>
          </div>

          <button
            onClick={handleCheckOut}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={e => e.target.style.backgroundColor = '#218838'}
            onMouseOut={e => e.target.style.backgroundColor = '#28a745'}
          >
            <i className="fas fa-check-circle"></i>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}