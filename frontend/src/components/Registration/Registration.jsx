import React, { useState } from 'react';
import './Registration.css';
import registrationImage from '../../assets/doctors.jpg'; 
import { SignUpEmail } from '../../firebase/auth';
import { useDispatch } from 'react-redux';
import { login } from '../../features/authSlice';
import { Link } from 'react-router-dom';
const RegistrationPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      console.log("Passwords don't match");
      return;
    }
    
    let user;
    try {
      user = await SignUpEmail(email, password, fullName);
    } catch (e) {
      console.log(e.message);
    }
    
    if (user) {
      let data = {
        email: email,
        name: fullName,
        photoURL: user.photoURL,
        uid: user.uid,
      }
      dispatch(login(data));
      const response = await axios.get("http://localhost:8000/auth/google");
    window.location.href = response.data.authUrl;
    }
    
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-image-container">
          <img src={registrationImage} alt="Registration" className="registration-image" />
        </div>
        
        <div className="registration-form-container">
          <h2>Create an Account</h2>
          <p className="registration-subtitle">Please fill in the details to register</p>
          
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input 
                type="text"
                id="fullName"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password"
                id="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-options">
              <div className="terms-agreement">
                <input 
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                />
                <label htmlFor="agreeTerms">I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></label>
              </div>
            </div>
            
            <button type="submit" className="registration-button">Sign Up</button>
            
            <div className="registration-divider">
              <span>or</span>
            </div>
            
            <div className="social-registration">
              <button type="button" className="social-button google">
                <i className="fab fa-google"></i> Sign up with Google
              </button>
              <button type="button" className="social-button facebook">
                <i className="fab fa-facebook-f"></i> Sign up with Facebook
              </button>
            </div>
          </form>
          
          <p className="login-prompt">
            Already have an account? <Link to="/login" className="text-blue-700">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;