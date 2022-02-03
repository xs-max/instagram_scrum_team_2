const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const { cloudinary } = require('../utils/cloudinary');

exports.addPost = catchAsync(async (req, res, next) => {
    const fileStr = req.body.image;
    // console.log(fileStr);
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "dev_setups",
    });
    const post = await Post.create({
        image: uploadResponse.url,
        caption: req.body.caption,
        user: req.user._id

    });
    res.status(201).json({
      status: "success",
      data: {
        post
      },
    });
});

exports.likePost = catchAsync(async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(
      req.body.post,
      { likes: likes.push(req.body.likes) },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
})

exports.getFeeds = catchAsync( async (req, res, next) => {
    const posts = await Post.find().populate({path: "user"});
    const feeds = posts.filter( (post) => post.user.followers.include(req.user._id) );

    res.status(200).json({
      status: "success",
      data: {
        feeds,
      },
    });
})