import React, { useState } from 'react';
import '../Styles/Form.css';
import NavBar from './Navbar';
import axios from 'axios';
import { url } from '../utils/url';
import { useHistory } from "react-router-dom";

function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [gender, setGender] = useState(0);
    const history = useHistory();

    const handleRegister = (event) => {
        event.preventDefault();
        if(password === confirmPass){
          axios.post(`http://${url}:8000/register?firstName=${firstName}&lastName=${lastName}&email=${email}&password=${password}&gender=${gender}`).then(res => {
            if(res.data === "Email already used"){
                document.getElementById("form-error").innerHTML = "Email already associated with an account";
                document.getElementById("form-error").style.display = "block";
            }
            else{
                console.log("Sign up succesful");
                axios.get(`http://${url}:8000/login?email=${email}&password=${password}`).then(res => {
                    sessionStorage.setItem("userID", JSON.stringify(res.data.data));
                        history.push(`/accountSetup`);
                }).catch(err => {
                    console.log(err)
                    document.getElementById("form-error").style.display = "block";
                });;
            }
          }).catch(err => {
                document.getElementById("form-error").style.display = "block";
          });;
        }
        else{
            document.getElementById("form-error").innerHTML = "Passwords don't match";
            document.getElementById("form-error").style.display = "block";
        }
    }
    return(
        <>
            <NavBar />
            
            <section className="form-center-section">
                <div className="form-container">
                <form name="signUpForm" className="form">
                    <div className="form-header">
                        <h2>Sign Up</h2>
                    </div>
                    <div className="double-form-field-wrap">
                        <div className="form-field">
                            <label className="form-label" htmlFor="firstName">First name</label>
                            <input className="form-input" type="text" id="firstName" name="firstName" placeholder="Johnny" 
                                value={firstName} onChange={event => setFirstName(event.target.value)}/>
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="lastName">Last name</label>
                            <input className="form-input" type="text" id="lastName" name="lastName" placeholder="Appleseed"
                                value={lastName} onChange={event => setLastName(event.target.value)}/>
                        </div>
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
                    <div className="form-field">
                        <label className="form-label" htmlFor="confirmPass"> Confirm Password </label>
                        <input className="form-input" type="password" id="confirmPass" name="password" placeholder="···"
                            value={confirmPass} onChange={event => setConfirmPass(event.target.value)}/>
                    </div>
                    <div className="form-field">
                        <label className="form-label" htmlFor="gender">Gender</label>
                        <select className="form-input" type="text" id="gender" name="gender" 
                            value={gender} onChange={event => {
                                console.log(event.target.value)
                                setGender(event.target.value)}
                            }>
                            <option value={0}>Female</option>
                            <option value={1}>Male</option>
                        </select>
                    </div>
                    <div id="form-error">
                        Something went wrong
                    </div>
                    <button className="form-button" onClick={handleRegister}> Submit </button>
                </form>

                </div>
            </section>
        </>
    )
}

export default RegisterPage;