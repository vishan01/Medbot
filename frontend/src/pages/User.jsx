import React from 'react';
import UserRightBar from '../components/UserRightBar/UserRightBar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import './user.css';

 function User(){
    return(
        <div className='MainHomeContainer'>
            <Sidebar/>
            <UserRightBar/>
        </div>
    );
 }
 export default User;