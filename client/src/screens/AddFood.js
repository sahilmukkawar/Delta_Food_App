import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddAdmin() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    CategoryName: '',
    img: '',
    price: '',
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  // Fetch existing categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/foodData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();
        const uniqueCategories = [...new Set(data[1].map(item => item.CategoryName))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setMessage({ text: 'Failed to load categories', type: 'error' });
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create the food item object with options array
      const foodItem = {
        ...formData,
        options: [
          {
            half: formData.price * 0.6,  // Set half price as 60% of full price
            full: formData.price
          }
        ]
      };

      const response = await fetch('http://localhost:5000/api/addfood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(foodItem)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ text: 'Food item added successfully!', type: 'success' });
        // Clear form
        setFormData({
          name: '',
          description: '',
          CategoryName: '',
          img: '',
          price: '',
        });
      } else {
        setMessage({ text: 'Failed to add food item', type: 'error' });
      }
    } catch (error) {
      console.error('Error adding food item:', error);
      setMessage({ text: 'Error adding food item', type: 'error' });
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
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
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
                  />
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
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