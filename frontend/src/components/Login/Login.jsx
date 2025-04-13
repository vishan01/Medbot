import React, { use, useEffect, useState } from 'react';
import './Login.css';
import loginImage from '../../assets/doctors.jpg'; // Assuming you have this image
import { SignInEmail } from '../../firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import {Link} from 'react-router-dom';
import { login } from '../../features/authSlice'; 
const LoginPage = () => {
  const user=useSelector((state) => state.auth.userData);
  if(user){
    window.location.href='/user';
  }
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    let user;
    try{
      user=await SignInEmail(email, password);
    }catch(e){
      console.log(e.message);
    }
    if(user){
      let data={
      email:email,
      name:user.displayName,
      photoURL:user.photoURL,
      uid:user.uid,
    }
      dispatch(login(data));
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-image-container">
          <img src={loginImage} alt="Login" className="login-image" />
        </div>
        
        <div className="login-form-container">
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Please enter your credentials to log in</p>
          
          <form onSubmit={handleSubmit} className="login-form">
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input 
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
            </div>
            
            <button type="submit" className="login-button">Sign In</button>
            
            <div className="login-divider">
              <span>or</span>
            </div>
            
            <div className="social-login">
              <button type="button" className="social-button google">
                <i className="fab fa-google"></i> Continue with Google
              </button>
              <button type="button" className="social-button facebook">
                <i className="fab fa-facebook-f"></i> Continue with Facebook
              </button>
            </div>
          </form>
          
          <p className="signup-prompt">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
