const jwt = require('jsonwebtoken');

const auth = {
    authed: (req) => {
        const header = req.headers.authorization || '';
        const token = header.replace('Token ', '');

        try {
          if (token) {
              const authed = jwt.verify(token, 'supersecret')
              return authed
          }
          return null
        } catch (err) {
          return null
        }
    }
};


module.exports = { auth }