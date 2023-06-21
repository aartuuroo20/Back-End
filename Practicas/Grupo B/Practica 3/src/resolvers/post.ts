import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { authorCollection, booksCollection, usersCollection } from "../db/mongo.ts";
import { Author, Books, User } from "../types.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { AuthorSchema, BookSchema, UserSchema } from "../db/schema.ts";
import {v4} from "https://deno.land/std@0.161.0/uuid/mod.ts";

type PostUserContext = RouterContext<
  "/addUser",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type PostAuthorContext = RouterContext<
    "/addAuthor",
    Record<string | number, string | undefined>,
    Record<string, any>
>;

type PostBookContext = RouterContext<
    "/addBook",
    Record<string | number, string | undefined>,
    Record<string, any>
>;


export const addUser = async (context: PostUserContext) => {
    try{
        const result = context.request.body({type: "json"});
        const value = await result.value;

        if(!value?.nombre || !value?.password || !value?.email){
            context.response.status = 400;
            context.response.body = {msg: "Faltan datos"};
            return;
        }

        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value.email)) {
            context.response.body = "Formato email incorrecto";
            context.response.status = 400;
            return;
        }

        const comprobarEmail = await usersCollection.findOne({email: value.email});

        if(comprobarEmail){
            context.response.status = 400;
            context.response.body = {msg: "El usuario ya existe"};
            return;
        }

        const hashedPassword = await bcrypt.hash(value.password);

        const newUser: Partial<User> = {
            nombre: value.nombre,
            password: hashedPassword,
            email: value.email,
            createdAt: new Date(),
            cart: []
        }

        const id = await usersCollection.insertOne(newUser as UserSchema);
        newUser.id = id.toString()
        const {_id, ...userSinId} = newUser as UserSchema;
        context.response.body = userSinId;
        
    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}

export const addAuthor = async (context: PostAuthorContext) => {
    try {
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if(!value?.nombre){
            context.response.status = 400;
            context.response.body = {msg: "Faltan datos"};
            return;
        }

        const comprobarAuthor = await usersCollection.findOne({nombre: value.nombre});
        if(comprobarAuthor){
            context.response.status = 404;
            context.response.body = {msg: "Author ya existe"};
            return;
        }

        const libros = await authorCollection.findOne({autor: value.nombre});

        if(libros){
            const newAuthor: Partial<Author> = {
                nombre: value.nombre,
                books: libros.books
            }

            const id = await authorCollection.insertOne(newAuthor as AuthorSchema);
            newAuthor.id = id.toString()
            const {_id, ...authorSinId} = newAuthor as AuthorSchema;
            context.response.body = authorSinId;

        }else{
            const newAuthor: Partial<Author> = {
                nombre: value.nombre,
                books: []
            }
    
            const id = await authorCollection.insertOne(newAuthor as AuthorSchema);
            newAuthor.id = id.toString()
            const {_id, ...authorSinId} = newAuthor as AuthorSchema;
            context.response.body = authorSinId;
        }

    } catch (error) {
        console.log(error);
        context.response.status = 500;
    }
}

export const addBook = async (context: PostBookContext) => {
    try {
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if(!value?.titulo || !value?.autor || !value?.pages){
            context.response.status = 400;
            context.response.body = {msg: "Faltan datos"};
            return;
        }

        const comprobarAuthor = await authorCollection.findOne({nombre: value.autor});
        if(!comprobarAuthor){
            context.response.status = 404;
            context.response.body = {msg: "Author no existe"};
            return;
        }

        const myUUID = crypto.randomUUID();
        const isValid = v4.validate(myUUID);
        if(!isValid){
            context.response.status = 400;
            context.response.body = {msg: "UUID no valido"};
        }

        const newBook: Partial<Books> = {
            titulo: value.titulo,
            autor: value.autor,
            pages: value.pages,
            isbn: myUUID.toString()
        }

        const idAutor = await authorCollection.updateOne({nombre: value.autor}, {$push: {books: newBook.isbn}});

        const id = await booksCollection.insertOne(newBook as BookSchema);
        newBook.id = id.toString()
        const {_id, ...bookSinId} = newBook as BookSchema;
        context.response.body = bookSinId;

    } catch (error) {
        console.log(error);
        context.response.status = 500;
    }
}