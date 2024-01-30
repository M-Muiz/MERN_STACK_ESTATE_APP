import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import errorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    console.log(req.body);
    const password = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password });
    await user.save();
    res.status(200).send({ message: "Register Successfully" });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(401, "Enter a Valid emaiil address"));
    }
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return next(errorHandler(401, "Password is incorrect"));
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = user._doc;
    res.cookie("access_token", token)
      .status(200)
      .json({ rest, token });
  } catch (err) {
    next(err);
  }
});

router.post("/google", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
  // try {
  //   const user = await User.findOne({ email: req.body.email });
  //   if (user) {
  //     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  //     const { password: pass, ...rest } = user._doc;
  //     res
  //       .cookie("access_token", token, { httpOnly: true })
  //       .status(200)
  //       .json(rest);
  //   } else {
  //     const generatePassword =
  //       Math.random().toString(36).slice(-8) +
  //       Math.random().toString(36).slice(-8);
  //     const hashPassword = bcrypt.hashSync(generatePassword, 10);
  //     const newUser = new User({
  //       username:
  //         req.body.name.split(" ").join("").toLowerCase() +
  //         Math.random().toString(36).slice(-4),
  //       email: req.body.email,
  //       password: hashPassword,
  //       avatar: req.body.photo,
  //     });
  //     await newUser.save();
  //     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
  //     const { password: pass, ...rest } = newUser._doc;
  //     res.cookie("access_token", token, { httpOnly: true })
  //       .status(200)
  //       .json(rest);
  //   }
  // } catch (error) {
  //   next(error);
  // }
});

router.post("/update/:id", verifyToken, async (req, res, next) => {
  if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10)
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      }
    }, { new: true })

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);



  } catch (error) {
    next(error)
  }
});

router.delete("/delete/:id", verifyToken, async (req, res, next) => {
  if (req.user.id !== req.params.id) return next(errorHandler(409, "You can delete your account only!"));
  try {
    await User.findByIdAndDelete(req.params.id)
    res.clearCookie('access_token');
    res.status(200).json("User has been deleted Successfully !")
  } catch (error) {
    next(error.message)
  }
});

router.get("/logout", (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).send({ message: "LogOut Successfully" });
  } catch (error) {
    next(error)
  }
});


export default router;
