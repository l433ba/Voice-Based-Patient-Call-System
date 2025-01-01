# Voice-Based Patient Call System

A state-of-the-art healthcare communication solution leveraging **voice technology**, **autonomous AI agents**, and **real-time mobile applications** to enhance patient-nurse interaction in healthcare settings.

---

## Overview

The **Voice-Based Patient Call System** is designed to streamline communication between patients and nurses. It uses a voice-driven interface powered by **Azure OpenAI** to understand and process patient requests, prioritize them using **Autonomous AI Agents**, and deliver them to nurses via a real-time mobile application. This system significantly improves response times and enhances patient care.

---

## Key Outcomes
- **Autonomous AI Agents**: Automatically process and act on patient requests.
- **Speech Services Integration**: Smooth communication using **Speech-to-Text** and **Text-to-Speech** functionality.
- **NLP-Powered Request Analysis**: Analyze and prioritize patient requests using **Azure OpenAI** and **NLP**.
- **Voice-Driven Interface**: A seamless, voice-based system for patient requests.
- **Nurse Mobile Application**: Real-time updates for nurses, including patient room numbers and request details.
- **Improved Patient Care**: Faster and more efficient nurse-patient communication.

---

## Key Features

### Multi-Role Authentication
- **Patients**: Register and access the system with ease.
- **Nurses**: Secure registration with admin approval for added control.
- **Admins**: Comprehensive dashboard for managing nurses, requests, and system analytics.

### Voice and AI-Driven Functionality
- **Natural Language Processing (NLP)** for analyzing patient requests.
- **Speech Services** (Speech-to-Text and Text-to-Speech) for seamless voice interactions.
- **Priority Assignment**: AI assigns urgency levels to requests.

### Real-Time Communication
- Instant notification and live status updates for nurses.
- Reliable communication via **Socket.IO**.

### Comprehensive Dashboards
- Admin views pending approvals, nurse activity, and system health.
- Nurses track and respond to requests efficiently.

---

## Technology Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **Socket.IO** for real-time updates
- **JWT** for secure authentication
- **TypeScript**

### Frontend
- **React Native** with **Expo**
- **TypeScript**
- **Socket.IO Client**
- **React Navigation**

### AI & NLP
- **Azure OpenAI** for NLP-powered request analysis
- **Microsoft Speech Services** for Speech-to-Text and Text-to-Speech

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or via a cloud service)
- npm or yarn
- Expo CLI
- Android Studio or Xcode for mobile testing

---

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Kailash51/Voice-Based-Patient-Call-System.git
cd Voice-Based-Patient-Call-System
```
#### 2. Backend Setup
```bash
cd server
npm install
```
#### Update the .env file with your configurations:
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000

#### Start the backend server:
```bash
npm start
```
#### 3. Frontend Setup
```bash
cd client
npm install
```
#### Update the configuration: Edit src/config.ts with your backend URL.
#### Start the frontend application:
```bash
npx expo start -c
```
#### Running the Application
- Use the Expo Go app to scan the QR code from your terminal.
- Alternatively, run the app on an emulator via Android Studio or Xcode.

#### Default Admin Credentials
- Username: admin
- Password: admin


#### Contributing
Contributions are welcome! Follow these steps: 

- ##### 1. Fork the repository:
```bash
git fork https://github.com/Kailash51/Voice-Based-Patient-Call-System.git
```
- ##### 2. Create a new branch:
```bash
git checkout -b feature/AmazingFeature
```
- ##### 3. Commit your changes:
```bash
git commit -m 'Add some AmazingFeature'
```
- ##### 4. Push to the branch:
```bash
git push origin feature/AmazingFeature
```
- ##### 5. Open a pull request for review.


#### License
- This project is licensed under the MIT License. See the LICENSE file for details.

## Important Approaches and External Services

### Client-Side Technologies
- **React Native**: A framework for building mobile applications using JavaScript and React.
- **Expo**: A set of tools and services for rapid development and testing of React Native applications.
- **React Navigation**: A library for managing navigation and routing in React Native applications.
- **React Native Paper**: A UI component library that follows Material Design guidelines, providing pre-built components for a consistent look and feel.
- **Axios**: A promise-based HTTP client for making requests to the backend API.
- **Lodash**: A utility library that simplifies common programming tasks, such as data manipulation.
- **React Native Vector Icons**: A library for using customizable icons in the application.

### State Management
- **Context API**: Used for managing global state, such as user authentication and data sharing across components.

### External Services
- **Azure OpenAI**: Utilized for natural language processing (NLP) to analyze and prioritize patient requests.
- **Microsoft Speech Services**: Integrated for speech-to-text and text-to-speech functionalities, enhancing voice-driven interactions.
- **Toast Notifications**: Using `react-native-toast-message` for displaying notifications and alerts to users.

### Server-Side Technologies
- **Node.js with Express**: The backend is built using Node.js and Express.js, providing a robust framework for handling HTTP requests and managing routes.
- **MongoDB**: A NoSQL database used for storing user data, requests, and other application-related information.
- **Socket.IO**: Implemented for real-time communication between the server and clients, allowing for instant updates and notifications.
- **JWT (JSON Web Tokens)**: Used for secure authentication and authorization.

### API Integration
- The server integrates with external APIs to handle requests, manage appointments, and provide a seamless experience for users.
