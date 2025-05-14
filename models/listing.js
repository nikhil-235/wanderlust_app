const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");
const listingSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        url:String,
        filename:String,
       
    },
    price:{
        type:Number,
        min:0,

    },
    location:{
        type:String,

    },
    country:{
        type:String,
        required:true,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",

        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",

    },

     geometry: {
    type: {
      type: String, 
      enum: ['Point'], 
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  cateogry:{
    type:String,
    enum:['AmazingPools','Camping','Farms','Arctic','Mountains','Castles', 'Iconic Cities', 'Rooms', 'Trending'],
    
  }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});

    }

})

const Listing = mongoose.model("Listing",listingSchema);

module.exports= Listing;

