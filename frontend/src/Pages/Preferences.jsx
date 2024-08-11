// from https://github.com/srdjan/react-multistep
import '../Styles/Form.css'
import '../Styles/Onboarding.css'
import React, { useEffect, useState } from 'react';
import { url } from '../utils/url';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import Sidebar from './Sidebar';

const PreferencesPage = () => {
    const [smoking, setSmoking] = useState(false);
    const [drinking, setDrinking] = useState(false);
    const [clean, setClean] = useState(false);
    const [bedEarly, setBedEarly] = useState(false);
    const [morningPerson, setMorningPerson] = useState(false);
    const [visitors, setVisitors] = useState(false);
    const [goOut, setGoOut] = useState(false);
    const history = useHistory();

    const handlePreferences = (event) => {
        event.preventDefault();
        axios.put(`http://${url}:8000/preferences?smoking=${+smoking}&drinking=${+drinking}&clean=${+clean}&bedEarly=${+bedEarly}&morningPerson=${+morningPerson}&visitors=${+visitors}
            &goOut=${+goOut}&userID=${sessionStorage.getItem("userID")}`).then(res => {
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

    useEffect(() => {
        getPreferences();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
    
    const submitBtn = 
        <div className="content-center">
            <button className="form-button multistep-form-finish" onClick={handlePreferences}> Save Preferences </button>
        </div>
    
    return(
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
            <div className="content-center">
                <button className="form-button multistep-form-finish" onClick={handlePreferences}> Start exploring </button>
            </div>
        </div>
    )
}

export default PreferencesPage;