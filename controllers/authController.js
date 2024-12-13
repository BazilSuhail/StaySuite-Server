const User = require('../models/user');
const jwt = require('jsonwebtoken');
const HostListing = require('../models//hosted_listings');
const GuestBookings = require('../models/guest_bookings');
const FavouriteListings = require('../models/favourite_listings');
const Notifications = require('../models/notifications');
const bcrypt = require('bcryptjs');


exports.register = async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists', message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      phoneNumber:'03000000000',
      role
    });

    if (role === 'Host') {
      const hostListing = new HostListing({
        hostID: newUser._id
      }); 
      await hostListing.save(); 
      newUser.hosted_listings = hostListing._id;
    }
    else {
      const guestListings = new GuestBookings({
        _id: newUser._id
      });
      await guestListings.save(); 

      const favouriteListings = new FavouriteListings({
        _id: newUser._id
      });
      await favouriteListings.save();
    }
    await newUser.save();

    const UserNotifications = new Notifications({
      _id: newUser._id
    });

    await UserNotifications.save();

    res.status(201).json({ message: 'User registered successfully' });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );

    res.json({ token });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

