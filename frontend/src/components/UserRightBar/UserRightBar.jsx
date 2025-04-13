import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { setUserFitnessData } from '../../features/authSlice';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Your Flask backend URL

function Login() {
  const handleLogin = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/google`); // Update the Redux store to show fitness data
      window.location.href = response.data.authUrl; // Redirect to Google's auth URL
      
    } catch (error) {
      console.error('Error initiating Google login:', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [fitnessData, setFitnessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfileAndData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/fetch-data`);
        setUserData({
          userName: response.data.userName,
          profilePhoto: response.data.profilePhoto,
          userId: response.data.userId,
        });
        setFitnessData(response.data.formattedData);
      } catch (err) {
        setError(err.message || 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileAndData();
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {userData && (
        <div>
          <p>Welcome, {userData.userName}!</p>
          {userData.profilePhoto && <img src={userData.profilePhoto} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />}
          <p>User ID: {userData.userId}</p>
        </div>
      )}

      <h2>Fitness Data (Last 14 Days)</h2>
      {fitnessData && fitnessData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Steps</th>
              <th>Glucose Level</th>
              <th>Blood Pressure</th>
              <th>Heart Rate</th>
              <th>Weight</th>
              <th>Height (cm)</th>
              <th>Sleep (hours)</th>
              <th>Body Fat (%)</th>
              <th>Menstrual Start</th>
            </tr>
          </thead>
          <tbody>
            {fitnessData.map((data) => (
              <tr key={data.date}>
                <td>{data.date}</td>
                <td>{data.step_count}</td>
                <td>{data.glucose_level}</td>
                <td>{data.blood_pressure.join('/')}</td>
                <td>{data.heart_rate}</td>
                <td>{data.weight}</td>
                <td>{data.height_in_cms}</td>
                <td>{data.sleep_hours}</td>
                <td>{data.body_fat_in_percent}</td>
                <td>{data.menstrual_cycle_start}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No fitness data available.</p>
      )}
    </div>
  );
}

function UserRightBar() {
    const show= useSelector((state) => state.auth.showFitnessData);
  // You'll need to set up routing (e.g., using React Router)
  // to navigate between the Login and Dashboard components
  return (
    <div>
      {/* Example using basic conditional rendering - replace with proper routing */}
      {show ? <Dashboard /> : <Login />}
    </div>
  );
}

export default UserRightBar;