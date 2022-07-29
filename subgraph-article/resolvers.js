const { AuthenticationError } = require('apollo-server');
const authErrMessage = '*** you must be logged in ***';

const resolvers = {
  Query: {
    getArticle: async (_, { slug }, { prisma, authed }) => {
      if (!authed) throw new AuthenticationError(authErrMessage)

      const findArticle = await prisma.article.findUnique({
        where: {
          slug: slug
        }
      })
      if (!findArticle) {
        throw new Error('no article found for this slug');
      }

      return findArticle;
    }
  },
  Mutation: {
    createArticle: async (_, { data }, { prisma, authed }) => {
      const currentUser = JSON.parse(authed)
      if (!currentUser) throw new AuthenticationError(authErrMessage)

      const { title, description, body, tags } = data;
      const slug = title.replace(" ", "-").toLowerCase();
      const tagString = tags.join(",")
      const author = currentUser.email

      const newArticle = await prisma.article.create({
        data: {
          author: author,
          slug: slug,
          title: title,
          body: body,
          description: description,
          tags: tagString,
        }
      })
      newArticle.tags = tags;
      console.log(newArticle);

      return newArticle
    }
  },
  Profile: {
    __resolveReference: (profile) => {
      return profile
    }
  },
  Article: {
    author: ({ author }) => {
      return { email: author };
    }
  }
}

module.exports = resolvers;
