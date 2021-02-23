const mongoose = require("mongoose");
const AuthorSchema = require("../models/authorModel");
const Author = mongoose.model("Author", AuthorSchema);
const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
  {
    headLine: { type: String, required: true },
    subHead: { type: String },
    content: { type: String, required: true },
    category: {
      name: { type: String, required: true },
      img: { type: String, required: true },
    },
    author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    cover: { type: String },
    reviews: [
      {
        text: {
          type: String,
          required: true,
        },
      },
      {
        user: {
          type: String,
          required: false,
        },
      },
      {
        date: {
          type: Date,
        },
      },
    ],
    claps: [{ userId: { type: String, require: true } }],
  },
  { timestamps: true }
);

ArticleSchema.static("addClap", async function (userId, articleId) {
  const article = await ArticleModel.findOneAndUpdate(
    { _id: articleId },
    { $addToSet: { claps: userId } },
    { new: true, useFindAndModify: false }
  );
  return article;
});

ArticleSchema.static("removeClap", async function (user, articleId) {
  const article = await ArticleModel.findOneAndUpdate(
    { _id: articleId },
    { $pull: { claps: { userId: user.userId } } },
    { new: true, useFindAndModify: false }
  );
  return article;
});

ArticleSchema.static("countClap", async function (articleId) {
  const article = await ArticleModel.findById(articleId);
  return article.claps.length;
});

const ArticleModel = mongoose.model("Article", ArticleSchema);
module.exports = ArticleSchema;
