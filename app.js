import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import users from './routes/api/users';
// import messages from './routes/api/messages';
// import channels from './routes/api/channels';
import businesses from './routes/api/businesses';


const app = express();
const db = require("./config/keys").mongoURI;
// import routes

// set up DB
const AutoIncrement = require("mongoose-sequence")(mongoose);
mongoose
  .connect(db, { 
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true
   })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

// app.get("/", (req, res) => res.send("Hello World"));
app.use(passport.initialize());
require('./config/passport')(passport);

const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log(`Server is running on port ${port}`));

// parse JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// let Express use newly imported routes
app.use("/api/users", users);
// app.use("/api/channels", channels);
// app.use("/api/messages", messages);
app.use("/api/biz", businesses);
