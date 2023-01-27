import { Comentario, Post, User } from "../types.ts";
import { ComentarioCollection, PostCollection, UsersCollection } from "../database/database.ts";
import * as bcrypt from "bcrypt";
import { ObjectId } from "mongo";
import { createJWT, verifyJWT } from "../lib/jwt.ts";
import { ComentarioSchema, PostSchema } from "../database/schema.ts";





export const Mutation = {
    register: async (_: unknown, args: { username: string; password: string, autor: boolean }): Promise<User> => {
        try {
            if(!args.username || !args.password) throw new Error('Username, Autor and password required')
            const user: User = await UsersCollection.findOne({username: args.username})
            if(user) throw new Error('User already exists')

            const hashedPassword = await bcrypt.hash(args.password)
            const _id = new ObjectId()

            if(args.autor){
                const newUser = await UsersCollection.insertOne({
                    _id,
                    username: args.username,
                    password: hashedPassword,
                    autor: args.autor,
                })

                const userCreated = await UsersCollection.findOne({_id: newUser})

                return {
                    ...userCreated
                }
            }else{
                const newUser = await UsersCollection.insertOne({
                    _id,
                    username: args.username,
                    password: hashedPassword,
                    autor: false,
                })

                const userCreated = await UsersCollection.findOne({_id: newUser})

                return {
                    ...userCreated
                }

            }

        } catch (e) {
            console.log(e)
            throw new Error(e);
        }
    },

    iniciarSesion: async (_: unknown, args: { username: string; password: string, autor: boolean }): Promise<String> => {
        try {
            if(!args.username || !args.password) throw new Error('Username and password required') 
            const user = await UsersCollection.findOne({username: args.username})
            if(!user) throw new Error('User not found')
            const validPassword = await bcrypt.compare(args.password, user.password)
            if(!validPassword) throw new Error('Invalid password')
            
            const token = await createJWT({
                id: user._id.toString(),
                username: user.username,
                autor: user.autor,
              }, Deno.env.get("JWT_SECRET")!)

              return token
            
        } catch (e) {
            console.log(e)
            throw new Error(e);
        }
    },
    //Funciona
    hacerPost:  async (_: unknown, args: { titulo: String, contenido: String, token: string}): Promise<Post> => {
        try {
            if(!args.titulo || !args.contenido || !args.token) throw new Error('Faltan campos')
            const user = await verifyJWT(
                args.token,
                Deno.env.get("JWT_SECRET")!
            )

            if(user === "The jwt's signature does not match the verification signature.") throw new Error('You must be logged in to create a post')
            if(user.autor === false) throw new Error ("You must be a author to create a post")

            const post = await PostCollection.insertOne({
                titulo: args.titulo,
                contenido: args.contenido,
                autor: user.username,
                fecha: new Date()
            })

            const postCreated = await PostCollection.findOne({_id: post})
            return {...postCreated}
        } catch (e) {
            console.log(e)
            throw new Error(e);
        }
    },

    //Funciona
    modificarPost: async (_: unknown, args: {id: String, tituloNuevo: String, contenidoNuevo: String, token: string}): Promise<PostSchema> => {
        try {
            if(!args.id || !args.token) throw new Error('id and token required')
            if(!args.tituloNuevo && !args.contenidoNuevo) throw new Error("Tienes que seleccionar algo que modificar")

            const {id} = args
            const _id = new ObjectId(id)
            const post = await PostCollection.findOne({_id})
            if(!post) throw new Error("Post no existente")

            const user = await verifyJWT(
                args.token,
                Deno.env.get("JWT_SECRET")!
            )

            if(user === "The jwt's signature does not match the verification signature.") throw new Error('You must be logged in to create a post')
            if(user.autor === false) throw new Error ("You must be a author to modify a post")

            if(args.contenidoNuevo){
                const postModify = await PostCollection.updateOne(
                    { _id: _id },
                    { $set: { contenido: args.contenidoNuevo} }
                )

                return (await PostCollection.findOne({_id})) as PostSchema

            }else if(args.contenidoNuevo && args.tituloNuevo){
                const postModify = await PostCollection.updateOne(
                    { _id: _id },
                    { $set: { contenido: args.contenidoNuevo, titulo: args.tituloNuevo}}
                )

                return (await PostCollection.findOne({_id})) as PostSchema

            }else{
                const postModify = await PostCollection.updateOne(
                    { _id: _id },
                    { $set: { titulo: args.tituloNuevo} }
                )
                
                return (await PostCollection.findOne({_id})) as PostSchema

            }            
        } catch (e) {
            console.log(e)
            throw new Error(e);
        }
    },

    //Funciona
    borrarPost: async (_: unknown, args: {id: String, token: string}): Promise<Post> => {
        try {
            if(!args.id || !args.token) throw new Error('id and token required')
            const user = await verifyJWT(
                args.token,
                Deno.env.get("JWT_SECRET")!
            )

            if(user === "The jwt's signature does not match the verification signature.") throw new Error('You must be logged in to create a post')
            if(user.autor === false) throw new Error ("You must be a author to delete a post")
            
            const {id} = args
            const _id = new ObjectId(id)
            const findPost = await PostCollection.findOne({_id})

            if(!findPost) throw new Error('Post not found')

            await PostCollection.deleteOne({_id})

            return {...findPost}
        } catch (e) {
            console.log(e)
            throw new Error(e);
        }
    },

    hacerComentario: async (_: unknown, args: { post: string,informacion: string, token: string}): Promise<Comentario> => {
        try {
            if(!args.informacion || !args.token) throw new Error('comentario and token required')
            const user = await verifyJWT(
                args.token,
                Deno.env.get("JWT_SECRET")!
              )

            const usuarios = await UsersCollection.find({}).toArray()

            if(user === "The jwt's signature does not match the verification signature.") throw new Error('You must be logged in to create a comment')

            const {post} = args
            const _id = new ObjectId(post)

            const Post = await PostCollection.findOne({_id})
            if(!Post) throw new Error("Post no existente")

            const comentario = await ComentarioCollection.insertOne({
                informacion: args.informacion,
                autor: user.id,
                fecha: new Date()
            })

            await PostCollection.updateOne(
                {_id: _id},
                {$set: {comentario: comentario}}
            )

            const comentarioCreado = await ComentarioCollection.findOne({_id: comentario})
            return {...comentarioCreado}

        } catch (e) {
            console.log(e)
            throw new Error(e);
        }
    },

    modificarComentario: async (_: unknown, args: { id: string, informacionNueva: string, token: string}): Promise<ComentarioSchema> => {
        try {
            if(!args.id || !args.informacionNueva || !args.token) throw new Error('Faltan campos')
            const { id} = args
            const _id = new ObjectId(id)

            const Comentario = await ComentarioCollection.findOne({_id})
            if(!Comentario) throw new Error('Comentario no existente')

            const user = await verifyJWT(
                args.token,
                Deno.env.get("JWT_SECRET")!
            )

            if(user === "The jwt's signature does not match the verification signature.") throw new Error('You must be logged in to create a post')
            if(user.autor === false) throw new Error ("You must be a author to delete a post")

            await ComentarioCollection.updateOne(
                {_id: _id},
                {$set: {informacion: args.informacionNueva}}
            )

            return (await ComentarioCollection.findOne({_id})) as ComentarioSchema
        } catch (e) {
            console.log(e)
            throw new Error(e);
        }
    },

    borrarComentario: async (_: unknown, args: { post: string, id: string, token: string}): Promise<Comentario> => {
        try {
            if(!args.id || !args.token) throw new Error('id and token required')
            const user = await verifyJWT(
                args.token,
                Deno.env.get("JWT_SECRET")!
            )

            if(user === "The jwt's signature does not match the verification signature.") throw new Error('You must be logged in to create a post')
            if(user.autor === false) throw new Error ("You must be a author to delete a post")
            
            const {id} = args
            const _id = new ObjectId(id)
            const findComment = await ComentarioCollection.findOne({_id})

            if(!findComment) throw new Error('Comment not found')

            await ComentarioCollection.deleteOne({_id})

            const {post} = args
            const post_id = new ObjectId(post)
            const findedPost = await PostCollection.findOne({_id: post_id})
            if(!findedPost) throw new Error('Post not found')

            await PostCollection.updateOne(
                {_id: post_id},
                {$pull: {comentario: _id}}
            )

            return {...findComment}
            
        } catch (e) {
            console.log(e)
            throw new Error(e);
        }
    }
}


