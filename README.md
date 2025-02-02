## StaySuite's Server
**StaySuite** is a property rental platform similar offering key features such as user authentication, booking management, saving travelling history and favurite listings for guests while enabling  host to manange listings via dashboard and seamlessly handle  reservations made on there listings. It supports secure authentication using `JWT`, real-time updates for both guests and hosts with `Socket.io`, and image uploads of listings with `Multer`. Built with `Nuxt.js` for the frontend,` Nest.js `for the backend, and `MongoDB` for data storage, the platform ensures a seamless and efficient user experience.

</br>

[![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](#)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat&label=Contributions&colorA=red&colorB=black	)](#)

### Project Description
This repository contains the backend for the `StaySuite` property rental platform, built with Nest.js, MongoDB, JWT, Socket.io, and Multer. It handles user authentication, booking management, real-time updates, and secure file uploads, ensuring a scalable and efficient system.

Nest.js, with its modular architecture and TypeScript support, is ideal for this project as it enhances maintainability, enforces best practices, and provides built-in support for WebSockets, making real-time features seamless. MongoDB ensures flexible data handling, while JWT secures authentication. Socket.io enables instant communication between guests and hosts, and Multer efficiently manages media uploads.

### 🤖 Tech Stack 
<a href="#"> 
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-%232F73B4.svg?&style=for-the-badge&logo=TypeScript&logoColor=white"/>

<img alt="Nest.js" src="https://img.shields.io/badge/Nest.js-%23E0234E.svg?&style=for-the-badge&logo=NestJS&logoColor=white"/>

<img alt="MongoDB" src ="https://img.shields.io/badge/MongoDB-%234ea94b.svg?&style=for-the-badge&logo=mongodb&logoColor=white"/> 
 <img alt="JWT Auth" src="https://img.shields.io/badge/JWT%20Auth-%23F7B731.svg?&style=for-the-badge&logo=json-web-tokens&logoColor=white"/>

<img alt="Socket.IO" src="https://img.shields.io/badge/Socket.IO%20-%23010101.svg?&style=for-the-badge&logo=socket.io&logoColor=white"/>
 </a>
 

---
- Check out the latest demo of Project [StaySuite-Site](https://collabora8r.vercel.app/). 
- Find the Client Repository of this Project Here [StaySuite-Client](https://github.com/BazilSuhail/StaySuite-Client). 
---

### Run Locally
Clone the project using the following command:
```bash
   git clone https://github.com/BazilSuhail/StaySuite-Server.git
```
Go to the project directory
```bash
   cd StaySuite-Server
```
Then **Run** this command in your terminal to install all required dependancies:
```bash
   npm install
```
In the project directory, you can run:
```bash
   npm run start:dev
``` 
Runs the app in the development mode. Your server will be running at port 3001, 
Open [http://localhost:3001](http://localhost:3001) or also you can modify it in the **.env** file.
## Features

#### User Authentication
- **Signup Page**: A registration api for new users to get register themselves as a Guest or Host.
- **Login Page**: A login api for existing users allowing them to log into there accounts.

#### Admin Panel
- **Listings Management**: Admin api enabling him to view, add, and remove property listings.
- **Bookings Management**: Admin api enabling him to view all bookings, including user and property details.

#### Protected Routes
- **User Profile**: User api enabling him to view his information and .
- **Admin Panel**: Accessible api's only to Host users.
- **Booking history**: Guests api's enabling them to can view there booking history.
- **Redirection for Unauthenticated Users**: Users attempting to access protected routes are redirected to the login page.

#### Booking System
- **Booking Page**: Users api enabling them to submit bookings, which are saved to the backend.
- **Reserved Bookings for Guests Page**: Displaying reserved bookings api for each user.
- **Reserved Bookings for Host Page**: Displaying api for reserved bookings on Hosts Listings.

#### Mini Admin Panel
- **Listings Management**: Api for Host to add new listings with property details and images, and list view for displaying and deleting existing listings.
- **Bookings Management**: Admin's api to overview of all bookings with details for each booking, including user and property information.

#### Backend Security
- **Role-Based Access Control**: Routes are protected based on user roles (e.g., admin).
- **JWT Middleware**: Secures routes that require authentication.
- **Password Hashing**: Passwords are hashed using bcrypt before being saved to the database.
  