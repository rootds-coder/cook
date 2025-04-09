# Fund Source Platform

A modern web platform for managing and tracking funds, donations, and help requests.

## Features

- 🔒 Secure Admin Authentication
- 💰 Fund Management System
- 🤝 Help Request Management
- 📊 Real-time Analytics Dashboard
- 💸 UPI Payment Integration
- 📱 Responsive Design
- 🌙 Dark/Light Mode Support

## Tech Stack

### Frontend
- React.js with TypeScript
- Material-UI (MUI) for UI components
- Redux for state management
- React Router for navigation
- Chart.js for analytics
- Axios for API calls

### Backend
- Node.js with TypeScript
- Express.js framework
- MongoDB for database
- JWT for authentication
- bcrypt for password hashing
- Rate limiting and security middleware

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fund-source.git
cd fund-source
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
Create `.env` files in both backend and frontend directories:

Backend `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fund-source
JWT_SECRET=your-secret-key
NODE_ENV=development
```

Frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the application:
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm start
```

## Project Structure

```
fund-source/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── README.md
```

## API Documentation

### Authentication
- POST `/api/auth/login` - Admin login
- POST `/api/auth/register` - Register new admin (protected)

### Funds
- GET `/api/funds` - Get all funds
- POST `/api/funds` - Create new fund
- PUT `/api/funds/:id` - Update fund
- DELETE `/api/funds/:id` - Delete fund

### Help Requests
- GET `/api/help-requests` - Get all help requests
- POST `/api/help-requests` - Create new help request
- PUT `/api/help-requests/:id` - Update help request status
- DELETE `/api/help-requests/:id` - Delete help request

## Security Features

- JWT Authentication
- Password Hashing
- Rate Limiting
- CORS Protection
- Input Validation
- XSS Protection
- Environment Variables
- Secure HTTP Headers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@fundsource.com or raise an issue in the GitHub repository.
