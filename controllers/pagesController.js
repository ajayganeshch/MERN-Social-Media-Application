const handleAsyncFunction = require("../utils/handleAsyncFunction");
const UserModel = require("../models/userModel");
const AppError = require("../utils/appError");
const PostModel = require("./../models/postsModel");
const apiFeatures = require("./../utils/apiFeatures");

exports.getMainPage = (req, res, next) =>
  handleAsyncFunction(
    async (req, res, next) => {
      let posts = await PostModel.find();

      //TODO Filter, Like in feed the currenct user posts should not be there
      res.status(200).render("posts", { title: "AG", posts });
    },
    req,
    res,
    next
  );

exports.getPost = (req, res, next) =>
  handleAsyncFunction(
    async (req, res, next) => {
      let post = await PostModel.findById(req.params.id).populate({
        path: "interactions",
        select: "comment user",
      });

      if (!post) return next(new AppError("No Post Found", 404));
      // res.json({
      //   post,
      // });

      res.status(200).render("post", { post, title: "Post" });
    },
    req,
    res,
    next
  );

exports.getLoginForn = (req, res) => {
  res.status(200).render("login", {
    title: "Login into your account",
  });
};

exports.account = (req, res) => {
  res
    .status(200)
    .render("account", { data: req.user, title: "Account Details" });
};

exports.updateUserData = (req, res, next) =>
  handleAsyncFunction(
    async () => {
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.user.id,
        {
          name: req.body.name,
          email: req.body.email,
          userName: req.body.username,
          about: req.body.about,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).render("account", {
        title: "Account Details",
        data: updatedUser,
      });
    },
    req,
    res,
    next
  );

exports.getLatestPosts = (req, res, next) =>
  handleAsyncFunction(
    async (req, res, next) => {
      let posts = await PostModel.find().sort("-dateUploaded");
      // console.log(posts);
      // res.json({
      //   posts,
      // });

      res.status(200).render("posts", {
        posts,
        title: "Posts",
      });
    },
    req,
    res,
    next
  );

exports.createPost = (req, res) => {
  res.status(200).render("createPost", {
    title: "Create New Post",
  });
};