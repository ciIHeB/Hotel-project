# Hotel Website Backend API

A comprehensive Node.js and Express backend API for a hotel booking website with authentication, room management, booking system, and contact functionality.

## Features

- **User Authentication** - JWT-based authentication with registration and login
- **Room Management** - CRUD operations for hotel rooms with filtering and availability checking
- **Booking System** - Complete booking management with status tracking
- **User Management** - Admin panel for managing users
- **Contact System** - Contact form with email notifications
- **Security** - Helmet, CORS, rate limiting, and input validation
- **Database** - MongoDB with Mongoose ODM

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user profile
- `PUT /update-profile` - Update user profile

### Rooms (`/api/rooms`)
- `GET /` - Get all rooms with filtering
- `GET /:id` - Get single room
- `GET /availability/check` - Check room availability
- `POST /` - Create room (Admin only)
- `PUT /:id` - Update room (Admin only)
- `DELETE /:id` - Delete room (Admin only)

### Bookings (`/api/bookings`)
- `GET /` - Get user bookings or all bookings (Admin)
- `GET /:id` - Get single booking
- `POST /` - Create new booking
- `PUT /:id/status` - Update booking status
- `GET /search/:bookingId` - Search booking by ID

### Users (`/api/users`) - Admin only
- `GET /` - Get all users
- `GET /:id` - Get single user
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user
- `PUT /:id/toggle-status` - Toggle user active status

### Contact (`/api/contact`)
- `POST /` - Send contact message
- `POST /newsletter` - Subscribe to newsletter

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env` file and update the following variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure secret key for JWT tokens
   - `EMAIL_USER` and `EMAIL_PASS` - Email credentials for contact forms
   - `FRONTEND_URL` - Your frontend URL (default: http://localhost:4200)

3. **Database Setup**
   - Make sure MongoDB is running locally or use MongoDB Atlas
   - The application will connect automatically when started

4. **Start the Server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Health Check**
   - Visit `http://localhost:5000/api/health` to verify the server is running

## Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:4200

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hotel_website

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Database Models

### User Model
- Personal information (name, email, phone)
- Authentication (password hashing)
- Role-based access (guest/admin)
- Preferences and profile settings

### Room Model
- Room details (number, type, description)
- Pricing and capacity information
- Amenities and images
- Availability status

### Booking Model
- User and room references
- Check-in/check-out dates
- Guest information and special requests
- Payment and booking status
- Unique booking ID generation

## Security Features

- **Helmet** - Sets various HTTP headers for security
- **CORS** - Cross-origin resource sharing configuration
- **Rate Limiting** - Prevents abuse with request limiting
- **Input Validation** - Express-validator for request validation
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage

## Development

- Use `npm run dev` for development with auto-restart
- API documentation available at each endpoint
- Error handling middleware for consistent error responses
- Logging for debugging and monitoring

## Testing

Run tests with:
```bash
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Configure proper email service
4. Set up SSL/HTTPS
5. Use PM2 or similar for process management

## Support

For issues or questions, please contact the development team or create an issue in the project repository.
