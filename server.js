const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);

    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

let app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use("/uploads", express.static("uploads"));

let authorize = (req, res, next) => {
  console.log(req.headers.authorization);
  next();
};

app.use(authorize);

let userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
  password: String,
  mobileNo: String,
  profilePic: String,
});

let User = new mongoose.model("user", userSchema);

app.post("/signup", upload.single("profilePic"), async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  try {
    let hashedPassword = await bcrypt.hash(req.body.password, 10);

    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      email: req.body.email,
      password: hashedPassword,
      mobileNo: req.body.mobileNo,
      profilePic: req.file.path,
    });

    let usersList = await User.find().and({ email: req.body.email });

    if (usersList.length > 0) {
      res.json({ status: "failure", msg: "User already exists" });
    } else {
      await User.insertMany([newUser]);
      res.json({ status: "success", msg: "User Created Successfully" });
    }
  } catch (err) {
    res.json({ status: "error", msg: "Unable to create account", err: err });
  }
});

app.post("/validateLogin", upload.none(), async (req, res) => {
  console.log(req.body);

  let userDetails = await User.find().and({ email: req.body.email });

  if (userDetails.length > 0) {
    let isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      userDetails[0].password
    );
    if (isPasswordCorrect == true) {
      let token = jwt.sign(
        {
          email: req.body.email,
          password: req.body.password,
        },
        "BRN2312Batch"
      );

      let details = {
        firstName: userDetails[0].firstName,
        lastName: userDetails[0].lastName,
        age: userDetails[0].age,
        email: userDetails[0].email,
        mobileNo: userDetails[0].mobileNo,
        profilePic: userDetails[0].profilePic,
        token: token,
      };

      res.json({ status: "success", data: details });
    } else {
      res.json({ status: "failure", msg: "Invalid Password" });
    }
  } else {
    res.json({ status: "failure", msg: "User doesnot exist" });
  }

  console.log(userDetails);
});

app.post("/validateToken", upload.none(), async (req, res) => {
  console.log(req.body);

  let decryptedToken = jwt.verify(req.body.token, "BRN2312Batch");
  console.log(decryptedToken);
  let userDetails = await User.find().and({ email: decryptedToken.email });

  if (userDetails.length > 0) {
    if (userDetails[0].password == decryptedToken.password) {
      let details = {
        firstName: userDetails[0].firstName,
        lastName: userDetails[0].lastName,
        age: userDetails[0].age,
        email: userDetails[0].email,
        mobileNo: userDetails[0].mobileNo,
        profilePic: userDetails[0].profilePic,
      };

      res.json({ status: "success", data: details });
    } else {
      res.json({ status: "failure", msg: "Invalid Password" });
    }
  } else {
    res.json({ status: "failure", msg: "User doesnot exist" });
  }

  console.log(userDetails);
});

app.patch("/editProfile", upload.single("profilePic"), async (req, res) => {
  console.log(req.body);

  if (req.body.firstName.trim().length > 0) {
    let result = await User.updateMany(
      { email: req.body.email },
      { firstName: req.body.firstName }
    );
    console.log(result);
  }

  if (req.body.lastName.trim().length > 0) {
    let result = await User.updateMany(
      { email: req.body.email },
      { lastName: req.body.lastName }
    );
    console.log(result);
  }

  if (req.body.age.length > 0) {
    let result = await User.updateMany(
      { email: req.body.email },
      { age: req.body.age }
    );
    console.log(result);
  }

  if (req.body.password.trim().length > 0) {
    let result = await User.updateMany(
      { email: req.body.email },
      { password: req.body.password }
    );
    console.log(result);
  }

  if (req.body.mobileNo.trim().length > 0) {
    let result = await User.updateMany(
      { email: req.body.email },
      { mobileNo: req.body.mobileNo }
    );
    console.log(result);
  }

  if (req.file.path) {
    let result = await User.updateMany(
      { email: req.body.email },
      { profilePic: req.file.path }
    );
    console.log(result);
  }

  res.json({
    status: "success",
    msg: "Profile details updated successfully.",
  });
});

app.delete("/deleteProfile", upload.none(), async (req, res) => {
  try {
    let result = await User.deleteMany({ email: req.body.email });

    res.json({ status: "success", msg: "User deleted successfully" });
  } catch (err) {
    res.json({ status: "failure", msg: "Unable to delete user" });
  }
});

app.listen(process.env.port, () => {
  console.log("Listening to port 4567");
});

let connectToMDB = async () => {
  try {
    // await mongoose.connect(
    //   "mongodb+srv://manjunadhb:manjunadhb@cluster0.dth58ec.mongodb.net/Batch2312Students?retryWrites=true&w=majority&appName=Cluster0"
    // );
    await mongoose.connect(process.env.mdburl);
    console.log("Successfully connected to MDB");
  } catch (err) {
    console.log("Unable to connect to MDB");
  }
};

connectToMDB();
