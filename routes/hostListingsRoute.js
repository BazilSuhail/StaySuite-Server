const express = require('express');
const router = express.Router();
const { addListing, getHostedListings, addListingWithImages, updateListing, deleteListing } = require('../controllers/hostListingsController');
const authenticate  = require('../middleware/authMiddleware');

const multer = require('multer'); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'listing_images');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });


router.post('/add-listing', authenticate, addListing);

router.post('/add-listing-with-images', authenticate,
  upload.fields([
    { name: 'placeImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 5 },
  ]),
  addListingWithImages
);


router.get('/hosted-listings', authenticate, getHostedListings);

router.put('/update-listing/:id', authenticate, updateListing);

router.delete('/delete-listing/:listingId', authenticate, deleteListing);

module.exports = router;
