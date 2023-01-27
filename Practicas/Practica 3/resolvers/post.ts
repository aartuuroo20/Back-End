import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { AuthorCollection, BooksCollection, UserCollection } from "../db/database.ts";
import { AuthorSchema, BooksSchema, UserSchema } from "../db/schema.ts";
import { Author, Books, User } from "../types.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";
import { v4 } from "https://deno.land/std@0.161.0/uuid/mod.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";


type PostUsersContext = RouterContext<
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


export const addUser = async (context: PostUsersContext) => {
    try {
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (!value?.name || !value?.email || !value?.password) {
            context.response.status = 400;
            return;
        }

        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value.email)) {
            context.response.body = "Formato email incorrecto";
            context.response.status = 400;
            return;
        }

        const comprobarEmail = await UserCollection.findOne({ email: value.email });
        if (comprobarEmail) {
            context.response.body = "El email ya existe";
            context.response.status = 400;
            return;
        }

        const hash = await bcrypt.hashSync(value.password);

        const user: Partial<User> = {
            name: value.name,
            email: value.email,
            password: hash,
            createdAt: new Date(),
            cart: [],
          };

          const id = await UserCollection.insertOne(user as UserSchema);
          context.response.body = {
            name: user.name,
            email: user.email,
            password: hash,
            createdAt: user.createdAt,
            cart: user.cart,
          };
    } catch (error) {
        console.log(error)
        context.response.status = 500
    }
}

export const addAuthor = async (context: PostAuthorContext) => {
    try {
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (!value?.name) {
            context.response.status = 400;
            return;
        }

        const books = await BooksCollection.find({ author: value.name }).toArray()

        if(books){
            const author: Partial<Author> = {
                name: value.name,
                books: books.map((book) => new ObjectId(book._ID).toString()),
            };
    
            const id = await AuthorCollection.insertOne(author as AuthorSchema);
            context.response.body = {
              name: author.name,
              books: author.books,
            };

        }else{
            const author: Partial<Author> = {
                name: value.name,
                books: [],
            };
    
            const id = await AuthorCollection.insertOne(author as AuthorSchema);
            context.response.body = {
              name: author.name,
              books: author.books,
            };

        }

    } catch (error) {
        console.log(error)
        context.response.status = 500
    }
}

export const addBook = async (context: PostBookContext) => {
    try {
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (!value?.title || !value?.author || !value?.pages) {
            context.response.status = 400;
            return;
        }

        const myUUID = crypto.randomUUID();
        const isValid = v4.validate(myUUID);

        if(!isValid){
            context.response.body = "ISBN no válido";
            context.response.status = 400;
        }

        const book: Partial<Books> = {
            title: value.title,
            author: value.author,
            pages: value.pages,
            ISBN: myUUID.toString()
        };

        const id = await BooksCollection.insertOne(book as BooksSchema);
        context.response.body = {
            title: book.title,
            author: book.author,
            pages: book.pages,
            ISBN: book.ISBN
        };
        
    } catch (error) {
        console.log(error)
        context.response.status = 500
    }
}
