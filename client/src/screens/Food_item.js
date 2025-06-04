import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cards from "../components/Cards2";
import EditFoodItem from "./EditFoodItem";
import { API_BASE_URL } from '../config';

export default function Food_item() {
    const [foodCat, setFoodCat] = useState([]);
    const [foodItem, setFoodItem] = useState([]);
    const [searchedString, setSearchedString] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    const loadData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/foodData`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            setFoodCat(data[1]);
            setFoodItem(data[0]);
        } catch (error) {
            console.error("Error loading food data:", error);
            setMessage({ text: "Failed to load food items", type: 'error' });
        }
    };

    useEffect(() => {
        // Initial load
        loadData();

        // Set up polling every 5 seconds
        const pollInterval = setInterval(() => {
            loadData();
        }, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(pollInterval);
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/deleteFoodItem`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            });

            const data = await response.json();
            if (data.success) {
                setMessage({ text: 'Food item deleted successfully', type: 'success' });
                // Refresh data immediately after deletion
                loadData();
            } else {
                setMessage({ text: data.message || 'Failed to delete food item', type: 'error' });
            }
        } catch (error) {
            console.error('Error deleting food item:', error);
            setMessage({ text: 'Failed to delete food item', type: 'error' });
        }
    };

    return (
        <div>
            <Navbar />
            {message.text && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
                    {message.text}
                    <button type="button" className="btn-close" onClick={() => setMessage({ text: '', type: '' })} aria-label="Close"></button>
                </div>
            )}

            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h2 className="text-center my-4">Manage Food Items</h2>
                    </div>
                </div>

                {foodCat.length > 0 ? (
                    foodCat.map((data, index) => (
                        <div key={index} className="my-4">
                            <h2 className="text-center">{data.CategoryName}</h2>
                            <hr />
                            <div className="d-flex justify-content-center align-items-center flex-wrap">
                                {foodItem.length > 0 ? (
                                    foodItem
                                        .filter(
                                            (item) =>
                                                item.CategoryName === data.CategoryName &&
                                                item.name.toLowerCase().includes(searchedString.toLowerCase())
                                        )
                                        .map((categFoodItem) => (
                                            <div key={categFoodItem._id} className="my-3 mx-3">
                                                <Cards
                                                    imglink={categFoodItem.img}
                                                    title={categFoodItem.name}
                                                    description={categFoodItem.description}
                                                    options={categFoodItem.options[0]}
                                                    id={categFoodItem._id}
                                                    onEdit={() => setSelectedItem(categFoodItem)}
                                                    onDelete={() => handleDelete(categFoodItem._id)}
                                                />
                                            </div>
                                        ))
                                ) : (
                                    <div>No Such Data Found</div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>Loading...</div>
                )}
            </div>

            {selectedItem && (
                <EditFoodItem
                    selectedItem={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onUpdate={() => {
                        loadData();
                        setSelectedItem(null);
                    }}
                />
            )}

            <Footer />
        </div>
    );
}
