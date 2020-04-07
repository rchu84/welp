import express from 'express';
import Business from '../../models/Business';
import Photo from '../../models/Photo';
import Review from '../../models/Review';
import Tip from '../../models/Tip';
import User from '../../models/User';
import mongoose from 'mongoose';
import passport from 'passport';

const businesses = express.Router();

// console.log(Business.find({city: "Dublin"}));
// console.log(Business.find(null, (err, businesses) => console.log(businesses)));

businesses.get("/test", (req, res) => res.json({ msg: "This is the businesses route" }));

businesses.get("/cities", (req, res) => {
  // Business.distinct("city")
  Business.aggregate([
      { $group: { _id: { city: '$city', state: '$state' }}},
      { $sort: { "_id.state": 1, "_id.city": 1 }}
    ])
    .then(categories => res.json(categories))
    .catch(err =>
      res.status(404).json({ nocategoriesfound: "No categories found" })
    );
});

businesses.get("/categories", (req, res) => {
  Business.distinct("categories")
    .then(categories => res.json(categories))
    .catch(err =>
      res.status(404).json({ nocategoriesfound: "No categories found" })
    );
});

businesses.get("/city", (req, res) => {
    // .populate("photos")
    // .populate({
    //   path: "reviews",
    //   populate: {
    //     path: "user_id"
    //   },
    //   options: {
    //     sort: { date: -1 }
    //   }
    // })
  let query = {
    city: req.query.city,
    state: req.query.state,
    categories: req.query.category,
    // "attributes.RestaurantsPriceRange2": { $in: req.query.priceRange.split(",") }
  };
  if (req.query.prices) query["attributes.RestaurantsPriceRange2"] = {
                              $in: req.query.prices.split(",")
                            };

  let options = {
    // populate: ['photos', { 
    //   path: "reviews", 
    //   populate: { path: "user_id" },
    //   options: { sort: { date: -1 }}
    // }],
    limit: 20,
    page: req.query.page || 1,
    populate: 'photos',
    lean: true
  };

  // console.log(req.query);
  if (req.query.sort) {
    if (req.query.sort === "1") {
      options["sort"] = {
        stars: -1,
        review_count: -1
      };
    } else if (req.query.sort === "2") {
      options["sort"] = {
        review_count: -1
      };
    }
  };

  // console.log(options);

  Business.paginate(query, options)
    .then(biz => res.json(biz))
    .catch(err =>
      res
        .status(404)
        .json({ nobusinessfound: "No business found with that ID" })
    );
});

// businesses.get("/:id", (req, res) => {
//   Promise.all([
//     Photo.find({ business_id: req.params.id }),
//     Review.find({ business_id: req.params.id }).sort({date: -1}).populate('user_id'),
//     Business.findOne({ _id: req.params.id })
//   ]).then(([photos, reviews, business]) => res.json(Object.assign(business, {photos}, {reviews})))
//     .catch(err =>
//       res.status(404).json({ nobusinessfound: "No business found with that ID"})
//     );
// });


businesses.get("/:id", (req, res) => {
  
  Business.findOne({ _id: req.params.id })
    .populate('photos')
    // .populate({
    //   path: 'reviews',
    //   populate: {
    //     path: 'user_id'
    //   },
    //   options: {
    //     sort: { date: -1 }
    //   }
    // })
    .then(biz => res.json(biz))
    .catch(err =>
      res.status(404).json({ nobusinessfound: "No business found with that ID" })
    );
});

businesses.get("/:id/reviews", (req, res) => {
  let query = {
    business_id: req.params.id
  };
  let options = {
    // populate: ['photos', {
    //   path: "reviews",
    //   populate: { path: "user_id" },
    //   options: { sort: { date: -1 }}
    // }],
    sort: { date: -1 },
    populate: 'user_id',
    limit: 20,
    page: req.query.page || 1,
    lean: true
  };

  Review.paginate(query, options)
    .then(reviews => res.json(reviews))
    .catch(err =>
      res
        .status(404)
        .json({ nobusinessfound: "No reviews found with that ID" })
    );
});

businesses.post(
  "/:id/reviews",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // const { errors, isValid } = validateTweetInput(req.body);

    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    // _id: {
    //   type: String,
    //     required: true
    // },
    // user_id: {
    //   type: String,
    //     ref: "User",
    //       required: true,
    //         index: true
    // },
    // business_id: {
    //   type: String,
    //     ref: "Business",
    //       required: true,
    //         index: true
    // },
    // stars: Number,
    //   useful: Number,
    //     funny: Number,
    //       cool: Number,
    //         text: String,
    //           date: {
    //   type: Date,
    // default: Date.now
    // }
    const newId = new mongoose.Types.ObjectId();

    const newReview = new Review({
      _id: newId,
      user_id: req.user._id,
      business_id: req.params.id,
      text: req.body.text,
      stars: req.body.stars
    });

    newReview.save()
      .then(review => {
        User.findOne({ _id: req.user._id }, (err, user) => {
          user.setNext('user_review_count', (err, user) => {
            if (err) console.log('Cannot increment review_count because ', err);
          });
        });
        Business.findOne({ _id: req.params.id }, (err, biz) => {
          biz.setNext("biz_review_count", (err, biz) => {
            if (err) console.log("Cannot increment review_count because ", err);
          });
        });
        return res.json(review);
      })
      .catch(err =>
        res.status(404)
          .json({ review: "Error - Please try again" })
      );;
  }
);

// module.exports = businesses;

businesses.get("/:id/tips", (req, res) => {
  let query = {
    business_id: req.params.id
  };
  let options = {
    // populate: ['photos', {
    //   path: "tips",
    //   populate: { path: "user_id" },
    //   options: { sort: { date: -1 }}
    // }],
    sort: { date: -1 },
    populate: "user_id",
    limit: 20,
    page: req.query.page || 1,
    lean: true
  };

  Tip.paginate(query, options)
    .then(tips => res.json(tips))
    .catch(err =>
      res.status(404).json({ nobusinessfound: "No tips found with that ID" })
    );
});


// module.exports = businesses;
export default businesses;