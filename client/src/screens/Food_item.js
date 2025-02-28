import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cards from "../components/Cards2";
import EditFoodItem from "./EditFoodItem";


export default function Food_item() {
    const [foodCat, setFoodCat] = useState([]);
    const [foodItem, setFoodItem] = useState([]);
    const [searchedString, setSearchedString] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);

    const loadData = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/foodData", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            setFoodCat(data[1]);
            setFoodItem(data[0]);
        } catch (error) {
            console.error("Error loading food data:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <Navbar />
            <div className="container" style={{ backgroundImage: "url('/img/bg.png')" }}>
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
