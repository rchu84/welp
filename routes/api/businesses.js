import express from 'express';
import Business from '../../models/Business';
import Photo from '../../models/Photo';
import Review from '../../models/Review'
import mongoose from 'mongoose';

const router = express.Router();

router.get("/test", (req, res) => res.json({ msg: "This is the businesses route" }));

router.get("/cities", (req, res) => {
  Business.distinct("city")
    .then(categories => res.json(categories))
    .catch(err =>
      res.status(404).json({ nocategoriesfound: "No categories found" })
    );
});

router.get("/categories", (req, res) => {
  Business.distinct("categories.0")
    .then(categories => res.json(categories))
    .catch(err =>
      res.status(404).json({ nocategoriesfound: "No categories found" })
    );
});

router.get("/:id", (req, res) => {
  Promise.all([
    Photo.find({ business_id: req.params.id }),
    Review.find({ business_id: req.params.id }).sort({date: -1}),
    Business.findOne({ _id: req.params.id })
  ]).then(([photos, reviews, business]) => res.json(Object.assign(business, {photos}, {reviews})))
    .catch(err =>
      res.status(404).json({ nobusinessfound: "No business found with that ID"})
    );
});




module.exports = router;