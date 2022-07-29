const { AuthenticationError } = require('apollo-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authErrMessage = '*** you must be logged in ***';

const resolvers = {
  Query: {
    getUser: async (_, { id }, { prisma, authed }) => {
      const currentUser = JSON.parse(authed)
      if (!currentUser) throw new AuthenticationError(authErrMessage)

      const findUser = await prisma.user.findUnique({
        where: {
          id: parseInt(id),
        }
      })

      if (!findUser) {
        throw new Error('no user found for id: %s', id);
      }

      return findUser;
    },
    getCurrentUser: async (_, __, { authed }) => {
      const currentUser = JSON.parse(authed)
      if (!currentUser) throw new AuthenticationError(authErrMessage)
      return currentUser;
    },
    getProfile: async (_, { email }, { prisma, authed }) => {
      const currentUser = JSON.parse(authed)
      if (!currentUser) throw new AuthenticationError(authErrMessage)

      const findUser = await prisma.user.findUnique({
        where: {
          email: email,
        }
      })
      console.log(findUser)
      if (!findUser) {
        throw new Error('no user found for email %s', email);
      }

      return findUser;
    },
  },
  Mutation: {
    createUser: async (_, { data }, { prisma }) => {
      try {
        const { username, email, bio, image, password } = data;
        const newUser = await prisma.user.create({
          data: {
            email: email,
            username: username,
            password: bcrypt.hashSync(password, 3),
            bio: bio,
            image: image,
          }
        })
        const token = jwt.sign(newUser, "supersecret")
        return {
          code: 200,
          success: true,
          message: 'created new user',
          user: newUser,
          token: token
        }

      } catch (err) {
        return {
          code: 400,
          success: false,
          message: err.message,
        };
      }
    },
    loginUser: async (_, { data }, { prisma }) => {
      try {
        const { email, password } = data;

        const theUser = await prisma.user.findUnique({
          where: {
            email: email,
          }
        })
        console.log(theUser)
        if (!theUser) {
          return {
            code: 400,
            success: false,
            message: "user is not existed",
          };
        };

        const isMatch = bcrypt.compareSync(password, theUser.password);
        if (!isMatch) {
          return {
            code: 400,
            success: false,
            message: "password is not correct",
          };
        };

        const token = jwt.sign(theUser, "supersecret")
        return {
          code: 200,
          success: true,
          message: 'login',
          user: theUser,
          token: token
        }

      } catch (err) {
        return {
          code: 400,
          success: false,
          message: err.message,
        };
      }
    }
  },
  Profile: {
    __resolveReference: async ({ email }, { prisma }) => {
      console.log(email)
      const findUser = await prisma.user.findUnique({
        where: {
          email: email,
        }
      })

      if (!findUser) {
        throw new Error('no user found for id: %s', id);
      }

      return findUser;
    }
  }
};

module.exports = resolvers;
