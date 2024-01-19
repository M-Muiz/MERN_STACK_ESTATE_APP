import express from "express";
import verifyToken from "../utils/verifyToken.js";
import Listing from "../models/Listing.js";
import errorHandler from "../utils/error.js";

const router = express.Router();


router.post("/create", verifyToken, async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        res.status(200).json(listing);
    } catch (error) {
        next(error)
    }
});

router.post("/update_listing/:id", verifyToken, async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, 'You can only update your own listings!'));
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
})

router.delete("/delete_listing/:id", verifyToken, async (req, res, next) => {
    const deleteListing = await Listing.findById(req.params.id);
    if (!deleteListing) {
        return next(errorHandler(404, "listing Not Found!"))
    };

    if (req.user.id !== deleteListing.userRef) {
        return next(errorHandler(401, "You can only delete your own listing!!"))
    };
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Listing has been deleted Successfully!")
    }
    catch (error) {
        next(error)
    }
});

router.get("/get_listing/:id", async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, "List Not Found!"))
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
});

router.get("/show_user_listing/:id", async (req, res, next) => {
    try {
        const listings = await Listing.find({ userRef: req.params.id });
        res.status(200).json(listings);
    } catch (error) {
        next(error);
    }

});



router.get("/get_listings", async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;

        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;

        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;

        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;

        if (type === undefined || type === 'all') {
            type = { $in: ['sell', 'rent'] };
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
})

export default router;