import '../Styles/Sidebar.css';

import logo from '../Assets/logo.png';
import search from '../Assets/search.svg';
import message from '../Assets/message.svg';
import profile from '../Assets/user.svg';
import settings from '../Assets/settings.svg';

import { Link } from 'react-router-dom';

const Sidebar = () => {
    return(
        <>
            <div className="global-sidebar">
                <div className="sidebar-links">
                    <a className="logo-wrapper logo-pad" href="/">
                        <img className="logo-img" src={logo} alt="RoomMe logo"/>
                        <h1 className="logo-text sidebar-text-color">RoomMe</h1>
                    </a>
                    <div className="d-flex flex-row">
                        <Link type="button" className="button sidebar-button" to="/home">
                            <img id="search" src={search} alt="Explore"/>Explore
                        </Link>
                    </div>
                    <div className="d-flex flex-row">
                        <Link type="button" className="button button-secondary sidebar-button" to="/messaging">
                            <img id="message" src={message} alt="Message"/>Messages
                        </Link>
                    </div>
                    <div className="d-flex flex-row">
                        <Link type="button" className="button sidebar-button" to="/profile">
                            <img id="profile" src={profile} alt="Profile"/>Profile
                        </Link>
                    </div>
                    <div className="d-flex flex-row">
                        <Link type="button" className="button sidebar-button" to="/settings">
                            <img id="settings" src={settings} alt="Settings"/>Settings
                        </Link>
                    </div>
                </div>
            </div>
        </>
        )
    
}

export default Sidebar;