const { response } = require("express");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken});



module.exports.index = async(req,res)=>{
    const allListings = await Listing.find();
    res.render("./listings/index.ejs",{allListings,title:"All Listings"});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs",{title:"Add Listing"});
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
   if(!listing){
   req.flash("error","Listing you requested for does not exist!");
     return  res.redirect("/listings");
};
   res.render("./listings/show.ejs",{listing,title:"Show Listing"});

};

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    let data = await Listing.findById(id);
    if(!data){
        req.flash("error","Listing you requested for does not exist! "); 
     return  res.redirect("/listings");
    }
    let originalImageUrl = data.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_200")
    res.render("./listings/edit.ejs",{data,title:"Edit Listing",originalImageUrl});
};

module.exports.updateListing = async(req,res)=>{
     let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
}).send();
    let{id} = req.params;
   let updateList = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    updateList.geometry = response.body.features[0].geometry;
   if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
   updateList.image = {url,filename} 
};
 await updateList.save();
   req.flash("success","Listing Updated!");
    res.redirect( `/listings/${id}`);  
};

module.exports.newListing = async(req,res,next)=>{
 let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
}).send();
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing =  new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
req.flash("success","New Listing Created!");
res.redirect("/listings"); 
};

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
};