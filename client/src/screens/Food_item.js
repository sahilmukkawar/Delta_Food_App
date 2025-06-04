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
        loadData();
    }, []);

    const handleDelete = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                throw new Error('Not authenticated');
            }

            const response = await fetch(`${API_BASE_URL}/deleteFoodItem`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ id: itemId })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessage({ text: 'Food item deleted successfully!', type: 'success' });
                loadData(); // Reload the food items
            } else {
                throw new Error(data.message || 'Failed to delete food item');
            }
        } catch (error) {
            console.error('Error deleting food item:', error);
            setMessage({
                text: error.message === 'Not authenticated'
                    ? 'Please login to delete food items'
                    : `Error: ${error.message}`,
                type: 'error'
            });
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ backgroundImage: "url('/img/bg.png')" }}>
                {message.text && (
                    <div style={{
                        padding: '10px',
                        margin: '20px 0',
                        borderRadius: '4px',
                        backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: message.type === 'success' ? '#155724' : '#721c24'
                    }}>
                        {message.text}
                    </div>
                )}

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
                    onUpdate={loadData}
                />
            )}
            <Footer />
        </>
    );
}
