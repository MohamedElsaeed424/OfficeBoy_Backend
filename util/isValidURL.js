const URL = require("url").URL;

const isValidUrl = (url) => {
  try {
    let urlCheck = new URL(url);
    if (!urlCheck) {
      res.status(404).json({ message: "Sorry, URL Path is not valid" });
      const error = new Error("Sorry, URL Path is not valid");
      error.statusCode = 404;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.isValidUrl = isValidUrl;
