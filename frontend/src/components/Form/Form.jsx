import React, { useState } from 'react';
import './Form.css';
import medicalIcon from '../../assets/images/medical-icon.png'; // Update with actual image path

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    medicalCondition: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    // using fetch or axios
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <img src={medicalIcon} alt="Medical Icon" className="medical-icon" />
        <h1>Medical Assistance Form</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
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
          <label htmlFor="email">Email Address</label>
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
        
        <div className="form-group">
          <label htmlFor="medicalCondition">Medical Condition</label>
          <select
            id="medicalCondition"
            name="medicalCondition"
            value={formData.medicalCondition}
            onChange={handleChange}
            required
          >
            <option value="">Select a condition</option>
            <option value="diabetes">Diabetes</option>
            <option value="hypertension">Hypertension</option>
            <option value="asthma">Asthma</option>
            <option value="arthritis">Arthritis</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Additional Information</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
          ></textarea>
        </div>
        
        <button type="submit" className="submit-button">Submit Request</button>
      </form>
      
      <div className="form-footer">
        <p>Your information is secure and will only be shared with medical professionals.</p>
      </div>
    </div>
  );
};

export default Form;
