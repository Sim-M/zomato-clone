import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../Header"

function Wallpaper() {

    let [locationList, setLocationList] = useState([]);
    let [disabled, setDisabled] = useState(true);

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

    let getLocationId = async (event) => {
        let value = event.target.value;
        if(value !== "") {
            try{
                let url = "http://localhost:5003/api/get-restaurant-by-location-id/"+ value;
                let {data} = await axios.get(url); 
                console.log(data);
                if(data.status === true){
                    if(data.result.length === 0 ){
                        setDisabled(true);
                    }else {
                        setDisabled(false);
                    }
                }
            } catch(error) {
                console.log(error);
                alert("Server Error");
            }
        }
    };

    useEffect(() => {
        getLocationList();
    }, [])

    return <>
    <section className="row main-section align-content-start">
         <div className="co-12">
         <Header color ='' />
         </div>

            <section className="col-12 d-flex flex-column align-items-center justify-content-center">
                <p className="logo">e!</p>
                <p className="h2 text-white text-center">Find the best restaurants, cafés, and bars</p>

                <div className="searchtext d-flex w-50 m-4">
                    {/* <input type="text" className="form-control mb-3 mb-lg-0 me-lg-3 w-50 py-2 px-3" placeholder="Please type a location" /> */}

                    <select 
                        className="form-select mb-3 mb-lg-0 me-lg-3 w-50 py-2 px-3"
                        onChange={getLocationId}
                    >
                        <option value="">Please select a location</option>
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
                    
                    <div className="input-group w-70">
                        <span className="input-group-text bg-white">
                            <i className="fa fa-search"></i>
                        </span>
                        <input type="text" className="form-control py-2 px-3" placeholder="Search for restaurants" disabled={disabled}/>
                    </div>
                </div>
            </section>
        </section>
    </>;
}

export default Wallpaper;