import React, { useEffect, useState } from 'react';
import { url } from '../utils/url';
import axios from 'axios'
import Sidebar from './Sidebar';
import '../Styles/Profile.css'
import { ProfileCard } from '../Components/ProfileCard';

const ProfilePage = (props) => {

    return(
        <>
            <Sidebar/>
            <div className="app-section">
                <ProfileCard profile={props.profile} ></ProfileCard>
            </div>
        </>
    )
    
}

export default ProfilePage;