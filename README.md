# MedBot

MedBot is a comprehensive healthcare assistance platform that connects users with medical professionals and AI-powered help. The application provides various features for both patients seeking medical assistance and healthcare providers looking to offer help.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For Patients
- **Get Help**: Ask health-related questions and receive guidance from medical professionals or AI
- **Chatbot**: Interact with an AI-powered chatbot for immediate responses to common medical questions
- **Upload Reports**: Upload medical reports for analysis and professional review
- **View Medical Data**: Access your uploaded medical records and reports in one place

### For Healthcare Providers
- **Provide Help**: Offer medical expertise and assistance to users in need
- **Review Reports**: Analyze uploaded medical documents and provide professional insights
- **AI Integration**: Work alongside AI tools to deliver comprehensive care

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router for navigation
- CSS for styling

### Backend
- Flask (Python)
- AI-powered chatbot integration
- File upload and management system

## 📁 Project Structure

```
medbot/
│
├── frontend/                # React frontend application
│   ├── public/              # Public assets
│   └── src/
│       ├── assets/          # Images and static resources
│       ├── components/      # Reusable UI components
│       ├── pages/           # Main application pages
│       ├── App.js           # Main application component
│       └── index.js         # Application entry point
│
└── backend/                 # Flask backend application
    ├── static/              # Static files for the backend
    │   └── user_reports/    # Uploaded medical reports
    ├── templates/           # HTML templates
    ├── app.py               # Main Flask application
    └── bot.py               # Chatbot implementation
```

## 📥 Installation

### Prerequisites
- Node.js (v14 or later)
- Python (v3.8 or later)
- pip (Python package manager)

### Frontend Setup
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```

## 🚀 Usage

1. Open your browser and navigate to `http://localhost:3000` for the frontend
2. Register or log in to your account
3. Choose whether you want to get help or provide help
4. Navigate through the application based on your needs:
   - Ask health questions
   - Upload medical reports
   - View your medical data
   - Interact with the AI chatbot

## 🔌 API Endpoints

### Authentication
- `/login` - User login
- `/register` - User registration

### User Features
- `/GetHelp` - Access medical assistance
- `/ProvideHelp` - Offer medical expertise
- `/upload` - Upload medical reports
- `/show` - View uploaded files
- `/bot` - Access the AI chatbot

### Bot Functionality
- `/ask_question` (POST) - Send questions to the AI bot

## 👥 Contributing

We welcome contributions to MedBot! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
