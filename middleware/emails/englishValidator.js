module.exports = (req, res, next) => {
  const nonEnglishRegex = /[^\x00-\x7F]/;

  if (nonEnglishRegex.test(req.body.email)) {
    return res
      .status(400)
      .json({ error: "Email contains non-English characters." });
  } else {
    next();
  }
};
