import express from 'express';
import user from '../controller/user.js'
import listing from '../controller/listing.js'

const router = express.Router();

router.use('/user', user);
router.use('/listing', listing);

export default router;