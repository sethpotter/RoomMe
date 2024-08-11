import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import '../Styles/Profile.css'
import { EditProfileCard } from '../Components/EditProfileCard';

export const EditProfile = (props) => { 
    return(
        <>
            <Sidebar/>
            <div className="app-section">
                <EditProfileCard preferences></EditProfileCard>
            </div>
        </>
    )
    
}

