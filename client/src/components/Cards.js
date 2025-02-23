import React, { useState, useEffect } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';

export default function Card(props) {
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [cartButtonText, setCartButtonText] = useState("ADD");
  const keylist = Object.keys(props.options);
  const dispatch = useDispatchCart();
  
  useEffect(() => {
    setSize(keylist[0]);
  }, []);

  const finalPrice = qty * parseInt(props.options[size]);

  async function handleAddToCart() {
    if (!localStorage.getItem("authToken")) {
      props.setcardButton(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      await dispatch({
        type: "ADD",
        id: props.id,
        name: props.title,
        qty: qty,
        img: props.imglink,
        size: size,
        price: finalPrice
      });
      setCartButtonText("✓ ADDED");
      setTimeout(() => {
        setCartButtonText("ADD");
      }, 2000);
    }
  }

  return (
    <div className="card m-6" style={{
      width: "320px",
      borderRadius: "16px",
      border: "1px solid #e8e8e8",
      backgroundColor: "white",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer"
    }}>
      {/* Image Container */}
      <div style={{
        position: "relative",
        height: "200px",
        overflow: "hidden",
        borderRadius: "16px 16px 0 0"
      }}>
        <img 
          src={props.imglink} 
          alt={props.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s"
          }}
          onMouseOver={e => e.target.style.transform = "scale(1.1)"}
          onMouseOut={e => e.target.style.transform = "scale(1.0)"}
        />
        <div style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          backgroundColor: "rgba(256, 256, 256, 0.9)",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "500",
          color: "#1c1c1c"
        }}>
          ⭐ Bestseller
        </div>
      </div>

      {/* Content Container */}
      <div style={{ padding: "16px" }}>
        <h5 style={{
          fontSize: "18px",
          fontWeight: "600",
          marginBottom: "8px",
          color: "#1c1c1c"
        }}>{props.title}</h5>

        {/* Description */}
        <div style={{
          fontSize: "14px",
          color: "#666",
          marginBottom: "12px",
          lineHeight: "1.4",
          maxHeight: "40px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: "2",
          WebkitBoxOrient: "vertical"
        }}>
          {props.description}
        </div>

        {/* Price and Size Row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px"
        }}>
          <div style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#1c1c1c"
          }}>₹{finalPrice}</div>
          
          <select 
            value={size}
            onChange={(e) => setSize(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #e8e8e8",
              backgroundColor: "#f8f8f8",
              fontSize: "14px",
              color: "#1c1c1c",
              cursor: "pointer"
            }}
          >
            {keylist.map((data) => (
              <option key={data} value={data}>{data}</option>
            ))}
          </select>
        </div>

        {/* Quantity and Add Button Row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px"
        }}>
          <select
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #e8e8e8",
              backgroundColor: "#f8f8f8",
              width: "80px",
              fontSize: "14px",
              color: "#1c1c1c",
              cursor: "pointer"
            }}
          >
            {Array.from(Array(6), (_, i) => (
              <option key={i + 1} value={i + 1}>Qty: {i + 1}</option>
            ))}
          </select>

          <button
            onClick={handleAddToCart}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: cartButtonText === "ADD" ? "#ff3d00" : "#37b53f",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "14px",
              transition: "background-color 0.3s",
              cursor: "pointer"
            }}
          >
            {cartButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}