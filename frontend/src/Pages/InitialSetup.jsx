// from https://github.com/srdjan/react-multistep

import NavBar from "./Navbar";
import Multistep from 'react-multistep';

import '../Styles/Form.css'
import '../Styles/Onboarding.css'
import React, { useEffect, useState } from 'react';
import { url } from '../utils/url';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import ProfilePage from "./Profile";

const InitialSetupPage = () => {
    const history = useHistory();
    const [image, setImage] = useState(null);
    const [ogImageID, setOgImageID] = useState(null);
    const [bio, setBio] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [firstName, setFirstName] = useState(null);
    
    const [smoking, setSmoking] = useState(false);
    const [drinking, setDrinking] = useState(false);
    const [clean, setClean] = useState(false);
    const [bedEarly, setBedEarly] = useState(false);
    const [morningPerson, setMorningPerson] = useState(false);
    const [visitors, setVisitors] = useState(false);
    const [goOut, setGoOut] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.put(`http://${url}:8000/preferences?smoking=${+smoking}&drinking=${+drinking}&clean=${+clean}&bedEarly=${+bedEarly}&morningPerson=${+morningPerson}&visitors=${+visitors}
            &goOut=${+goOut}&userID=${sessionStorage.getItem("userID")}`).then(res => {
            history.push(`/home`);

        }).catch(err => {
            console.log(err)
        });;
    }

    const getPreferences = () => {
        axios.get(`http://${url}:8000/preferences?userID=${sessionStorage.getItem("userID")}`).then(res => {
            const d = res.data.data
            setSmoking(!!d.smoking)
            setDrinking(!!d.drinking)
            setClean(!!d.clean)
            setBedEarly(!!d.bedEarly)
            setMorningPerson(!!d.morningPerson)
            setVisitors(!!d.visitors)
            setGoOut(!!d.goOut)
        }).catch(err => {
            console.log(err)
            document.getElementById("form-error").style.display = "block";
        });;
    }

    /**
     * Get the profile info for the current user.
     */
    const getProfileInfo = () => {
        axios.get(`http://${url}:8000/profile?userID=${sessionStorage.getItem("userID")}`).then(res => {
            const d = res.data.data[0]
            setImage(d.profilePic)
            setFirstName(d.firstName)
            setLastName(d.lastName)
            setBio(d.bio)
        }).catch(err => {
            console.log(err)
        });
    }

    useEffect(() => {
        getPreferences();
        getProfileInfo();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
    
    const submitBtn = 
        <div className="content-center">
            <button className="form-button multistep-form-finish" onClick={handleSubmit}> Start exploring </button>
        </div>

    const stepOne = 
        <form className="d-flex flex-row gap-5">
        <div>
            <h4 className="text-muted fw-normal mb-4">Profile Picture</h4>
            <div className="d-grid">
                {
                    (image !== null)
                        ? <img className="img-large layer rounded" src={`http://${url}:8000/profilePic/${image}`}  alt="Profile Img" />
                        : <div className="img-large layer bg-light rounded"/>
                }
                <div className="d-flex justify-content-center align-items-center layer img-large">
                    <label htmlFor="fileUpload" className="profile-file-upload">
                        {/* <img src={pathImg} alt="Upload" /> */}
                        <p className="light-bold"><span className="d-inline-block text-primary">Upload a file</span> or drag and drop</p>
                        <p>PNG, JPG, GIF up to 10MB</p>
                    </label>
                    {/* TODO Handle Profile Picture Submission */}
                    <input id="fileUpload" type="file" name="file" className="d-none" onChange={event => setImage(event.target.files[0])} />
                </div>
            </div>
        </div>
        {/* TODO Setup submission for text inputs and placeholders */}
        <div className="d-flex flex-column flex-grow-1 gap-4">
            <div className="d-flex flex-row gap-4">
                <div className="d-flex flex-column flex-grow-1">
                    <h4 className="text-muted fw-normal">First name</h4>
                    <input id="firstName" type="text" className="form-input" value={firstName}
                        onChange={event => setFirstName(event.target.value)}/>
                </div>
                <div className="d-flex flex-column flex-grow-1">
                    <h4 className="text-muted fw-normal">Last name</h4>
                    <input id="lastName" type="text" className="form-input" value={lastName}
                        onChange={event => setLastName(event.target.value)}/>
                </div>
            </div>
            <div className="d-flex flex-column">
                <h4 className="text-muted fw-normal">Bio</h4>
                <textarea id="bio" className="form-input" value={bio}
                        onChange={event => setBio(event.target.value)}/>
            </div>
        </div>
    </form>

    const stepTwo = 
        <div className="form multistep-form">
                <div className="form-header">
                <h2>Set your Preferences</h2>
            </div>
            <div className="form-checkbox-field">
                <input type="checkbox" className="form-checkbox" id="goOut" name="goOut" checked={goOut} onChange={event => {setGoOut(event.target.checked)}}/>
                <label htmlFor="goOut" value={false}>I like to go out</label>
            </div>
            <div className="form-checkbox-field">
                <input type="checkbox" className="form-checkbox" id="smoking" name="smoking" checked={smoking} onChange={event => setSmoking(event.target.checked)}/>
                <label htmlFor="smoking" value={false}>I like to smoke</label>
            </div>
            <div className="form-checkbox-field">
                <input type="checkbox" className="form-checkbox" id="drinking" name="drinking" checked={drinking} onChange={event => setDrinking(event.target.checked)}/>
                <label htmlFor="drinking">I like to drink</label>
            </div>
            <div className="form-checkbox-field">
                <input type="checkbox" className="form-checkbox" id="clean" name="clean" checked={clean} onChange={event => setClean(event.target.checked)}/>
                <label htmlFor="clean">I care about cleanliness</label>
            </div>
            <div className="form-checkbox-field">
                <input type="checkbox" className="form-checkbox" id="bedEarly" name="bedEarly" checked={bedEarly} onChange={event => setBedEarly(event.target.checked)}/>
                <label htmlFor="bedEarly">I usually go to bed before midnight.</label>
            </div>
            <div className="form-checkbox-field">
                <input type="checkbox" className="form-checkbox" id="morningPerson" name="morningPerson" checked={morningPerson} onChange={event => setMorningPerson(event.target.checked)}/>
                <label htmlFor="morningPerson">I like to wake up early. </label>
            </div>
            <div className="form-checkbox-field">
                <input type="checkbox" className="form-checkbox" id="visitors" name="visitors" checked={visitors} onChange={event => setVisitors(event.target.checked)}/>
                <label htmlFor="visitors">I like to have visitors</label>
            </div>
            {submitBtn}

        </div>

    
    const steps = [
        {name: 'StepOne', component: stepOne},
        {name: 'StepTwo', component: stepTwo},
    ];

    return(
        <>
            <NavBar isLoggedIn={true} />

            <section className="onboarding-section">
                <div className="container">

                    {/* <Form> */}
                    <Multistep showNavigation={true} steps={steps}/>
                    
                    {/* </Form> */}
                </div>
            </section>
        </>
    )
}

export default InitialSetupPage;