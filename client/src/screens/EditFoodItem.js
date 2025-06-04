import React, { useState, useEffect } from "react";
import { API_BASE_URL } from '../config';

export default function EditFoodItem({ selectedItem, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        CategoryName: "",
        img: "",
        price: "",
        half: ""
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // First, populate the form data when selectedItem changes
    useEffect(() => {
        if (selectedItem) {
            console.log("Selected item received:", selectedItem);

            // Extract price information from options array
            let fullPrice = "";
            let halfPrice = "";

            if (selectedItem.options && Array.isArray(selectedItem.options) && selectedItem.options.length > 0) {
                fullPrice = selectedItem.options[0].full || "";
                halfPrice = selectedItem.options[0].half || "";
            }

            setFormData({
                name: selectedItem.name || "",
                description: selectedItem.description || "",
                CategoryName: selectedItem.CategoryName || "",
                img: selectedItem.img || "",
                price: fullPrice,
                half: halfPrice
            });
        }
    }, [selectedItem]);

    // Separate useEffect for fetching categories to avoid dependency issues
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                console.log("Fetching categories...");
                const response = await fetch(`${API_BASE_URL}/foodData`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }

                const data = await response.json();
                console.log("API response:", data);

                // Safely extract categories
                if (data && Array.isArray(data) && data.length > 1 && Array.isArray(data[1])) {
                    const categoryItems = data[1].filter(item => item && item.CategoryName);
                    const uniqueCategories = [...new Set(categoryItems.map(item => item.CategoryName))];
                    console.log("Unique categories:", uniqueCategories);
                    setCategories(uniqueCategories);
                } else {
                    console.error("Unexpected data format:", data);
                    setMessage({ text: "Could not load categories. Unexpected data format.", type: 'error' });
                    setCategories([]);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                setMessage({ text: `Failed to load categories: ${error.message}`, type: 'error' });
                setCategories([]);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Automatically calculate half price when full price changes
        if (name === 'price') {
            const fullPrice = parseFloat(value) || 0;
            const calculatedHalfPrice = (fullPrice * 0.6).toFixed(2);
            setFormData(prev => ({
                ...prev,
                half: calculatedHalfPrice
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                throw new Error('Not authenticated');
            }

            const requestData = {
                id: selectedItem._id,
                name: formData.name,
                description: formData.description,
                CategoryName: formData.CategoryName,
                img: formData.img,
                options: [
                    {
                        half: parseFloat(formData.half),
                        full: parseFloat(formData.price)
                    }
                ]
            };

            console.log('Sending update request:', requestData);

            const response = await fetch(`${API_BASE_URL}/updateFoodItem`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            // Check if the response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned non-JSON response');
            }

            const data = await response.json();
            console.log('Update response:', data);

            if (response.ok && data.success) {
                setMessage({ text: 'Food item updated successfully!', type: 'success' });
                if (typeof onUpdate === 'function') {
                    onUpdate();
                }
                setTimeout(() => {
                    if (typeof onClose === 'function') {
                        onClose();
                    }
                }, 1500);
            } else {
                throw new Error(data.message || 'Failed to update food item');
            }
        } catch (error) {
            console.error('Error updating food item:', error);
            setMessage({
                text: error.message === 'Not authenticated'
                    ? 'Please login to edit food items'
                    : `Error: ${error.message}`,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div className="modal-content" style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                width: '90%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h2 style={{ margin: 0 }}>Edit Food Item</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#666'
                        }}
                    >
                        ×
                    </button>
                </div>

                {message.text && (
                    <div style={{
                        padding: '10px',
                        marginBottom: '20px',
                        borderRadius: '4px',
                        backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: message.type === 'success' ? '#155724' : '#721c24'
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Food Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                minHeight: '100px'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Category</label>
                        <select
                            name="CategoryName"
                            value={formData.CategoryName}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Image URL</label>
                        <input
                            type="text"
                            name="img"
                            value={formData.img}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Full Price</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Half Price</label>
                            <input
                                type="number"
                                name="half"
                                value={formData.half}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '10px',
                        marginTop: '20px'
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                background: 'white',
                                cursor: 'pointer'
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '8px 16px',
                                borderRadius: '4px',
                                border: 'none',
                                background: '#007bff',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}