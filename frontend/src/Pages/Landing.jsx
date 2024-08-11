import React from 'react';
import { Link } from 'react-router-dom'
import LandingImage from '../Assets/landing-image.jpg';
import NavBar from './Navbar';
import '../Styles/Landing.css'

export const LandingPage = () => ( 
  <>
    <NavBar />
    <section className="landing-section">
      <div className="landing-container"> 
        <div className="landing-content">
          <h2 className="landing-title">The better way to find your roommate.</h2>
          <h3 className="landing-body">Find, meet, and pair with potential roommates at your school.</h3>
          <div className='mt-4'>
            <Link type="button button-secondary" className="button landing-button" to="/register">Get started</Link>
          </div>
        </div>
        <img className="landing-image" src={LandingImage} alt="RoomMe People"></img>
      </div> 
    </section> 
  </>

); 
  
export default LandingPage;