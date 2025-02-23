import React, { useState } from 'react';

export default function Carousel(props) {
  const [search, setSearch] = useState("");

  const carouselItems = [
    {
      id: 1,
      image: "https://burst.shopifycdn.com/photos/flatlay-iron-skillet-with-meat-and-other-food.jpg?width=1200&format=pjpg&exif=1&iptc=1",
      title: "Delicious Cuisine",
      description: "Explore our wide range of dishes"
    },
    {
      id: 2,
      image: "https://burst.shopifycdn.com/photos/two-pizzas-and-wine.jpg?width=1850&format=pjpg&exif=1&iptc=1",
      title: "Fresh & Hot Pizza",
      description: "Handcrafted with love"
    },
    {
      id: 3,
      image: "https://burst.shopifycdn.com/photos/fried-comfort-food-chicken.jpg?width=1850&format=pjpg&exif=1&iptc=1",
      title: "Comfort Food",
      description: "Taste that feels like home"
    }
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Search Bar Overlay */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: '600px',
        zIndex: 20,
        padding: '0 20px'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '50px',
          padding: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="search"
              placeholder="Search for your favorite food..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                props.setSearchedString(e.target.value);
              }}
              style={{
                width: '100%',
                padding: '12px 45px',
                border: 'none',
                borderRadius: '50px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: 'transparent'
              }}
            />
            <i className="fas fa-search" style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#ff3d00'
            }}></i>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-pause="false">
        <div className="carousel-inner" style={{
          height: '600px',
          overflow: 'hidden',
          borderRadius: '20px'
        }}>
          {carouselItems.map((item, index) => (
            <div key={item.id} className={`carousel-item ${index === 0 ? 'active' : ''}`} data-bs-interval="3000">
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4))'
              }}></div>
              <img 
                src={item.image} 
                className="d-block w-100" 
                alt={item.title}
                style={{
                  height: '600px',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  borderRadius: '20px'
                }}
              />
              <div className="carousel-caption" style={{
                bottom: '30%',
                textAlign: 'center'
              }}>
                <h2 style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  color: '#fff'
                }}>{item.title}</h2>
                <p style={{
                  fontSize: '1.3rem',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  color: '#f1f1f1'
                }}>{item.description}</p>
                
                {/* Order Now Button */}
                <button style={{
                  marginTop: '15px',
                  padding: '10px 25px',
                  fontSize: '1rem',
                  backgroundColor: '#ff3d00',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" style={{
            filter: 'invert(100%)'
          }}></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" style={{
            filter: 'invert(100%)'
          }}></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
