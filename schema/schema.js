import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
} from "graphql";

import {
  getSingleGame,
  getFilteredGames,
  insertMultipleGames,
  updateSingleGame,
  deleteMultipleGames,
} from "../services/gameServices.js";
import {
  getSingleAuthor,
  getFilteredAuthors,
} from "../services/authorServices.js";
import {
  getSingleReview,
  getFilteredReviews,
} from "../services/reviewServices.js";

const GameType = new GraphQLObjectType({
  name: "Game",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    title: {
      type: GraphQLString,
    },
    platform: {
      type: GraphQLList(GraphQLString),
    },
    reviews: {
      type: GraphQLList(ReviewType),
      resolve: async (parent, _) => {
        const filter = {
          game_id: parent.id,
        };
        try {
          return await getFilteredReviews(filter);
        } catch (error) {
          console.log(`Error while fetching Reviews. ${error.message}`);
          return null;
        }
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    verified: {
      type: GraphQLBoolean,
    },
    reviews: {
      type: GraphQLList(ReviewType),
      resolve: async (parent, _) => {
        const filter = {
          author_id: parent.id,
        };
        try {
          return await getFilteredReviews(filter);
        } catch (error) {
          console.log(`Error while fetching Reviews. ${error.message}`);
          return null;
        }
      },
    },
  }),
});

const ReviewType = new GraphQLObjectType({
  name: "Review",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    rating: {
      type: GraphQLInt,
    },
    content: {
      type: GraphQLString,
    },
    author_id: {
      type: GraphQLID,
    },
    game_id: {
      type: GraphQLID,
    },
    game: {
      type: GameType,
      resolve: async (parent, _) => {
        try {
          return await getSingleGame(parent.game_id);
        } catch (error) {
          console.log(`Error while fetching Game By ID. ${error.message}`);
          return null;
        }
      },
    },
    author: {
      type: AuthorType,
      resolve: async (parent, _) => {
        try {
          return await getSingleAuthor(parent.author_id);
        } catch (error) {
          console.log(`Error while fetching Author By ID. ${error.message}`);
          return null;
        }
      },
    },
  }),
});

const GameInsertType = new GraphQLInputObjectType({
  name: "GameInsertType",
  fields: () => ({
    title: { type: GraphQLNonNull(GraphQLString) },
    platform: { type: GraphQLNonNull(GraphQLList(GraphQLString)) },
  }),
});

const GameUpdateType = new GraphQLInputObjectType({
  name: "GameUpdateType",
  fields: () => ({
    title: { type: GraphQLString },
    platform: { type: GraphQLList(GraphQLString) },
  }),
});

// Query & Mutations here after

const rootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    game: {
      type: GameType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: async (_, args) => {
        try {
          const game = await getSingleGame(args.id);
          if (game) return game;
          else return null;
        } catch (error) {
          console.log(`Error while fetching Reviews. ${error.message}`);
          return null;
        }
      },
    },
    games: {
      type: GraphQLList(GameType),
      resolve: async (_, args) => {
        const filter = args.filter;
        try {
          const games = await getFilteredGames(filter);
          if (games.length > 0) return games;
          else return nulls;
        } catch (error) {
          console.log(`Error while fetching Reviews. ${error.message}`);
          return null;
        }
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve: async (_, args) => {
        try {
          const author = await getSingleAuthor(args.id);
          if (author) return author;
          else return null;
        } catch (error) {
          console.log(`Error while fetching Reviews. ${error.message}`);
          return null;
        }
      },
    },
    authors: {
      type: GraphQLList(AuthorType),
      resolve: async (_, args) => {
        const filter = args.filter;
        try {
          const authors = await getFilteredAuthors(filter);
          if (authors.length > 0) return authors;
          else return null;
        } catch (error) {
          console.log(`Error while fetching Reviews. ${error.message}`);
          return null;
        }
      },
    },
    review: {
      type: ReviewType,
      args: { id: { type: GraphQLID } },
      resolve: async (_, args) => {
        try {
          const review = await getSingleReview(args.id);
          if (review) return review;
          else return null;
        } catch (error) {
          console.log(`Error while fetching Reviews. ${error.message}`);
          return null;
        }
      },
    },
    reviews: {
      type: GraphQLList(ReviewType),
      resolve: async (_, args) => {
        const filter = args.filter;
        // return db.reviews;
        try {
          const reviews = await getFilteredReviews(filter);
          if (reviews.length > 0) return reviews;
          else return null;
        } catch (error) {
          console.log(`Error while fetching Reviews. ${error.message}`);
          return null;
        }
      },
    },
  },
});

const myMutations = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addGames: {
      type: GraphQLList(GameType),
      args: {
        games: {
          type: GraphQLList(GameInsertType),
        },
      },
      resolve: async (_, args) => {
        let games = args.games;
        const resp = await insertMultipleGames(games);
        if (resp.length > 0) return games;
        else return null;
      },
    },
    updateGame: {
      type: GameType,
      args: {
        id: {
          type: GraphQLString,
        },
        game: {
          type: GameUpdateType,
        },
      },
      resolve: async (_, args) => {
        const id = args?.id || "";
        const game = args?.game || {};
        const resp = await updateSingleGame(id, game);
        if (resp) return game;
        else return null;
      },
    },
    deleteGames: {
      type: GraphQLList(GameType),
      args: {
        ids: { type: GraphQLNonNull(GraphQLList(GraphQLString)) },
      },
      resolve: async (_, args) => {
        let ids = args?.ids || [];
        const resp = await deleteMultipleGames(ids);
        if (resp) return resp;
        else return [];
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: myMutations,
});

export default schema;
