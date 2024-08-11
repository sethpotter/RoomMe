import React, { useEffect, useState } from 'react';
import { url } from '../utils/url';
import axios from 'axios'
import { useHistory } from 'react-router';
import '../Styles/Profile.css'

export const EditProfileCard = (props) =>{
    const history = useHistory();
    const [image, setImage] = useState(null);
    const [ogImageID, setOgImageID] = useState(null);
    const [bio, setBio] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [preferences, setPreferences] = useState([]);

    const setPreferencesAndBio = () => {
        // Post bio
        axios.put(`http://${url}:8000/profile?bio=${bio}&firstName=${firstName}&lastName=${lastName}&userID=${sessionStorage.getItem("userID")}`).then(res => {
            // Post preferences
            axios.put(`http://${url}:8000/preferences?smoking=${+preferences.smoking.data}&drinking=${+preferences.drinking.data}&clean=${+preferences.clean.data}
            &bedEarly=${+preferences.bedEarly.data}&morningPerson=${+preferences.morningPerson.data}&visitors=${+preferences.visitors.data}&
            &goOut=${+preferences.goOut.data}&userID=${sessionStorage.getItem("userID")}`).then(res => {
                history.push(`/profile`);
            }).catch(err => {
                console.log(err)
            });;
        }).catch(err => {
            console.log(err)
        });;
    }

    const handleProfileEdit = (event) => {
        event.preventDefault();
        console.log(image)
        if(image === null){
            setPreferencesAndBio();
        }
        else{
            const formData = new FormData();
            formData.append("image", image);
            setOgImageID(null);
            axios.post(`http://${url}:8000/profilePicture?file=${image}&userID=${sessionStorage.getItem("userID")}&oldFileID=${ogImageID}`, formData, { headers: {'Content-Type': 'multipart/form-data'}}
            ).then(res => {
                setPreferencesAndBio();
            }).catch(err => {
                console.log(err);
            });
        }
    }

       /**
     * Handles the checkbox inputs for preferences in edit profile.
     * @param event
     * @param key key for preferences object.
     */
    const handleCheckbox = (event, key) => {
        setPreferences((prevState) => ({
            ...prevState,
            [key]: {
                ...prevState[key],
                data: !prevState[key].data
            }
        }));
    }

    /**
     * Get the profile info for the current user.
     */
    const getProfileInfo = () => {
        axios.get(`http://${url}:8000/profile?userID=${sessionStorage.getItem("userID")}`).then(res => {
            const d = res.data.data[0]
            setOgImageID(d.profilePic)
            setFirstName(d.firstName)
            setLastName(d.lastName)
            setBio(d.bio)
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
        <div className="d-flex flex-column edit-background me-3 p-5">
            <form className="d-flex flex-row gap-5">
                <div>
                    <h4 className="text-muted fw-normal mb-4">Profile Picture</h4>
                    <div className="d-grid">
                        {
                            (ogImageID !== null)
                                ? <img className="img-large layer rounded" src={`http://${url}:8000/profilePic/${ogImageID}`}  alt="Profile Img" />
                                : <div className="img-large layer bg-light rounded"/>

                        }

                        <div className="d-flex justify-content-center align-items-center layer img-large">
                            <label htmlFor="fileUpload" className="profile-file-upload">
                                <p className="light-bold"><span className="d-inline-block text-primary">Upload a file</span> or drag and drop</p>
                                <p>PNG, JPG, GIF up to 10MB</p>
                            </label>
                            {/* TODO Handle Profile Picture Submission */}
                            <input id="fileUpload" type="file" name="file" className="d-none" onChange={event => setImage(event.target.files[0])}/>
                        </div>

                    </div>
                    <div className="mt-5">
                        <h4 className="text-muted fw-normal">Preferences</h4>
                        <div className="prefs-form-field">
                            {
                                Object.keys(preferences).map((x, i) =>
                                    <div key={x} className="form-checkbox-field">
                                        <input id={x}
                                               name={x}
                                               type="checkbox"
                                               className="form-checkbox"
                                               checked={preferences[x].data}
                                               onChange={(event) => {handleCheckbox(event, x)}}
                                        />
                                        <label htmlFor={x}>{preferences[x].question}</label>
                                    </div>
                                )
                            }
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
            <div className="d-flex flex-row justify-content-end">
                <button id="editBtn" className="button" onClick={handleProfileEdit}>Save changes</button>
            </div>
        </div>
    )
}