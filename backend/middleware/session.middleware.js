const verifySession = (req, res, next) => {
// Verify if the user is logged in
  if (req.session.user) next();
  else res.status(401).send("Unauthorized");
};

module.exports = { verifySession };
