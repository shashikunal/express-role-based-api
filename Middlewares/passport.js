const User = require("../Models/Users");
const { SECRET } = require("../Config");
const { Strategy, ExtractJwt } = require("passport-jwt");

const Options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};
module.exports = (passport) => {
  passport.use(
    new Strategy(Options, async (payload, done) => {
      await User.findById(payload.user_id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => {
          return done(null, false);
        });
    })
  );
};
