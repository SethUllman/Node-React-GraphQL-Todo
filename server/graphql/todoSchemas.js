var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLBoolean = require('graphql').GraphQLBoolean;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var TodoModel = require('../models/Todo');

const todoType = new GraphQLObjectType({
  name: 'todo',
  fields: function () {
    return {
      _id: {
        type: GraphQLString
      },
      title: {
        type: GraphQLString
      },
      description: {
        type: GraphQLString
      },
      completed: {
        type: GraphQLBoolean
      },
      updated_date: {
        type: GraphQLDate
      }
    }
  }
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      todos: {
        type: new GraphQLList(todoType),
        resolve: function () {
          const todos = TodoModel.find().exec()
          if (!todos) {
            throw new Error('Error')
          }
          return todos
        }
      },
      todo: {
        type: todoType,
        args: {
          id: {
            name: '_id',
            type: GraphQLString
          }
        },
        resolve: function (root, params) {
          const todoDetails = TodoModel.findById(params.id).exec()
          if (!todoDetails) {
            throw new Error('Error')
          }
          return todoDetails
        }
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
    return {
      addTodo: {
        type: todoType,
        args: {
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          description: {
            type: new GraphQLNonNull(GraphQLString)
          },
          completed: {
            type: new GraphQLNonNull(GraphQLBoolean)
          }
        },
        resolve: function (root, params) {
          const todoModel = new TodoModel(params);
          const newTodo = todoModel.save();
          if (!newTodo) {
            throw new Error('Error');
          }
          return newTodo
        }
      },
      updateTodo: {
        type: todoType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          },
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          description: {
            type: new GraphQLNonNull(GraphQLString)
          },
          completed: {
            type: new GraphQLNonNull(GraphQLBoolean)
          }
        },
        resolve(root, params) {
          return TodoModel.findByIdAndUpdate(params.id, { title: params.title, description: params.description, completed: params.completed, updated_date: new Date() }, function (err) {
            if (err) return next(err);
          });
        }
      },
      removeTodo: {
        type: todoType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          const remTodo = TodoModel.findByIdAndRemove(params.id).exec();
          if (!remTodo) {
            throw new Error('Error')
          }
          return remTodo;
        }
      }
    }
  }
});

module.exports = new GraphQLSchema({query: queryType, mutation: mutation});