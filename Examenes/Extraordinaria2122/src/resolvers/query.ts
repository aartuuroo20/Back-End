import { autoresCollection, booksCollection, editorialesCollection } from "../db/mongo.ts";
import { AutoresSchema, BooksSchema, EditorialesSchema } from "../db/schema.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";


export const Query = {
    books: async (): Promise<BooksSchema[]> => {
        try {
            const books = await booksCollection.find({}).toArray();
            return books;
        } catch (error) {
            console.error(error);
            throw new Error("Internal error");
        }
    },

    authors: async (): Promise<AutoresSchema[]> => {
        try {
            const authors = await autoresCollection.find().toArray();
            return authors;
        } catch (error) {
            console.error(error);
            throw new Error("Internal error");
        }
    },

    pressHourses: async (): Promise<EditorialesSchema[]> => {
        try {
            const pressHourses = await editorialesCollection.find().toArray();
            return pressHourses;
        } catch (error) {
            console.error(error);
            throw new Error("Internal error");
        }
    },

    book: async (_: unknown, args: { id: string }): Promise<BooksSchema> => {
        try {
            if(!args.id) throw new Error("Missing arguments");
            const book = await booksCollection.findOne({_id: new ObjectId(args.id)});
            if(!book) throw new Error("Book doesn't exists");

            return book;
            
        } catch (error) {
            console.error(error);
            throw new Error("Internal error");
        }
    },

    author: async (_: unknown, args: { id: string }): Promise<AutoresSchema> => {
        try {
            if(!args.id) throw new Error("Missing arguments");
            const author = await autoresCollection.findOne({_id: new ObjectId(args.id)});
            if(!author) throw new Error("Author doesn't exists");

            return author;
        } catch (error) {
            console.error(error);
            throw new Error("Internal error");
        }
    },

    pressHourse: async (_: unknown, args: { id: string }): Promise<EditorialesSchema> => {
        try {
            if(!args.id) throw new Error("Missing arguments");
            const pressHourse = await editorialesCollection.findOne({_id: new ObjectId(args.id)});
            if(!pressHourse) throw new Error("PressHourse doesn't exists");

            return pressHourse;
            
        } catch (error) {
            console.error(error);
            throw new Error("Internal error");
        }
    }



    
}