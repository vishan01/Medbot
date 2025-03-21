import React from 'react';
import './navbar.css';
import Search from '../components/icons/Search.png';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Notification from '../components/icons/notification.png';

function Navbar(){
    return(
        <div className='mainNavbarContainer'>
            <div className='dashboardContainer'>
                <h2 className='dashboardText'>Dashboard</h2>
            </div>
            <div className='searchItemContainer'>
                <img src={`${Search}`} className='searchIcon'/>
                <input type='search' placeholder='Search'className='searchInput'/>
            </div>
            <div className='profileItemContainer'>
            <img src={`${Notification}`} className='notificationIcon' />
                <div className='profileItem'>
                    <img src='https://static.vecteezy.com/system/resources/thumbnails/021/548/095/small_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg' className='profileIcon'/>
                    <p>User</p>
                </div>
            </div>
        </div>
    );
}
export default Navbar;