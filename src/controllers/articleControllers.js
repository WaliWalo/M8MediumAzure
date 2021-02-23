const mongoose = require("mongoose");
const ArticleSchema = require("../models/articleModel");
const q2m = require("query-to-mongo");
const Article = mongoose.model("Article", ArticleSchema);

const getArticles = async (req, res) => {
  const query = q2m(req.query);
  const total = await Article.countDocuments(query.criteria);
  const articles = await Article.find(query.criteria, query.options.fields)
    .skip(query.options.skip)
    .limit(query.options.limit)
    .sort(query.options.sort)
    .populate("author");
  res.send({ links: query.links("/articles", total), articles });
};

const addNewArticle = (req, res) => {
  let newArticle = new Article(req.body);
  newArticle.save((err, article) => {
    if (err) {
      res.send(err);
    }
    res.json(article);
  });
};

const getArticleById = async (req, res, next) => {
  const article = await Article.findById(req.params.articleId).populate(
    "author"
  );
  console.log(article);
  if (article) {
    res.status(200).send(article);
  } else {
    let error = new Error();
    error.httpStatusCode = 404;
    next(error);
  }
};

const updateArticle = (req, res) => {
  Article.findOneAndUpdate(
    { _id: req.params.articleId },
    req.body,
    { new: true, useFindAndModify: false },
    (err, article) => {
      if (err) {
        res.send(err);
      }
      res.json(article);
    }
  );
};

const deleteArticle = (req, res) => {
  Article.findOneAndDelete({ _id: req.params.articleId }, (err, article) => {
    if (err) {
      res.send(err);
    }
    res.json(article);
  });
};

const updateClap = async (req, res, next) => {
  const respond = await Article.addClap(req.body, req.params.articleId);
  res.send(respond);
};

const removeClap = async (req, res) => {
  const respond = await Article.removeClap(req.body, req.params.articleId);
  res.send(respond);
};

const calculateClap = async (req, res) => {
  const respond = await Article.countClap(req.params.articleId);
  res.json(respond);
};

module.exports = {
  getArticles,
  addNewArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  updateClap,
  removeClap,
  calculateClap,
};
