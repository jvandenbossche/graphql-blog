const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/blog';

// MongoDB connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: mongoose.Schema.Types.ObjectId,
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

// Define schema
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  type Query {
    getUser(id: ID!): User
    getUsers: [User]
    getPost(id: ID!): Post
    getPosts: [Post]
  }

  type Mutation {
    signUp(username: String!, password: String!): String
    logIn(username: String!, password: String!): String
    createPost(title: String!, content: String!): Post
  }
`;

// Define resolvers
const resolvers = {
  Query: {
    getUser: (_, { id }) => User.findById(id),
    getUsers: () => User.find(),
    getPost: (_, { id }) => Post.findById(id),
    getPosts: () => Post.find().populate('author'),
  },
  Mutation: {
    signUp: async (_, { username, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword });
      await user.save();
      return jwt.sign({ userId: user.id }, 'SECRET_KEY');
    },
    logIn: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user || !await bcrypt.compare(password, user.password)) {
        throw new Error('Invalid credentials');
      }
      return jwt.sign({ userId: user.id }, 'SECRET_KEY');
    },
    createPost: (_, { title, content }, { userId }) => {
      if (!userId) throw new Error('Not authenticated');
      const post = new Post({ title, content, author: userId });
      return post.save();
    }
  },
  Post: {
    author: (post) => User.findById(post.author),
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    if (token) {
      try {
        const { userId } = jwt.verify(token.replace('Bearer ', ''), 'SECRET_KEY');
        return { userId };
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
    return {};
  },
});


const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`Server running at http://localhost:4000${server.graphqlPath}`)
);

