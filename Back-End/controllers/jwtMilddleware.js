const jwt = require("jsonwebtoken");

const jwtMiddleware = {
  //verifyToken
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, account) => {
        if (err) {
          return res.status(403).json("Token is not valid");
        }
        req.account = account;
        next();
      });
    } else {
      res.status(401).json("You're not authenticated");
    }
  },

  adminAuth: (req, res, next) => {
    jwtMiddleware.verifyToken(req, res, () => {
      if (req.account.id == req.param.id || req.user.admin) {
        next();
      } else {
        res.status(403).json("You're not allowed to delete other");
      }
    });
  },
};

module.exports = jwtMiddleware;
