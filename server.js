const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./mongoDb/db');  
const path = require('path');
const http = require('http');
const { initSocket } = require('./socket');

dotenv.config();
connectDB();
const app = express();

const server = http.createServer(app);
initSocket(server); 


app.use('/listing_images', express.static(path.join(__dirname, 'listing_images')));
app.use(cors());
app.use(express.json());


app.use('/air-bnb/home', require("./routes/listingsRoutes"));               // Home page routes => listing, listings details, searching

app.use('/air-bnb/auth', require("./routes/authRoute"));                    // Auth page routes => register, login

app.use('/air-bnb/profile', require("./routes/profileRoute"));              // Profile page routes => profile,update and guest favourites

app.use('/air-bnb/reservation', require("./routes/guestBookingRoute"));     // Guest Bookings page routes => create booking, blocked details, finalize update booking status

app.use('/air-bnb/manage-bookings', require("./routes/hostBookingsRoute")); // Host Bookings page routes => get own listinsg bookings, update them and user info of who made booking

app.use('/air-bnb/hosting', require("./routes/hostListingsRoute"));         // Host Add Listings page routes => add lisitngs with and without images and uodate them, delete them

app.use('/air-bnb/listing-rating', require("./routes/listingRatingRoutes")); // Listings ratings page routes => add and get review for a lisitngs, get the rating

 
//const PORT = process.env.PORT || 3001;
const SOCKET_PORT = 3001;
server.listen(SOCKET_PORT, () => console.log(`Scoket Server running on port ${SOCKET_PORT}`));
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
