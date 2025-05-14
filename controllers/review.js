const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.reviewAdd = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = await new Review(req.body.review);
    newReview.author = req.user._id;
    newReview.save();
   await listing.reviews.push(newReview);
  await listing.save();
  req.flash("success","New Review Added!");

    res.redirect(`/listings/${id}`);

};

module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
req.flash("success","Review Deleted!");

    res.redirect(`/listings/${id}`);

};