import express from 'express';
import Business from '../../models/Business';
import Photo from '../../models/Photo';
import Review from '../../models/Review';
import User from '../../models/User';
import mongoose from 'mongoose';

const router = express.Router();

// console.log(Business.find({city: "Dublin"}));
// console.log(Business.find(null, (err, businesses) => console.log(businesses)));

// Business.find(null, (err, businesses) => {
//   businesses.forEach(biz => {
    
//     Promise.all([
//       Photo.find({ business_id: biz._id }).select('_id'),
//       Review.find({ business_id: biz._id }).select('_id').sort({ date: -1 })
//     ]).then(([photos, reviews]) => {
//       biz.photos = photos.map(photo => photo._id).slice();
//       biz.reviews = reviews.map(review => review._id).slice()
//       biz.save();
//     });

//     console.log(`${biz._id} updated`);

//   //   Photo.find({ business_id: biz._id }).select('_id').map(photos => {
//   //     return photos.map(photo => photo._id);
//   //   }).then(photos => {
//   //     biz.photos = photos.slice();
//   //     biz.save();
//   //   });

//   //   console.log(`${biz._id} photos updated`);

//   //   Review.find({ business_id: biz._id }).select('_id').map(reviews => {
//   //     return reviews.map(review => review._id);
//   //   }).then(reviews => {
//   //     biz.reviews = reviews.slice();
//   //     biz.save();
//   //   });

//   //   console.log(`${biz._id} reviews updated`);
//   // });

//   });
// });


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

router.get("/city/:city/:state", (req, res) => {
  Business.find({city: req.params.city, state: req.params.state})
    .populate('photos')
    .populate({
      path: 'reviews',
      populate: {
        path: 'user_id'
      }
    })
    .then(biz => res.json(biz))
    .catch(err =>
      res.status(404).json({ nobusinessfound: "No business found with that ID" })
    );
});

// router.get("/:id", (req, res) => {
//   Promise.all([
//     Photo.find({ business_id: req.params.id }),
//     Review.find({ business_id: req.params.id }).sort({date: -1}).populate('user_id'),
//     Business.findOne({ _id: req.params.id })
//   ]).then(([photos, reviews, business]) => res.json(Object.assign(business, {photos}, {reviews})))
//     .catch(err =>
//       res.status(404).json({ nobusinessfound: "No business found with that ID"})
//     );
// });


router.get("/:id", (req, res) => {
  
  Business.findOne({ _id: req.params.id })
    .populate('photos')
    .populate({
      path: 'reviews',
      populate: {
        path: 'user_id'
      },
      options: {
        sort: { date: -1 }
      }
    })
    .then(biz => res.json(biz))
    .catch(err =>
      res.status(404).json({ nobusinessfound: "No business found with that ID" })
    );
});



module.exports = router;