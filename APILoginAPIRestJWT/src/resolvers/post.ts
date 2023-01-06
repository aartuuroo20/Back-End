import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { Book, User } from "../types.ts";
import { BooksCollection, UsersCollection } from "../db/database.ts";
import * as bcrypt from "bcrypt";
import { ObjectId } from "mongo";
import { BookSchema, UserSchema } from "../db/schema.ts";
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { Header } from "jwt";
import { generateKey, verifyJWT } from "../lib/jwt.ts";




type SignInUsersContext = RouterContext<
"/SignIn",
Record<string | number, string | undefined>,
Record<string, any>
>;

type LogInUsersContext = RouterContext<
"/LogIn",
Record<string | number, string | undefined>,
Record<string, any>
>;

type PostBookContext = RouterContext<
"/Book",
Record<string | number, string | undefined>,
Record<string, any>
>;


  
  const header: Header = {
    alg: "HS256",
  };
  

export const SignIn = async (context: SignInUsersContext) => {
    try {
        const result = context.request.body({type: "json"})
        const value = await result.value;
        if(!value?.username || !value?.email || !value?.password){
            context.response.status = 404
            context.response.body = {message: "Faltan campos"}
            return
        }

        const userExist = await UsersCollection.findOne({email: value.email})
        if(userExist){
            context.response.status = 400
            context.response.body = {message: "Usuarios con ese email existe"}
            return
        }

        const hashedPassword = await bcrypt.hash(value.password)
        const _id1 = new ObjectId()

        const key = Deno.env.get("JWT_SECRET")
        const cryptoKey: CryptoKey = await generateKey(key!)

        const token = await create(header,{
            id: _id1.toString(),
            username: value.username,
            email: value.email,
        }, cryptoKey!)

        const user: Partial<User> = {
            //_id,
            username: value.username,
            email: value.email,
            password: hashedPassword,
        }

        await UsersCollection.insertOne(user as UserSchema)
        const {_id, ...userWithOutId} = user as UserSchema

        context.response.body = {
            username: userWithOutId.username,
            email: userWithOutId.email,
            //token
        }

    } catch (error) {
        console.log(error)
        context.response.status = 500
    }
}

export const LogIn = async (context: LogInUsersContext) => {
    try {
        const result = context.request.body({type: "json"})
        const value = await result.value;
        if(!value?.email || !value?.password){
            context.response.status = 404
            context.response.body = {message: "Faltan campos"}
            return
        }

        const userExist = await UsersCollection.findOne({email: value.email})
        if(!userExist){
            context.response.status = 400
            context.response.body = {message: "Usuario no existente"}
            return
        }

        const validPasword = await bcrypt.compare(value.password, userExist.password)
        if(!validPasword){
            context.response.status = 400
            context.response.body = {message: "Invalid password"}
            return
        }

        const key = Deno.env.get("JWT_SECRET")
        const cryptoKey: CryptoKey = await generateKey(key!)
        const token = await create(header,{
            id: userExist._id.toString(),
            username: value.username,
            email: value.email,
        }, cryptoKey!)

        return context.response.body = {
            token
        }
        
    } catch (error) {
        console.log(error)
        context.response.status = 500
    }
}

export const postBook = async (context: PostBookContext) => {
    try {
        const result = context.request.body({type: "json"})
        const value = await result.value;
        if(!value?.name || !value?.author){
            context.response.status = 404
            context.response.body = {message: "Faltan campos"}
            return
        }

        if(!value?.token){
            context.response.status = 404
            context.response.body = {message: "Se requiere introducir token"}
            return
        }

        const user: User = (await verifyJWT(value.token, Deno.env.get("JWT_SECRET")!) as User)
        if(!user){
            context.response.status = 400
            context.response.body = {message: "Se requiere estar logeado"}
            return
        }

        const book: Partial<Book> = {
            name: value.name,
            author: value.author
        }

        await BooksCollection.insertOne(book as BookSchema)
        const {_id, ...bookWithOutId} = book as BookSchema

        context.response.body = bookWithOutId

    } catch (error) {
        console.log(error)
        context.response.status = 500
    }
}