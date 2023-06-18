import * as bcrypt from "bcrypt";
import { createJWT, verifyJWT } from "../lib/jwt.ts";
import { ObjectId } from "mongo";
import { Message, User } from "../types.ts";
import { UsersCollection, MessageCollection } from "../db/database.ts";

export const Mutation = {
  //Funciona
    createUser: async ( _: unknown, args: { username: string; password: string }, ctx: any): Promise<User> => {
        try{
          if(!args.username || !args.password) throw new Error('Username and password required')
          const user: User = await UsersCollection.findOne({username: args.username})
          if(user) throw new Error('User already exists')
          if(!ctx.lang) throw new Error('Language required')
    
          const hashedPassword = await bcrypt.hash(args.password)
          const _id = new ObjectId()
          const idioma = ctx.lang
    
          const newUser = await UsersCollection.insertOne({
            _id,
            username: args.username,
            password: hashedPassword,
            idioma: idioma,
            fechaCreacion: new Date(),
          })

          const userCreated = await UsersCollection.findOne({_id: newUser})
          return {
            ...userCreated,
            fechaCreacion: userCreated.fechaCreacion.toISOString(),
          }
        }catch(e){
          console.log(e)
          throw new Error(e);
        }
      }, 
      //Funciona
      login: async (_: unknown, args: { username: string; password: string }, ctx: any): Promise<string> => {
        try {
          if(!args.username || !args.password) throw new Error('Username and password required') 
          const user = await UsersCollection.findOne({username: args.username})
          if(!user) throw new Error('User not found')

          const validPassword = await bcrypt.compare(args.password, user.password)
          if(!validPassword) throw new Error('Invalid password')

          const idioma = ctx.lang
          const token = await createJWT({
            id: user._id.toString(),
            username: user.username,
            idioma: idioma,
            fechaCreacion: new Date(),
          }, Deno.env.get("JWT_SECRET")!)

          return token
          
        } catch (error) {
          console.log(error)
          throw new Error(error);
        }
      },
      //Funciona por cabecera pasamos solo el token 
      deleteUser: async (_: unknown,__: any ,ctx: any): Promise<User> => {
        try {
          const token = ctx.token
          const user = await verifyJWT(token, Deno.env.get("JWT_SECRET")!)
          if(!user) throw new Error('User not found')
          if(!ctx.token) throw new Error('Token required')

          await UsersCollection.deleteOne({_id: new ObjectId(user.id)})

          return {
            ...user,
          }
          
        } catch (error) {
          console.log(error)
          throw new Error(error);
        }
      },
      //Funciona por cabecera pasamos solo el token del emisor y el idioma obligatoriamente
      sendMessage: async (_: unknown, args: { receptor: string; mensaje: string }, ctx: any): Promise<Message> => {
        try {
          if(!ctx.token) throw new Error('Token required')
          if(!ctx.lang) throw new Error('Language required')
          if(!args.receptor || !args.mensaje) throw new Error('Receptor and message required')

          const receptor = await UsersCollection.findOne({_id: new ObjectId(args.receptor)})
          if(!receptor) throw new Error('Receptor not found')

          const usuarios = await UsersCollection.find({}).toArray()
    
          const verificar: User = await verifyJWT(ctx.token, Deno.env.get("JWT_SECRET")!) as User //Emisor
          const usuario = usuarios.find((user: User) => user.username === verificar.username)
          if(!usuario) throw new Error('Emisor not found')
          if(verificar.idioma !== receptor.idioma) throw new Error('You can not send messages of other lenguagues')
          if(verificar.idioma !== ctx.lang) throw new Error('You can not send messages of other lenguagues')

          const newMessage = await MessageCollection.insertOne({
            emisor: verificar.id,
            receptor: receptor._id,
            mensaje: args.mensaje,
            fechaCreacion: new Date(),
          })

          const messageCreated = await MessageCollection.findOne({ _id: newMessage })

          return { ...messageCreated}

        } catch (error) {
          console.log(error)
          throw new Error(error);
        }
      },



}