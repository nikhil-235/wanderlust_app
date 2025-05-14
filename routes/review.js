const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewControllers = require("../controllers/review.js");




//Reviews request Add new Review
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewControllers.reviewAdd));

//Delete reviews form reviews and listings
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewControllers.deleteReview));
module.exports = router;