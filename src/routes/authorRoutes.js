const {
  getAuthors,
  addNewAuthor,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
  login,
  logout,
  googleAuthenticate,
} = require("../controllers/authorController");
const { authorize } = require("../controllers/authMiddleware");
const passport = require("passport");

const routes = (app) => {
  app.route("/authors").get(authorize, getAuthors);

  app
    .route("/authors/:authorId")
    .get(authorize, getAuthorById)
    .put(authorize, updateAuthor)
    .delete(authorize, deleteAuthor);

  app.route("/register").post(addNewAuthor);
  app.route("/login").post(login);
  app.route("/logout").post(logout);
  app
    .route("/googleLogin")
    .get(passport.authenticate("google", { scope: ["profile", "email"] }));
  app
    .route("/googleRedirect")
    .get(passport.authenticate("google"), googleAuthenticate);
};

module.exports = routes;
