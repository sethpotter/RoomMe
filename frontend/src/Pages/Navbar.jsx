import '../Styles/Navbar.css';
import logo from '../Assets/logo.png';
import { Link } from 'react-router-dom';

const NavBar = (props) => {
    return(
        <>
            <nav className="global-nav">
                <div className="nav-container" style={{maxWidth: '100%'}}>
                    <a className="logo-wrapper" href="/">
                        <img className="logo-img" src={ logo } alt="RoomMe logo"></img>
                        <h1 className="logo-text">RoomMe</h1>
                    </a>
                    <div className="nav-menu">
                        {!props.isLoggedIn && <Link type='button' className="button button-secondary mx-2" to="/login"> Login</Link>}
                        {!props.isLoggedIn && <Link type='button' className="button" to="/register">Signup</Link>}
                    </div>
                </div>
            </nav>
        </>
        )
    
}

export default NavBar;