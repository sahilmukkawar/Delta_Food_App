import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddAdmin() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    CategoryName: '',
    img: '',
    price: '',
    halfPrice: ''
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  // Define the base URL for API requests
  const API_BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
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
        const uniqueCategories = [...new Set(data[1].map(item => item.CategoryName))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setMessage({ text: `Failed to load categories: ${error.message}`, type: 'error' });
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
        halfPrice: calculatedHalfPrice
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Food name is required";
    if (!formData.description.trim()) return "Description is required";
    if (!formData.CategoryName) return "Category is required";
    if (!formData.img.trim()) return "Image URL is required";
    if (!formData.price || formData.price <= 0) return "Valid price is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setMessage({ text: validationError, type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('Not authenticated');
      }

      // Log data being sent to API for debugging
      const requestData = {
        name: formData.name,
        description: formData.description,
        CategoryName: formData.CategoryName,
        img: formData.img,
        price: parseFloat(formData.price)
      };
      console.log('Sending data to API:', requestData);

      // Make sure this endpoint matches your backend route
      const response = await fetch(`${API_BASE_URL}/addfood`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // First check if the response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to get error as JSON first
        let errorData;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
          throw new Error(errorData.message || `Server error: ${response.status}`);
        } else {
          // If not JSON, get text and throw a more generic error
          const textError = await response.text();
          console.error('Non-JSON error response:', textError);
          throw new Error(`Server error: ${response.status}`);
        }
      }

      // If we got here, response is OK, so parse JSON
      const data = await response.json();
      console.log('Response from API:', data);

      if (data.success) {
        setMessage({ text: 'Food item added successfully!', type: 'success' });
        setFormData({
          name: '',
          description: '',
          CategoryName: '',
          img: '',
          price: '',
          halfPrice: ''
        });
      } else {
        setMessage({ text: data.message || 'Failed to add food item', type: 'error' });
      }
    } catch (error) {
      console.error('Error adding food item:', error);
      setMessage({
        text: error.message === 'Not authenticated'
          ? 'Please login to add food items'
          : `Error: ${error.message}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Add New Food Item</h2>

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
                    required
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
                    required
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

                <div className="mb-3">
                  <label htmlFor="img" className="form-label">Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    id="img"
                    name="img"
                    value={formData.img}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="price" className="form-label">Price (Full)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="halfPrice" className="form-label">Half Price (Calculated)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="halfPrice"
                        name="halfPrice"
                        value={formData.halfPrice}
                        disabled
                      />
                      <small className="form-text text-muted">Automatically calculated as 60% of full price</small>
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className={`btn ${loading ? 'btn-secondary' : 'btn-primary'}`}
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Food Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}