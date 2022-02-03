const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "A user must have a name"],
      minlength: [5, "Full name must be more than five(5) characters"],
    },
    userName: {
      type: String,
      required: [true, "A user must have a name"],
      minlength: [4, "Full name must be more than five(5) characters"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "A user must have an email"],
      unique: true,
      validate: [validator.isEmail, "Enter a valid email format"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be more than five (5) characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // Only works on save and create
        validator: function (el) {
          return this.password === el;
        },
        message: "Passwords don't match",
      },
    },
    photo: {
      type: String,
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
userSchema.virtual('transactions', {
    ref: 'Transaction',
    foreignField: 'user',
    localField: '_id'
});

userSchema.pre("save", function (next) {
    // checking if password was modified or there is a new document
  if (!this.isModified("password") || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^save/, async function(next) {
  // Only run this function if password was modified
  if (!this.isModified("password")) return next();
  //Hash password
  this.password = await bcrypt.hash(this.password, 12);
  // delete passwordConfirm
  this.passwordConfirm = undefined;
  
  
  next();
})



userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // False means not changed
  return false;
};

module.exports = mongoose.model("user", userSchema);