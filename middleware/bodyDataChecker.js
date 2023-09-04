// check if no body sent

module.exports = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "No request body sent." });
  }
  next();
};
