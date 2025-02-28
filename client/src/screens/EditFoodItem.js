import React, { useState, useEffect } from "react";

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

    // Define the base URL for API requests
    const API_BASE_URL = "http://localhost:5000/api";

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
                    // Set an empty array to prevent further errors
                    setCategories([]);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                setMessage({ text: `Failed to load categories: ${error.message}`, type: 'error' });
                // Set an empty array to prevent further errors
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

        if (!selectedItem || !selectedItem._id) {
            setMessage({ text: "No item selected for editing", type: 'error' });
            return;
        }

        setLoading(true);

        try {
            const authToken = localStorage.getItem('authToken');

            // Prepare request data
            const requestData = {
                id: selectedItem._id,
                name: formData.name,
                description: formData.description,
                CategoryName: formData.CategoryName,
                img: formData.img,
                options: [
                    {
                        half: formData.half,
                        full: formData.price
                    }
                ]
            };

            console.log('Sending data to API:', requestData);

            const response = await fetch(`${API_BASE_URL}/updateFoodItem`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken ? `Bearer ${authToken}` : ''
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log('Response from API:', data);

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
                setMessage({ text: data.message || 'Failed to update food item', type: 'error' });
            }
        } catch (error) {
            console.error('Error updating food item:', error);
            setMessage({
                text: `Error: ${error.message}`,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2 className="text-center mb-4">Edit Food Item</h2>

                {message.text && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} mb-4`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Food Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="CategoryName" className="form-label">Category</label>
                        <select
                            className="form-control"
                            id="CategoryName"
                            name="CategoryName"
                            value={formData.CategoryName}
                            onChange={handleChange}
                        >
                            <option value="">Select Category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="img" className="form-label">Image URL</label>
                        <input
                            type="text"
                            className="form-control"
                            id="img"
                            name="img"
                            value={formData.img}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="price" className="form-label">Price (Full)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="half" className="form-label">Half Price</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="half"
                                    name="half"
                                    value={formData.half}
                                    onChange={handleChange}
                                />
                                <small className="form-text text-muted">Auto-calculated as 60% of full price</small>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Food Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}