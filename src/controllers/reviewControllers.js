const mongoose = require("mongoose");
const ArticleSchema = require("../models/articleModel");
const { updateArticle } = require("./articleControllers");

const Article = mongoose.model("Article", ArticleSchema);

const getReviews = (req, res) => {
  Article.findById(
    req.params.articleId,
    {
      reviews: 1,
      _id: 0,
    },
    (err, review) => {
      if (err) {
        res.send(err);
      }
      res.json(review);
    }
  );
};

const addNewReview = (req, res) => {
  let newReview = { ...req.body, createdAt: new Date() };
  //console.log(newReview);
  Article.findByIdAndUpdate(
    req.params.articleId,
    {
      $push: {
        reviews: newReview,
      },
    },
    { runValidators: true, new: true, useFindAndModify: false },
    (err, review) => {
      if (err) {
        res.send({ err });
      }
      res.json(review);
    }
  );
};

const getReviewById = async (req, res) => {
  let review = await Article.findById(req.params.articleId, {
    _id: 0,
    reviews: {
      $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
    },
  });
  if (review) {
    res.send(review.reviews[0]);
  } else {
    let error = new Error();
    error.httpStatus = 404;
    res.send(error);
  }
};

const updateReview = async (req, res) => {
  let { reviews } = await Article.findById(req.params.articleId, {
    _id: 0,
    reviews: {
      $elemMatch: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
    },
  });

  if (reviews && reviews.length > 0) {
    const reviewToReplace = { ...reviews[0].toObject(), ...req.body };
    const modifiedReview = await Article.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.params.articleId),
        "reviews._id": mongoose.Types.ObjectId(req.params.reviewId),
      },
      { $set: { "reviews.$": reviewToReplace } },
      {
        runValidators: true,
        new: true,
      }
    );
    res.status(200).send(modifiedReview);
  } else {
    let error = new Error();
    error.httpStatus = 404;
    res.send(error);
  }
};

const deleteReview = async (req, res) => {
  let modifiedReviews = await Article.findByIdAndUpdate(
    req.params.articleId,
    {
      $pull: {
        reviews: { _id: mongoose.Types.ObjectId(req.params.reviewId) },
      },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  );
  if (modifiedReviews) {
    res.status(200).send(modifiedReviews);
  } else {
    let error = new Error();
    error.httpStatus = 404;
    res.send(error);
  }
};
module.exports = {
  getReviews,
  addNewReview,
  getReviewById,
  updateReview,
  deleteReview,
};
