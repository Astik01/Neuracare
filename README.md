# Smart Healthcare - AI Symptom Checker

A modern healthcare application with AI-powered symptom analysis, doctor booking, and user registration. Built with HTML, CSS, JavaScript, Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Frontend
1. **Simply open `index.html` in your web browser** (for basic functionality)
2. For full functionality with user registration, you need to run the backend server

### Backend Setup (Required for User Registration)
1. Navigate to the `server` directory
2. Install dependencies: `npm install`
3. Create a `.env` file (see MongoDB Setup below)
4. Start the server: `npm start`
5. The server will run on `http://localhost:5000`

## 📁 Project Structure

```
DMND FINAL PROJECT/
├── index.html          # Main application file
├── styles.css          # All styling and responsive design
├── script.js           # Frontend functionality and API calls
├── server/
│   ├── server.js       # Express backend server
│   ├── package.json    # Node.js dependencies
│   └── .env            # MongoDB connection string (create this)
└── README.md           # This file
```

## ✨ Features

### 🤖 AI Symptom Checker
- Interactive symptom input with autocomplete
- Real-time symptom analysis
- Condition probability scoring
- Urgency level assessment
- Age and gender consideration

### 👨‍⚕️ Doctor Search & Booking
- Sample doctor database
- Specialty filtering (Cardiology, Dermatology, Pediatrics, etc.)
- Doctor profiles with ratings and consultation fees
- Booking simulation

### 💬 Interactive Chatbot
- AI assistant for healthcare questions
- Real-time chat interface
- Pre-defined responses for common queries
- Floating chat bubble

### 📱 Professional UI/UX
- Modern, responsive healthcare design
- Mobile-friendly interface
- Smooth animations and transitions
- Clean, professional color scheme
- Font Awesome icons

### 🗄️ Backend & Database
- Express.js REST API server
- MongoDB database integration
- User registration and data persistence
- Mongoose ODM for data modeling

## 🎯 How to Use

### Symptom Checker
1. Navigate to the "Symptom Checker" section
2. Type symptoms like "headache", "fever", "chest pain"
3. Add multiple symptoms as needed
4. Select age group and gender
5. Click "Analyze Symptoms" to get AI insights

### Doctor Search
1. Go to the "Appointments" section
2. Filter by specialty or availability
3. View doctor profiles and ratings
4. Click "Book Now" to simulate booking

### Chatbot
1. Click the chat bubble in the bottom-right corner
2. Ask questions like:
   - "hello" - Greeting
   - "appointment" - Booking help
   - "symptoms" - Symptom checker info
   - "cost" - Pricing information
   - "emergency" - Emergency guidance

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign up for a free account
3. Create a new cluster (free tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Create a `.env` file in the `server` directory:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare-db?retryWrites=true&w=majority
   PORT=5000
   ```
7. Replace `username`, `password`, and `cluster` with your actual values

### Option 2: Local MongoDB
1. Install MongoDB locally on your machine
2. Start MongoDB service
3. Create a `.env` file in the `server` directory:
   ```
   MONGO_URI=mongodb://localhost:27017/healthcare-db
   PORT=5000
   ```

### Testing the Connection
1. Navigate to `server` directory
2. Run `npm install` (if not already done)
3. Run `npm start`
4. You should see: `✅ Successfully connected to MongoDB`

## 🔧 Customization

### Adding More Doctors
Edit the `sampleDoctors` array in `script.js`:

```javascript
const sampleDoctors = [
    {
        id: 4,
        name: "Dr. Your Doctor",
        specialty: "specialty",
        specialties: ["Specialty 1", "Specialty 2"],
        rating: 4.8,
        experience: "X years",
        fee: "$XXX",
        availability: "Available",
        avatar: "fas fa-user-md"
    }
    // ... add more doctors
];
```

### Adding More Symptoms
Update the `symptomDatabase` object in `script.js`:

```javascript
const symptomDatabase = {
    symptoms: [
        "your", "new", "symptoms", "here"
    ],
    conditions: {
        "symptom": ["condition1", "condition2", "condition3"]
    }
};
```

### Changing Colors/Theme
Edit the CSS variables in `styles.css`:

```css
/* Primary colors */
.btn-primary {
    background: linear-gradient(135deg, #your-color-1, #your-color-2);
}
```

## 🌐 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 📱 Mobile Support

The application is fully responsive and works great on:
- 📱 Smartphones
- 📱 Tablets
- 💻 Desktop computers

## 🎨 Design Features

- **Modern Healthcare Theme**: Professional blue/teal color scheme
- **Responsive Design**: Works on all screen sizes
- **Smooth Animations**: CSS transitions and hover effects
- **Clean Typography**: Inter and Poppins fonts
- **Accessible**: Good contrast and readable text

## 🚀 Deployment

### Option 1: Static Hosting
Upload all 3 files to any web hosting service:
- GitHub Pages
- Netlify
- Vercel
- Any web server

### Option 2: Local Development
```bash
# Using Python
python -m http.server 8000

# Using Node.js (if installed)
npx serve .

# Then visit: http://localhost:8000
```

## 📋 Demo Data

The application includes sample data for demonstration:
- 3 sample doctors with different specialties
- Common symptoms database
- Pre-defined chatbot responses
- Mock AI analysis results

## 🔒 Security Note

This is a demo application. For production use:
- Add proper authentication
- Implement real AI/ML models
- Use secure backend services
- Follow HIPAA compliance guidelines

## 🆘 Support

This is a lightweight demo application. For questions:
1. Check the code comments in `script.js`
2. Review the CSS classes in `styles.css`
3. Modify the HTML structure in `index.html`

## 📄 License

This project is for educational and demonstration purposes.

---

**Ready to use! Just open `index.html` in your browser and start exploring! 🏥✨**