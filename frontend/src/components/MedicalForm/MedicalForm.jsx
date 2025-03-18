import React, { useState } from 'react';
import './MedicalForm.css';
import medicalLogo from './images/medical-logo.png';

const MedicalForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    insurance: '',
    policyNumber: '',
    symptoms: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to a server
  };

  return (
    <div className="medical-form-container">
      <div className="form-header">
        <img src={medicalLogo} alt="Medical Center Logo" className="logo" />
        <h1>Patient Registration Form</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input 
                type="date" 
                id="dob" 
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select 
                id="gender" 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea 
              id="address" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              required
            ></textarea>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Insurance Information</h2>
          <div className="form-group">
            <label htmlFor="insurance">Insurance Provider</label>
            <input 
              type="text" 
              id="insurance" 
              name="insurance"
              value={formData.insurance}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="policyNumber">Policy Number</label>
            <input 
              type="text" 
              id="policyNumber" 
              name="policyNumber"
              value={formData.policyNumber}
              onChange={handleChange}
              required 
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Medical Information</h2>
          <div className="form-group">
            <label htmlFor="symptoms">Current Symptoms</label>
            <textarea 
              id="symptoms" 
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              rows="3"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="medicalHistory">Medical History</label>
            <textarea 
              id="medicalHistory" 
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              rows="3"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="currentMedications">Current Medications</label>
            <textarea 
              id="currentMedications" 
              name="currentMedications"
              value={formData.currentMedications}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="allergies">Allergies</label>
            <textarea 
              id="allergies" 
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div className="form-footer">
          <div className="consent-section">
            <input 
              type="checkbox" 
              id="consent" 
              required 
            />
            <label htmlFor="consent">
              I consent to the collection and processing of my medical information as described in the privacy policy.
            </label>
          </div>
          
          <div className="form-buttons">
            <button type="reset" className="secondary-button">Clear Form</button>
            <button type="submit" className="primary-button">Submit</button>
          </div>
        </div>
      </form>
      
      <div className="form-info">
        <p>For emergency situations, please call 108 or go to your nearest emergency room.</p>
        <p>For questions about this form, contact our help desk at (555) 123-4567.</p>
      </div>
    </div>
  );
};

export default MedicalForm;
