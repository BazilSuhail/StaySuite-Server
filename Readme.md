# Airbnb Clone

This project is a basic Airbnb clone's backend, featuring user authentication, booking management, and host panel for managing listings and bookings. Built with React.js, MongoDB, and Node.js, this project demonstrates core functionality needed for an online property rental platform.

## Features

### User Authentication
- **Signup Page**: A registration api for new users.
- **Login Page**: A login api for existing users.

### Admin Panel
- **Listings Management**: Admin api enabling him to view, add, and remove property listings.
- **Bookings Management**: Admin api enabling him to view all bookings, including user and property details.

### Protected Routes
- **User Profile**: User api enabling him to view his information and .
- **Admin Panel**: Accessible api's only to Host users.
- **Booking history**: Guests api's enabling them to can view there booking history.
- **Redirection for Unauthenticated Users**: Users attempting to access protected routes are redirected to the login page.

### Booking System
- **Booking Page**: Users api enabling them to submit bookings, which are saved to the backend.
- **Reserved Bookings for Guests Page**: Displaying reserved bookings api for each user.
- **Reserved Bookings for Host Page**: Displaying api for reserved bookings on Hosts Listings.

### Mini Admin Panel
- **Listings Management**: Api for Host to add new listings with property details and images, and list view for displaying and deleting existing listings.
- **Bookings Management**: Admin's api to overview of all bookings with details for each booking, including user and property information.

### Backend Security
- **Role-Based Access Control**: Routes are protected based on user roles (e.g., admin).
- **JWT Middleware**: Secures routes that require authentication.
- **Password Hashing**: Passwords are hashed using bcrypt before being saved to the database.
 
## Tech Stack 
- **Backend**: Node.js, Express, MongoDB.
- **Authentication**: JWT (JSON Web Tokens) 

## Installation Guide:

1. Clone the repository:
   ```bash
   git clone https://github.com/bazil-1854/BSCS22072_AirBnb_Server.git
   cd <where-you-cloned>
   ```

   
2. Install dependancies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run dev
   ```
