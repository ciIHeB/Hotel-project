# Hotel Website Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MySQL Server
- Angular CLI (`npm install -g @angular/cli`)

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env` file and update the following:
     - `MYSQL_HOST`: Your MySQL host (default: localhost)
     - `MYSQL_PORT`: Your MySQL port (default: 3306)
     - `MYSQL_DATABASE`: Database name (default: hotel_website)
     - `MYSQL_USER`: Your MySQL username (default: root)
     - `MYSQL_PASSWORD`: Your MySQL password
     - `JWT_SECRET`: A secure secret key for JWT tokens

4. **Create MySQL database:**
   ```sql
   CREATE DATABASE hotel_website;
   ```

5. **Setup database tables:**
   ```bash
   npm run setup-db
   ```

6. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`

## Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   ng serve
   ```
   The application will be available at `http://localhost:4200`

## API Endpoints

The backend exposes the following API endpoints:

- **Authentication:** `/api/auth/*`
  - POST `/api/auth/register` - User registration
  - POST `/api/auth/login` - User login
  - GET `/api/auth/me` - Get current user

- **Rooms:** `/api/rooms/*`
  - GET `/api/rooms` - Get all rooms
  - GET `/api/rooms/:id` - Get specific room
  - POST `/api/rooms` - Create room (admin)
  - PUT `/api/rooms/:id` - Update room (admin)
  - DELETE `/api/rooms/:id` - Delete room (admin)

- **Bookings:** `/api/bookings/*`
  - GET `/api/bookings` - Get all bookings
  - GET `/api/bookings/:id` - Get specific booking
  - POST `/api/bookings` - Create booking
  - PUT `/api/bookings/:id` - Update booking

- **Users:** `/api/users/*`
  - GET `/api/users` - Get all users (admin)
  - GET `/api/users/:id` - Get specific user
  - PUT `/api/users/:id` - Update user
  - DELETE `/api/users/:id` - Delete user (admin)

- **Contact:** `/api/contact/*`
  - POST `/api/contact` - Send contact message

## Features

✅ **Implemented Compatibility Features:**
- JWT Authentication with HTTP Interceptor
- Environment-based configuration
- CORS enabled for frontend-backend communication
- Database setup automation
- Error handling and validation
- Rate limiting and security headers

## Troubleshooting

1. **Database Connection Issues:**
   - Ensure MySQL server is running
   - Check database credentials in `.env`
   - Verify database exists

2. **CORS Issues:**
   - Backend is configured to accept requests from `http://localhost:4200`
   - Update `FRONTEND_URL` in `.env` if using different port

3. **Authentication Issues:**
   - JWT tokens are stored in localStorage
   - Tokens are automatically included in API requests via interceptor
   - Check browser console for authentication errors
