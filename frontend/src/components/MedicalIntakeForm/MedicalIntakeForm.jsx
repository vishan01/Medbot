import React, { useState } from 'react';
import './MedicalIntakeForm.css';

const MedicalIntakeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    symptoms: '',
    medicalHistory: '',
    allergies: '',
    medications: '',
    emergencyContact: '',
    emergencyPhone: '',
    consent: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add submission logic here
  };

  return (
    <div className="medical-form-container">
      <header className="form-header">
        <img src="/assets/images/medical-logo.png" alt="Medical Center Logo" className="logo" />
        <h1>Patient Intake Form</h1>
      </header>
      
      <form className="medical-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
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
            <label htmlFor="phone">Phone Number:</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dob">Date of Birth:</label>
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
            <label htmlFor="gender">Gender:</label>
            <select 
              id="gender" 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <textarea 
              id="address" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              required
            ></textarea>
          </div>
        </div>

        <div className="form-section">
          <h2>Medical Information</h2>
          <div className="form-group">
            <label htmlFor="symptoms">Current Symptoms:</label>
            <textarea 
              id="symptoms" 
              name="symptoms" 
              value={formData.symptoms} 
              onChange={handleChange} 
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="medicalHistory">Medical History:</label>
            <textarea 
              id="medicalHistory" 
              name="medicalHistory" 
              value={formData.medicalHistory} 
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="allergies">Allergies:</label>
            <textarea 
              id="allergies" 
              name="allergies" 
              value={formData.allergies} 
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="medications">Current Medications:</label>
            <textarea 
              id="medications" 
              name="medications" 
              value={formData.medications} 
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div className="form-section">
          <h2>Emergency Contact</h2>
          <div className="form-group">
            <label htmlFor="emergencyContact">Emergency Contact Name:</label>
            <input 
              type="text" 
              id="emergencyContact" 
              name="emergencyContact" 
              value={formData.emergencyContact} 
              onChange={handleChange} 
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="emergencyPhone">Emergency Contact Phone:</label>
            <input 
              type="tel" 
              id="emergencyPhone" 
              name="emergencyPhone" 
              value={formData.emergencyPhone} 
              onChange={handleChange} 
              required
            />
          </div>
        </div>

        <div className="form-section">
          <div className="form-group checkbox-group">
            <input 
              type="checkbox" 
              id="consent" 
              name="consent" 
              checked={formData.consent} 
              onChange={handleChange} 
              required
            />
            <label htmlFor="consent">I consent to the processing of my personal data for medical purposes.</label>
          </div>
        </div>
        
        <div className="form-buttons">
          <button type="submit" className="submit-button">Submit Form</button>
          <button type="reset" className="reset-button">Reset Form</button>
        </div>
      </form>
      
      <footer className="form-footer">
        <p>© 2023 Medical Center. All rights reserved.</p>
        <p>Privacy Policy | Terms of Service</p>
      </footer>
    </div>
  );
};

export default MedicalIntakeForm;
