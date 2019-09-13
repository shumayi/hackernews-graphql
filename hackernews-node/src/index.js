const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

const resolvers = {
  Query: {
    info: () => 'This is the API of a Hackernews Clone',
    feed: () => (root, args, context, info) => {
      return context.prisma.links()
    },
    link: (root, args) => links.find(x => x.id === args.id),
  },

  Mutation: {
    post: (root, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description,
      })
    },
    updateLink: (root, args) => {
      const link = links.find(x => x.id === args.id)

      link.url = args.url
      link.description = args.description

      return link
    },
    deleteLink: (root, args) => {
      const link = links.find(x => x.id === args.id)
      links = links.filter(x => x.id !== args.id)
      return link
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
