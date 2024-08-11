import NavBar from "./Navbar";
import '../Styles/Form.css';
import React, { useState } from 'react';
import { url } from '../utils/url';
import axios from 'axios';
import { useHistory } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    const handleLogin = (event) => {
        event.preventDefault();
        axios.get(`http://${url}:8000/login?email=${email}&password=${password}`).then(res => {
            sessionStorage.setItem("userID", JSON.stringify(res.data.data));
                history.push(`/home`);
        }).catch(err => {
            console.log(err)
            document.getElementById("form-error").style.display = "block";
        });;
    }

    return(
        <>
            <NavBar />
            <section className="form-center-section">
                <div className="form-container">
                    <form name="loginForm" className="form">
                        <div className="form-header">
                            <h2>Login</h2>
                        </div>
                        <div className="form-field">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input className="form-input" type="text" id="email" name="username" placeholder="jappleseed@yahoo.com"
                            value={email} onChange={event => setEmail(event.target.value)}/>
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input className="form-input" type="password" id="password" name="password" placeholder="···"
                                value={password} onChange={event => setPassword(event.target.value)}/>
                        </div>
                        <div id="form-error">
                            Invalid email and password combination
                        </div>
                        <button className="form-button" onClick={handleLogin}> Submit </button>
                    </form>
                </div>
            </section>
        </>
    )
}

export default LoginPage;