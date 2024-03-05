const jwt = require("jsonwebtoken");
// const verifySession = (req, res, next) => {
// // Verify if the user is logged in
//   if (req.session.usuario) next();
//   else res.status(401).send("Unauthorized");
// };

const verifySession = async (req, res, next) => {
  // Verify if the user is logged in
  const token = req.headers.authorization;

  if (!token) return res.status(401).send("Unauthorized");
  jwt.verify(token, process.env.SECRET, async (err, decoded) => {
    if (err) return res.status(403).send("Authorization error");
    req.usuario = decoded;
    next();
  });
};

module.exports = { verifySession };
