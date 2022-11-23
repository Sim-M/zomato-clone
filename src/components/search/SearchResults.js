import axios from 'axios';
import { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom'

function SearchResults () {
    let params = useParams();
    let navigate = useNavigate();
    let {meal_id} = params;
    let [restaurantList, setRestaurantList] = useState([]); 
    let [locationList, setLocationList] = useState([]);
    let [filter, setFilter] = useState( {mealtype_id: meal_id} );               // mealtype_id = filter works & mealtype = quick search works (this is problem)

    let getLocationList = async () => {
        try {
            let result = await axios.get("http://localhost:5003/api/get-location");
            let data = result.data;
            if(data.status === true){
                setLocationList([...data.result]);
            }else{
                setLocationList([]);
            }

        } catch (error) {
            console.log(error);
            alert("Server Error");
        }    
    };

    let filterOperation = async (filter) => {
        let URL = "http://localhost:5003/api/filter";
        
        try{
            let {data} = await axios.post(URL, filter);
            if(data.status === true) {
                setRestaurantList([...data.newResult]);
            }
        } catch(error) {
            console.log(error);
            alert("Server Error");
        }
    };
    console.log(restaurantList);

    let makeFilteration = (event, type) => {
        let value = event.target.value;
        let _filter = {...filter};                                        // mealtype: meal_id because it is passed in app.js as URL & mealtype because it is present in api backend & mealtype_id is in db
        switch (type) {
            case "location":
                if( value > 0) {
                    _filter["location"] = value;
                } else {
                    delete _filter["location"];
                }
            break;

            case "sort":
                _filter["sort"] = value;
            break;

            case "cost-for-two":
                let costForTwo = (value.split("-"));
                _filter["lcost"] = costForTwo[0];
                _filter["hcost"] = costForTwo[1];
            break;
        }
        console.log(_filter);
        setFilter({..._filter});
        filterOperation(_filter);
    };

    useEffect(() => {
        filterOperation(filter);
        getLocationList();
    }, [])

    return (
    <>
        <div className="header-line">
            <p className="city">Breakfast Places in Mumbai</p>
        </div>
        <div className="container">
            <div className="flex-item-1">
                <p className="filter">Filters</p>
                <br/><br/>
                <label className="location">Select Location:</label>
                <br/><br/>
                <select className="location-box"
                    onChange={(event) => makeFilteration(event, "location")}   
                >
                    <option value="-1">Select Location</option>
                    {
                            locationList.map((location, index) => {
                                return (
                                    <option value={location.location_id} key = {index}>
                                        {location.name}, {location.city}
                                    </option>
                                );
                            })
                        }
                </select>
                <br/><br/>
                <div className="main-head">
                    <p className="cuisine">Cuisine</p>
                    <input type="checkbox" className="form-check-input"/><label htmlFor="north-indian" className="item-text" value="1">North Indian</label><br/>
                    <input type="checkbox"  className="form-check-input"/><label htmlFor="south-indian" className="item-text" value="2">South Indian</label><br/>
                    <input type="checkbox"  className="form-check-input"/><label htmlFor="chinese" className="item-text" value="3">Chinese</label><br/>
                    <input type="checkbox" className="form-check-input"/><label htmlFor="fast-food" className="item-text" value="4">Fast Food</label><br/>
                    <input type="checkbox" className="form-check-input"/><label htmlFor="street-food" className="item-text" value="5">Street Food</label><br/>
                <br/>
                </div> 
                <div className="main-head">               
                    <p className="cost">Cost For Two</p>
                    <input type="radio" className="form-check-input" name="cost-for-two" value="0-500"
                        onChange={(event) => makeFilteration(event, "cost-for-two")} />
                    <label htmlFor="500" className="item-text"> Less than ` 500</label><br/>
                    <input type="radio" className="form-check-input" name="cost-for-two" value="500-1000"
                        onChange={(event) => makeFilteration(event, "cost-for-two")} />
                    <label htmlFor="1000" className="item-text">` 500 to ` 1000</label><br/>
                    <input type="radio" className="form-check-input" name="cost-for-two" value="1000-1500"
                        onChange={(event) => makeFilteration(event, "cost-for-two")}/>
                    <label htmlFor="1500" className="item-text">` 1000 to ` 1500</label><br/>
                    <input type="radio" className="form-check-input" name="cost-for-two" value="1500-2000"
                        onChange={(event) => makeFilteration(event, "cost-for-two")}/>
                    <label htmlFor="2000" className="item-text">` 1500 to ` 2000</label><br/>
                    <input type="radio" className="form-check-input" name="cost-for-two" value="2000-999999"
                        onChange={(event) => makeFilteration(event, "cost-for-two")}/>
                    <label htmlFor="2001" className="item-text">` 2000+</label><br/>
                <br/>
                </div>
                <div className="main-head">
                    <p className="sort">Sort</p>
                    <input type="radio" className="form-check-input" name="sort" value="1"
                        onChange={(event) => makeFilteration(event, "sort")} 
                    />
                    <label htmlFor="low-to-high" className="item-text">Price low to high</label><br/>
                    <input type="radio" className="form-check-input" name="sort" value="-1"
                        onChange={(event) => makeFilteration(event, "sort")}
                    />
                    <label htmlFor="high-to-low" className="item-text">Price high to low</label><br/>
                </div>
            </div>
        
        
            <div className="">
            {
                restaurantList.map((restaurant, index) => {
                    return (
                        <div className="flex-item-2 p-4" key = {index} onClick = { () => navigate("/restaurant/" + restaurant._id)} >
                            <div className="food-item-img">
                                <img src= {"/images/" + restaurant.image} className="food-item-img" alt=""/>
                            </div>
                            <div className="description">
                                <p className="line-1">{restaurant.name}</p>
                                <p className="line-2">{restaurant.city}</p>
                                <p className="line-3">{restaurant.locality}, {restaurant.city}</p>
                                <hr/>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>CUISINES:</td>
                                            <th>
                                                {
                                                    restaurant.cuisine.reduce((pValue, cValue) => {
                                                        return pValue.name + ', ' + cValue.name;
                                                    })
                                                }
                                            </th>
                                        </tr>
                                        <tr>
                                            <td>COST FOR TWO:</td>
                                            <th className="rupee">₹{restaurant.min_price}</th>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                    );
                })

            }

            </div>    
        </div>
        
        <div className="pagination-section">
            <ul className="pagination">
                <li className="pagination-li"></li>
                <li className="pagination-li-1">1</li>
                <li className="pagination-li">2</li>
                <li className="pagination-li">3</li>
                <li className="pagination-li">4</li>
                <li className="pagination-li">5</li>
                <li className="pagination-li"></li>
            </ul>
        </div>
    </>
    );
}

export default SearchResults;
