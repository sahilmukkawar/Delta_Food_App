import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cards from '../components/Cards';
import Carousal from '../components/Carousal';
import { API_BASE_URL } from '../config';

export default function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [searchedString, setSearchedString] = useState("");
  const [cardButton, setCardButton] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  const loadData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/foodData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      setFoodCat(data[1]);
      setFoodItem(data[0]);
    } catch (error) {
      console.error("Error loading food data:", error);
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

  return (
    <div>
      <Navbar />
      {cardButton && showAlert && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Hello Foodie!</strong> You should login before you proceed...
          <button
            type="button"
            className="close"
            onClick={() => setCardButton(false)}
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}

      <Carousal setSearchedString={setSearchedString} />

      <div
        className="container"
        style={{
          backgroundImage: "url('/img/bg.png')"
        }}
      >
        {foodCat.length > 0 ? (
          foodCat.map((data, index) => (
            <div key={index} className="my-4">
              <h2 className="text-center">{data.CategoryName}</h2>
              <hr />
              <div className="d-flex justify-content-center align-items-center flex-wrap">
                {foodItem.length > 0 ? (
                  foodItem
                    .filter((item) => (
                      item.CategoryName === data.CategoryName &&
                      item.name.toLowerCase().includes(searchedString.toLowerCase())
                    ))
                    .map((categFoodItem) => (
                      <div key={categFoodItem._id} className="my-3 mx-3">
                        <Cards
                          imglink={categFoodItem.img}
                          title={categFoodItem.name}
                          description={categFoodItem.description}
                          options={categFoodItem.options[0]}
                          setcardButton={setCardButton}
                          id={categFoodItem._id}
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

      <Footer />
    </div>
  );
}