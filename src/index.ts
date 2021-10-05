import 'reflect-metadata'
import express from 'express'
import dotenv from 'dotenv'
import {createConnection} from 'typeorm'
import { User } from './models/User'
import { Post } from './models/Post'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginLandingPageGraphQLPlayground, Context } from 'apollo-server-core'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { UserResolver } from './resolvers/user'
import mongoose from 'mongoose'

dotenv.config()

const main = async () => {
    await createConnection({
        type: 'postgres',
        database:'reddit',
        username:process.env.DB_USERNAME_DEV,
        password:process.env.DB_PASSWORD_DEV,
        logging:false,
        synchronize:true,
        entities: [
            User,
            Post
        ]
    })

    const app = express()

    //Session-cookie
    await mongoose.connect(`${process.env.DB_MONGO}`,{
    })


    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers:[HelloResolver,UserResolver],
            validate:false,
        }),
        context: ({req,res}) : Context => ({req,res}),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground]
        
    })

    await apolloServer.start()

    apolloServer.applyMiddleware({app,cors:false})

    const PORT = process.env.PORT || 1996

    app.listen(PORT, () => console.log(`Server started on ${PORT}. GraphQL server ${PORT}${apolloServer.graphqlPath}`))
}

main().catch(error => console.log('error',error))