import { MessageCollection, UsersCollection } from "../db/database.ts";
import { verifyJWT } from "../lib/jwt.ts";
import { Message, User } from "../types.ts";



export const Query = {
    //Funciona por cabecera pasamos solo el token de usuario que quiera obtener todos los mensajes
    getMessages: async (_: unknown, args: { page: number, perPage: number }, ctx: any): Promise<Message> => {
        try {
            if(!ctx.token) throw new Error('Token required')
            const token = ctx.token
            const user = await verifyJWT(token, Deno.env.get("JWT_SECRET")!) as User
            if(!user) throw new Error('User not found')
            if(args.perPage < 10 || args.perPage > 200) throw new Error('PerPage must be greater than 10 and less than 200')
            const usuarios = await UsersCollection.find({}).toArray()
            if(args.page < 0) throw new Error('Page must be greater than 0')
            const verificar = usuarios.find((usuario: User) => usuario.username === user.username)
            if(verificar.username !== user.username) throw new Error('User not found')

            const messages = await MessageCollection.find().skip(Number(args.page) * Number(args.perPage)).limit(args.perPage).toArray()
            if(!messages) throw new Error('No messages found')
            return messages.map((message: Message) => ({...message}))

            
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }
}