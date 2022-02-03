const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.unFollow = catchAsync(async (req, res, next) => {

    if (!req.user.following.includes(req.params.id)) return next(new AppError("You don't follow this user"), 400);

    const follow = await User.findByIdAndUpdate(req.params.id, {$pull: {followers:  req.user._id}}, {
      new: true,
      runValidators: true,
    });

    console.log(follow)

    const user = await User.findByIdAndUpdate(req.user._id, {$pull: {following: follow._id}}, {
      new: true,
      runValidators: true,
    })


    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });

})

exports.follow = catchAsync(async (req, res, next) => {

    if (req.user.following.includes(req.params.id)) return next(new AppError("You already follow this user"), 400);

    const follow = await User.findByIdAndUpdate(req.params.id, {$push: {followers: req.user._id}}, {
      new: true,
      runValidators: true,
    });

    console.log(follow)
    

    const user = await User.findByIdAndUpdate(req.user._id, {$push: {following: follow._id}}, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });

})

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      data: {
        users
      },
    });
})