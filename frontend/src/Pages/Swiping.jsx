import '../Styles/Swiping.css'
import React, { useEffect, useState } from 'react';
import Sidebar from "./Sidebar";
import axios from 'axios';
import { url } from '../utils/url';

const SwipingPage = () => {
    const [image, setImage] = useState(null);
    const [userID, setUserID] = useState(null)
    const [bio, setBio] = useState('')
    const [lastName, setLastName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [gender, setGender] = useState(null);
    const [joinDate, setJoinDate] = useState('');
    const [preferences, setPreferences] = useState([]);

    
    const getPotentialInfo = () => {
        axios.get(`http://${url}:8000/potential?userID=${sessionStorage.getItem("userID")}`).then(res => {
            const d = res.data.data[0]
            setUserID(d.userID)
            setImage(d.profilePic)
            setFirstName(d.firstName)
            setLastName(d.lastName)
            setBio(d.bio)
            setGender(d.gender)
            setJoinDate(d.joinDate)
            setPreferences({
                smoking: { tag: "Smoking", data: d.smoking, question: "I like to smoke" },
                drinking: { tag: "Drinking", data: d.drinking, question: "I like to drink" },
                clean: { tag: "Clean", data: d.clean, question: "I care about cleanliness" },
                bedEarly: { tag: "Bed Early", data: d.bedEarly, question: "I usually go to bed before midnight" },
                morningPerson: { tag: "Morning Person", data: d.morningPerson, question: "I like to wake up early" },
                visitors: { tag: "Visitors", data: d.visitors, question: "I like to have visitors" },
                goOut: { tag: "Goes Out", data: d.goOut, question: "I like to go out" },
            });
        }).catch(err => {
            console.log(err)
        });;
    }

    const handleLike = (event) => {
        event.preventDefault();
        axios.put(`http://${url}:8000/like?userID=${sessionStorage.getItem("userID")}&potentialID=${userID}`).then(res => {
            getPotentialInfo();
        }).catch(err => {
            console.log(err)
        });;
    }

    const handleDislike = (event) => {
        event.preventDefault();
        axios.put(`http://${url}:8000/dislike?userID=${sessionStorage.getItem("userID")}&potentialID=${userID}`).then(res => {
            getPotentialInfo();
        }).catch(err => {
            console.log(err)
        });;
    }

    useEffect(() => {
        getPotentialInfo();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    return(
        <>
        {/* <NavBar isLoggedIn={true} /> */}
        <Sidebar />
        <section className="app-section">
        <div className="user-card d-flex me-3">
            <img className="user-img img-large" src={image !== null ? `http://${url}:8000/profilePic/${image}` : ''}  alt="" />
            <div className="list p-3 flex-grow-1">
                <div className="list-row justify-content-between">
                    <div>
                        <h2 className="fw-bold">{firstName}</h2>
                        <h2 className="fw-bold">{lastName}</h2>
                    </div>
                    <div className="gender-icon">{ (gender === 1) ? 'M' : 'F'}</div>
                </div>
                <p>{bio}</p>
                <div className="prefs mb-3">
                    {
                        Object.keys(preferences).map((x, i) =>
                            (preferences[x].data) ? <div key={i} className="prefs-tag">{preferences[x].tag}</div> : null
                        )
                    }
                </div>
                <p className="text-muted m-0">Joined {joinDate}</p>
                <div className="d-flex justify-content-end">
                    <button className="button" onClick={handleLike}>Like</button>
                    <button className="button" onClick={handleDislike}>Dislike</button>
                </div>
            </div>
        </div>
        </section>
    </>
    )
    
}

export default SwipingPage;