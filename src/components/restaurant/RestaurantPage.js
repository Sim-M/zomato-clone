import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header";
import jwt_decode from "jwt-decode";

function RestaurantPage() {
    let [tab, setTab] = useState(1);
    let {id} = useParams();                                                     // id is defined in App.js 

    let initValue = {                                                           // initValue = initial/default value
        aggregate_rating: 0,
        city: "",
        city_id: -1,
        contact_number: 0,
        cuisine: [],
        cuisine_id: [],
        image: "",
        locality: "",
        location_id: -1,
        mealtype_id: -1,
        min_price: 0,
        name: "",
        rating_text: "",
        thumb: [],
        _id: -1,
    }                                                     
    let [restaurant, setRestaurant] = useState({...initValue});
    let [menuItems, setMenuItems] = useState([]);
    let [totalPrice, setTotalPrice] = useState(0);

    let getTokenDetails = () => {
        //reading data from localstorage
        let token = localStorage.getItem('auth-token')
        if(token === null) {
            return false;
        } else {
            return jwt_decode(token);
        }
    };

    let [userDetails, setUserDtails] = useState(getTokenDetails); 

    let getRestaurantDetail = async () => {
        try{
            let URL = "http://localhost:5003/api/get-restaurant-by-id/" + id;
            let {data} = await axios.get(URL);
            console.log(data);
            if(data.status === true){
                setRestaurant({...data.result});
            } else {
                setRestaurant({...initValue});
            }

        } catch(error) {
            console.log(error);
            alert("Server Error");
        }
        
    }

    let getMenuItems = async () => {
        try{
            let URL = "http://localhost:5003/api/get-menuitems/" + id;
            let {data} = await axios.get(URL);
                if(data.status === true){
                    setMenuItems([...data.result]);
                } else {
                    setMenuItems([]);
                }
                setTotalPrice(0);                                       //to reset the total price after reload
        } catch(error) {
            console.log(error);
            alert("Server Error");
        }
    }

    let addMenuItemQty = (index) => {
        let _menuItems = [...menuItems];
        _menuItems[index].qty += 1;
        let menu_price = Number(_menuItems[index].price); 
        setTotalPrice(totalPrice + menu_price);                       // updating total price
        setMenuItems(_menuItems);
    }

    let removeMenuItemQty = (index) => {
        let _menuItems = [...menuItems];
        _menuItems[index].qty -= 1;
        let menu_price = Number(_menuItems[index].price); 
        setTotalPrice(totalPrice - menu_price);                       // updating total price
        setMenuItems(_menuItems);
    };

    //Payment

    async function loadScript(src) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            return true;
        };
        script.onerror = () => {
            return false;
        };
        window.document.body.appendChild(script);
        
    }

    let displayRazorpay = async () => {
        let isLoaded = await loadScript();
        if (isLoaded === false) {
            alert("SDK is not loaded");
            return false;
        } 

        //dymanic amount
        var serverData = {
            amount : totalPrice,
        };

        //api call
        var {data} = await axios.post('http://localhost:5003/api/payment/generate-orderId', serverData);
        console.log(data);
        
        var order = data.order;

        var options = {
            "key": "rzp_test_beKrMe0C091OUN", // Enter the Key ID generated from the Dashboard
            "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": order.currency,
            "name": "Zomato Clone Payment",
            "description": "Buying food from zomato",
            "image": "https://branditechture.agency/brand-logos/wp-content/uploads/wpdm-cache/Screenshot_20220621-202824-900x0.png",
            "order_id": order.id, //order id is generated at server side
            "handler": async function (response) {
                //verify payment signature from server
                var sendData = {
                    razorpay_payment_id : response.razorpay_payment_id,
                    razorpay_order_id : response.razorpay_order_id,
                    razorpay_signature : response.razorpay_signature,
                };
                var {data} = await axios.post('http://localhost:5003/api/payment/verify', sendData); 
                console.log(data);                         
                
                if(data.status === true) {
                    alert("Order placed successfully!!!");
                    window.location.replace("/");
                } else {
                    alert("Payment failed...Try again!!!");
                }
            },
            "prefill": {
                "name": userDetails.name,
                "email": userDetails.email,
                "contact": "9999999999"
            }
        };
        var razorpayObj = window.Razorpay(options);
        razorpayObj.open();
          
        
        

    };

    useEffect( () => {
        getRestaurantDetail();
    }, []);

    return (
        <>

            <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalToggleLabel">{restaurant.name}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">

                    { 
                        menuItems.map( (menu_item, index) => {
                        return (
                        <div className="row p-2" key={index}>
                            <div className="col-8">
                                <p className="mb-1 h6">{menu_item.name}</p>
                                <p className="mb-1">₹{menu_item.price}</p>
                                <p className="small text-muted">{menu_item.description}</p>
                            </div>

                            <div className="col-4 d-flex justify-content-end">
                                <div className="menu-food-item">
                                    <img className="menu-food-item menu_img" src={"/images/" + menu_item.image} alt="" />

                                    { menu_item.qty === 0  ? (
                                        <button className="btn btn-primary btn-sm add" onClick={() => addMenuItemQty(index)}>
                                            Add
                                        </button>
                                    ) : (
                                        <div className="order-item-count section">
                                            <span className="hand" onClick={() => removeMenuItemQty(index)}>-</span>
                                            <span>{menu_item.qty}</span>
                                            <span className="hand" onClick={() => addMenuItemQty(index)}>+</span>
                                        </div>
                                    )}

                                </div>
                            </div>
                            <hr className="p-0 my-1"/>
                        </div>
                        )})
                    }

                </div>
                {   totalPrice > 0 ? (
                    <div className="modal-footer d-flex justify-content-between">
                        <h3>Subtotal {totalPrice}</h3>
                        <button className="btn btn-danger" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">Add Payment Details</button>
                    </div>
                ) :   null
                }
                </div>
            </div>
            </div>
            <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalToggleLabel2">{restaurant.name}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Name</label>
                        <input type="text" className="form-control" placeholder="Enter Your Name" value={userDetails.name} readOnly={true} onChange={() => {}}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Email ID</label>
                        <input type="email" className="form-control" placeholder="Enter Your Email ID" value={userDetails.email} readOnly={true} onChange={() => {}}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlInput1" className="form-label">Mobile Number</label>
                        <input type="number" className="form-control" placeholder="Enter Your Mobile Number" onChange={() => {}}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label">Address</label>
                        <textarea className="form-control" rows="3" placeholder="Enter Your Address" onChange={() => {}}></textarea>
                    </div>
                </div>
                <div className="d-flex justify-content-between p-3">
                    <button className="btn btn-danger" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">Back to Menu Items</button>
                    <button className="btn btn-success" onClick={displayRazorpay}>Pay Now</button>
                </div>
                </div>
            </div>
            </div>
            

            <Header color = 'bg-danger'/>
            <section className="row justify-content-center">
                <section className="col-10 mt-5 restaurant-main-img postion-relative">
                    <img src={"/images/" + restaurant.image} alt="" />
                    <button className="btn-gallery position-absolute btn">Click to see Image Gallery</button>
                </section>
                <section className="col-10">
                    <h2 className="mt-4">{restaurant.name}</h2>
                    <div className="d-flex mt-5 justify-content-between align-items-start">
                        <ul className="list-unstyled d-flex gap-5 fw-bold">
                            <li className="pb-2 hand" onClick={() => setTab(1)}>Overview</li>
                            <li className="pb-2 hand" onClick={() => setTab(2)}>Contact</li>
                        </ul>

                        {userDetails ? (
                        <button className="btn btn-danger" 
                            data-bs-toggle="modal" 
                            href="#exampleModalToggle" 
                            role="button"
                            onClick={getMenuItems}
                        >
                            Place Online Order</button>
                        ) : (
                            <button className="btn btn-danger" disabled={true}>Please Login to Place Order</button>
                        )}
                    </div>

                    { tab === 1 ? (
                    <section>
                        <h4 className="my-4">About this place</h4>
                        <p className="m-0 fw-bold">Cuisine</p>
                        <p className="">
                        {   restaurant.cuisine.length > 0 
                            ? restaurant.cuisine.reduce((pValue, cValue) => {
                                return pValue.name + ', ' + cValue.name;
                            })
                        : null }
                        </p>
                        <p className="m-0 fw-bold">Average Cost</p>
                        <p className="">₹{restaurant.min_price} for two people (approx.)</p>
                    </section> ) : (

                    <section>
                        <h4 className="my-4">Contact Information</h4>
                        <p className="m-0 fw-bold">Phone Number</p>
                        <p className="text-danger">{restaurant.contact_number}</p>
                        <p className="m-0 fw-bold">{restaurant.name}</p>
                        <p className="">{restaurant.locality}, {restaurant.city}</p>
                    </section> )
                }
                </section>
            </section>
        </>
    );
}

export default RestaurantPage;