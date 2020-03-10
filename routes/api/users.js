import express from "express";
import validateRegisterInput from '../../validation/register';
import validateLoginInput from '../../validation/login';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import keys from '../../config/keys';
import passport from 'passport';
import mongoose from "mongoose";

const router = express.Router();

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ name: req.body.name }).then(user => {
    if (user) {
      errors.name = "User already exists";
      return res.status(400).json(errors);
    } else {
      const newId = new mongoose.Types.ObjectId();
      console.log(newId);
      const newUser = new User({
        _id: newId,
        name: req.body.name,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              const payload = { _id: user._id, name: user.name };

              jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({
                    success: true,
                    jwtToken: "Bearer " + token
                  });
                }
              );
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});


router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const name = req.body.name;
  const password = req.body.password;

  User.findOne({ name }).then(user => {
    if (!user) {
      errors.name = "This user does not exist";
      return res.status(400).json(errors);
    }

    if (!user.password) {
      errors.password = "Bot user";
      return res.status(400).json(errors);
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { _id: user._id, name: user.name };

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              jwtToken: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Incorrect password";
        return res.status(400).json(errors);
      }
    });
  });
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name
  });
});

module.exports = router;