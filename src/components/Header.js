import {useNavigate} from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import { useState } from "react";

function Header (props) {
    let navigate = useNavigate();

    let getTokenDetails = () => {
        //reading data from localstorage
        let token = localStorage.getItem('auth-token')
        if(token === null) {
            return false;
        } else {
            return jwt_decode(token);
        }
    };

    let [userLogin, setUserLogin] = useState(getTokenDetails); 

    let onSuccess = (credentialResponse) => {
        let token = credentialResponse.credential;           //token for login
        let data = jwt_decode(token);
        console.log(data);

        //saving data on localstorage
        localStorage.setItem("auth-token", token);
        alert("User Logged in successfully!!");
        window.location.reload();                       //reload on same page
    };

    let onError = () => {
        alert('Login Failed');
    };
    console.log(userLogin);

    //logout
    let logout = () => {
        //remove data from localstorage
        localStorage.removeItem("auth-token");
        alert("User Logout Successfully!!");
        setUserLogin(false);
        window.location.reload(); 
    }

    return <>
        <GoogleOAuthProvider clientId="126225121723-7t7v8rppekkudceud81jqigrlgr8nahg.apps.googleusercontent.com">
        <div className="modal fade" id="google-signin" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Google Sign in</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <GoogleLogin
                onSuccess={onSuccess}
                onError={onError}
                />
            </div>
            
            </div>
        </div>
        </div>
        <section className={"main-section1 " + props.color}>
            <div className="brand">
                <p className="brand-logo hand" onClick={() => navigate('/')}>e!</p>
            </div>

            { userLogin ? 
                (<header className="main-section1-header">
                    <span className="fs-6 text-white fw-bold me-2 mt-2">Welcome, {userLogin.given_name}</span>
                    <button className="btn-header create-account" onClick={logout}>Logout</button>
                </header>) : (
                <header className="main-section1-header">
                    <button className="btn-header" data-bs-toggle="modal" data-bs-target="#google-signin">Login</button>
                    <button className="btn-header create-account">Create an account</button>
                </header>
            )}
        </section>
        </GoogleOAuthProvider>
    </>
}

export default Header;