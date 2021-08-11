const express = require('express');
const app= express();
const {graphqlHTTP} = require('express-graphql')
var { graphql, buildSchema,GraphQLSchema,GraphQLObjectType,GraphQLString,GraphQLList, GraphQLInt, GraphQLNonNull} = require('graphql');

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]


const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents a author of a book',
    fields: () => ({
      id: { type: GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLNonNull(GraphQLString) },
      books : {
        type: new GraphQLList(BookType) ,
        resolve : (author) =>{
            
            return books.filter(book => author.id === book.authorId)
        }
     
      }
    })
  })

const BookType = new GraphQLObjectType({
    name : "Books",
    description : "This represent the number of books written by an author",
    fields : ()=>({
        id : {type : GraphQLNonNull(GraphQLInt)},
        name : {type : GraphQLNonNull(GraphQLString)},
        authorId : {type : GraphQLNonNull(GraphQLInt)},
        author : {
            type : AuthorType ,
            resolve : (book) =>{
                return authors.find(author => author.id === book.authorId)
            }

        }
    })
})


const RootQueryType = new GraphQLObjectType({
    name : "RootQueryLevel",
    description : "Root Query Type",
    fields : ()=>({
        book : {
            type  :BookType ,
            description : "A single bookBooks ",
            args : {
                id : { type : GraphQLNonNull(GraphQLInt)}
            },

            resolve : (parent,args)=> books
            
        },
        books : {
            type  :new GraphQLList(BookType) ,
            description : "List of Books ",
            resolve : ()=> books
            
        },
        authors : {
            type  :new GraphQLList(AuthorType) ,
            description : "List of Authors",
            resolve : ()=> authors
            
        }
    })
})



const  schema = new GraphQLSchema({
    query : RootQueryType
})
const  root = { hello: () => 'Hello world!' };

app.use('/graphql', graphqlHTTP({
    schema: schema,
  rootValue: root,
  graphiql: true
}));


app.listen(3000,()=>{
    console.log("Server is set to listen at port 3000");
})