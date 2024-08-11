import React, { useEffect, useState } from 'react';
import { url } from '../utils/url';
import axios from 'axios';
import Sidebar from './Sidebar';

const SettingsPage = () => {
    
    return(
        <>
            <Sidebar></Sidebar>
            <section className="app-section">
                <h1>SETTINGS</h1>
            </section>
        </>
    )
}

export default SettingsPage;