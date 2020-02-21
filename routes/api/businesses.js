import express from 'express';
import Business from '../../models/Business';
import mongoose from 'mongoose';

const router = express.Router();

router.get("/test", (req, res) => res.json({ msg: "This is the businesses route" }));

router.get("/:id", (req, res) => {
  Business.findOne({ _id: req.params.id })
    .then(business => res.json(business))
    .catch(err =>
      res.status(404).json({ nobusinessfound: "No business found with that ID"})
    );
});


module.exports = router;