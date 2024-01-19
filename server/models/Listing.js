import mongoose from "mongoose";

const { Schema } = mongoose;

const listingSchema = new Schema({

    name: {
        type: Schema.Types.String,
        required: true
    },
    description: {
        type: Schema.Types.String,
        required: true
    },
    address: {
        type: Schema.Types.String,
        required: true
    },
    regularPrice: {
        type: Schema.Types.Number,
        required: true
    },
    discountedPrice: {
        type: Schema.Types.Number,
        required: true
    },
    bathrooms: {
        type: Schema.Types.Number,
        required: true
    },
    bedrooms: {
        type: Schema.Types.Number,
        required: true
    },
    furnished: {
        type: Schema.Types.Boolean,
        required: true
    },
    parking: {
        type: Schema.Types.Boolean,
        required: true
    },
    offer: {
        type: Schema.Types.Boolean,
        required: true
    },
    type: {
        type: Schema.Types.String,
        required: true
    },
    imageUrls: {
        type: Schema.Types.Array,
        required: true
    },
    userRef: {
        type: Schema.Types.String,
        required: true
    },

}, { timestamps: true })

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;