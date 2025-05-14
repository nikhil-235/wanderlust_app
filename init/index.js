const mongoose = require("mongoose");
const initData = require("./data.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
async function main(){
    await mongoose.connect(MONGO_URL);
    return "connection sucessful"
}
main()
    .then(res => console.log(res))
    .catch(err => console.log(err));
    // data inert into database
const initDB = async () =>{
    await Listing.deleteMany({});
    initData .data = initData.data.map((obj)=>(
        {...obj,owner:'681917e6bb0dd964870b39e8',}
    ));
    await Listing.insertMany(initData.data);
    console.log("Review is delete");
};
// initDB().then(()=> console.log("insert data sucessful"));

