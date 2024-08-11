import React, { useEffect, useState } from 'react';
import { url } from '../utils/url';
import axios from 'axios'
import '../Styles/Profile.css'
import { useHistory } from "react-router-dom";

export const ProfileCard  = (props) => {
    const history = useHistory();
    const [image, setImage] = useState(null);
    const [bio, setBio] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [gender, setGender] = useState(null);
    const [joinDate, setJoinDate] = useState(null);
    const [preferences, setPreferences] = useState([]);

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
            setJoinDate(d.joinDate.substr(0, d.joinDate.indexOf('T')))
            setGender(d.gender)
        }).catch(err => {
            console.log(err)
        });
    }

    /**
     * Get preferences for the current user.
     */
    const getPreferences = () => {
        axios.get(`http://${url}:8000/preferences?userID=${sessionStorage.getItem("userID")}`).then(res => {
            const d = res.data.data;
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
            console.log(err);
            document.getElementById("form-error").style.display = "block";
        });
    }

    useEffect(() => {
        getProfileInfo();
        getPreferences();
      }, [])



    return(
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
                    <button className="button" onClick={() => history.push('/profileEdit')}>Edit Profile</button>
                </div>
            </div>
        </div>
    )
}
