import { ComentarioCollection, PostCollection } from "../database/database.ts";
import { verifyJWT } from "../lib/jwt.ts";
import { Comentario, Post, User } from "../types.ts";



export const Query = {
    getUser: async (_: unknown, args: { token: string}): Promise<User> => {
        try {
            try {
                const user: User = (await verifyJWT(
                  args.token,
                  Deno.env.get("JWT_SECRET")!
                )) as User;
                return user;
              } catch (e) {
                throw new Error(e);
              }
            

            
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    },

    leerPost: async (_: unknown): Promise<Post | null> => {
        try {
            const post = await PostCollection.find({}).toArray()
            if(post) return post.map((concesionario: Post) => ({...concesionario}));
            else return null;

        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    },

    leerComentario: async (_: unknown): Promise<Comentario> => {
        try {
            const comentario = await ComentarioCollection.find({}).toArray()
            if(!comentario) throw new Error('No post found')
            return comentario.map((message: Comentario) => ({...message}))

        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    },



}