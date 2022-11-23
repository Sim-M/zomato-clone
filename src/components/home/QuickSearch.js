import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function QuickSearch() {

    let [mealTypeList, setMaelTypeList] = useState([]);
    let navigate = useNavigate();

    let getMealType = async () => {
        try {

            let result = await axios.get("http://localhost:5003/api/get-mealtypes");
            let data = result.data;
            if(data.status === true){
                setMaelTypeList([...data.result]);      //to recreate array
            }else{
                setMaelTypeList([]);
            }
            console.log(data);
        } catch (error) {
            alert("Server Error"); 
        }
        
    };

    let getQuickSearchPage = (id) => {
        navigate("/search/" + id);
    };

    useEffect(() => {
        getMealType();
    }, [])                    

    console.log(mealTypeList);
    return <>
    <section className="row justify-content-center mt-5">
            <section className="col-10">
                <h2 className="text-blue fw-bold">Quick Searches</h2>
                <p className="text-secondary">Discover restaurants by type of meal</p>
            </section>
            <section className="col-10">
                <section className="row">
                    <section className="col-12 px-0 d-flex justify-content-evenly flex-wrap">
                        {
                            mealTypeList.map((mealType, index) => {
                                return (
                                <section 
                                 key = {index} 
                                 className="px-0 my-2 d-flex box_shadow"
                                 onClick={ () => getQuickSearchPage(mealType.mealtype_id)}
                                >
                                <img src={"images/"+ mealType.image} alt="" className="image" />
                                <div className="py-3 px-3">
                                    <h5 className="text-blue">{mealType.name}</h5>
                                    <p className="small text-secondary">{mealType.content}</p>
                                </div>
                                </section>
                                );
                            })    
                        }
                    </section>
                </section>
            </section>
        </section>
    </>;
}

export default QuickSearch;