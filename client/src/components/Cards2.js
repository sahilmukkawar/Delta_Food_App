import React, { useState, useEffect } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';

export default function Cards2(props) {
    const [qty, setQty] = useState(1);
    const [size, setSize] = useState("");
    const [cartButtonText, setCartButtonText] = useState("EDIT");
    const keylist = Object.keys(props.options);
    const dispatch = useDispatchCart();
    const cart = useCart();

    useEffect(() => {
        setSize(keylist[0]);
        const existingItem = cart.find(item => item.id === props.id);
        if (existingItem) {
            setQty(existingItem.qty);
            setSize(existingItem.size);
            setCartButtonText("✓ UPDATED");
        }
    }, [cart]);

    const finalPrice = qty * parseInt(props.options[size]);

    async function handleEditCart() {
        if (!localStorage.getItem("authToken")) {
            props.setcardButton(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            await dispatch({
                type: "UPDATE",
                id: props.id,
                name: props.title,
                qty: qty,
                img: props.imglink,
                size: size,
                price: finalPrice
            });
            setCartButtonText("✓ UPDATED");
            setTimeout(() => {
                setCartButtonText("EDIT");
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
            </div>

            <div style={{ padding: "16px" }}>
                <h5 style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "#1c1c1c"
                }}>{props.title}</h5>

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

                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px"
                }}>
                    {/* Beautified Buttons Only */}
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button
                            onClick={props.onEdit}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "8px 14px",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0056b3"}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#007bff"}
                        >
                            <i className="fas fa-edit" style={{ marginRight: "6px" }}></i> Edit
                        </button>

                        <button
                            onClick={props.onDelete}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "8px 14px",
                                backgroundColor: "#dc3545",
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#a71d2a"}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#dc3545"}
                        >
                            <i className="fas fa-trash" style={{ marginRight: "6px" }}></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
