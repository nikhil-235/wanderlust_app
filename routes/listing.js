const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudconfix.js");
const upload = multer({storage});


router.route("/")
.get(wrapAsync(listingController.index))
.post(
    validateListing,
    isLoggedIn,upload.single("listing[image]"),
    wrapAsync(listingController.newListing)
);




router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    upload.single("listing[image]"),validateListing, 
    isOwner,isLoggedIn,
    wrapAsync(listingController.updateListing)
)
.delete(isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);


//listing edit page
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//listing update route





module.exports = router;