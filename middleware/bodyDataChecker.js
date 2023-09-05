// check if no body sent

module.exports = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid JSON data. Check your body entries" });
  }
  next();
};
