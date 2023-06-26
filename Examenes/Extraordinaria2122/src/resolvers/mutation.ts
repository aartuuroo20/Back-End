import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { autoresCollection, booksCollection, editorialesCollection } from "../db/mongo.ts";
import { Autores, Books, Editoriales } from "../types.ts";
import { AutoresSchema, BooksSchema, EditorialesSchema } from "../db/schema.ts";

export const Mutation = {
    addPressHouse: async (_: unknown, args: { name: string, web: string, country: string }): Promise<EditorialesSchema> => {
        try {
            if(!args.name || !args.web || !args.country) throw new Error("Missing arguments");
            const comprobarEditorial = await editorialesCollection.findOne({name: args.name});
            if(comprobarEditorial) throw new Error("Editorial already exists");
            
            const _id: ObjectId = await editorialesCollection.insertOne({
                name: args.name,
                web: args.web,
                country: args.country,
                books: []
            });

            return {
                _id,
                name: args.name,
                web: args.web,
                country: args.country,
                books: []
            }
        } catch (error) {
            console.error(error);
            throw new Error("Internal error");
        }
    },

    addAuthor: async (_: unknown, args: { name: string, lang: string}): Promise<AutoresSchema> => {
        try {
            if(!args.name || !args.lang) throw new Error("Missing arguments");
            const comprobarAutor = await autoresCollection.findOne({name: args.name});
            if(comprobarAutor) throw new Error("Author already exists");
            
            const _id: ObjectId = await autoresCollection.insertOne({
                name: args.name,
                lang: args.lang,
                books: []
            });

            return {
                _id,
                name: args.name,
                lang: args.lang,
                books: []
            }
        } catch (error) {
            console.error(error);
            throw new Error("Internal error");
        }
    },

    addBook: async (_: unknown, args: { title: string, author: string, editorial: string, year: number}): Promise<BooksSchema> => {
        try {
            if(!args.title || !args.author || !args.editorial || !args.year) throw new Error("Missing arguments");

            const comprobarAutor = await autoresCollection.findOne({_id: new ObjectId(args.author)});
            if(!comprobarAutor) throw new Error("Author doesn't exists");
            const comprobarLibroAutor = await booksCollection.findOne({title: args.title, author: new ObjectId(args.author)});
            if(comprobarLibroAutor) throw new Error("Author already has this book");
            const comprobarEditorial = await editorialesCollection.findOne({_id: new ObjectId(args.editorial)});
            if(!comprobarEditorial) throw new Error("Editorial doesn't exists");
            
            const _id: ObjectId = await booksCollection.insertOne({
                title: args.title,
                author: comprobarAutor._id,
                editorial: comprobarEditorial._id,
                year: args.year
            });

            await autoresCollection.updateOne({_id: new ObjectId(args.author)}, {$push: {books: _id}});
            await editorialesCollection.updateOne({_id: new ObjectId(args.editorial)}, {$push: {books: _id}});

            return {
                _id,
                title: args.title,
                author: comprobarAutor._id,
                editorial: comprobarEditorial._id,
                year: args.year
            }
        } catch (error) {
            console.error(error);
            throw new Error("Internal error");
        }
    },

    deletePressHouse: async (_: unknown, args: { id: string }): Promise<EditorialesSchema> => {
        try {
            if(!args.id) throw new Error("Missing arguments");
            const comprobarEditorial = await editorialesCollection.findOne({_id: new ObjectId(args.id)});
            if(!comprobarEditorial) throw new Error("Editorial doesn't exists");

            const deleteEditorial = await editorialesCollection.deleteOne({_id: new ObjectId(args.id)});
            const libros = await booksCollection.find({editorial: new ObjectId(args.id)}).toArray();
            const librosBorrados = await booksCollection.deleteMany({editorial: new ObjectId(args.id)});
            await autoresCollection.updateMany({}, {$pull: {books: {$in: libros.map((libro) => libro._id)}}});

            return {
                _id: comprobarEditorial._id,
                name: comprobarEditorial.name,
                web: comprobarEditorial.web,
                country: comprobarEditorial.country,
                books: comprobarEditorial.books
            }
            
        } catch (error) {
            console.error(error);
            throw new Error("Internal error");
        }
    },

    deleteAuthor: async (_: unknown, args: { id: string }): Promise<AutoresSchema> => {
        try {
            if(!args.id) throw new Error("Missing arguments");
            const comprobarAutor = await autoresCollection.findOne({_id: new ObjectId(args.id)});
            if(!comprobarAutor) throw new Error("Author doesn't exists");

            const deleteAutor = await autoresCollection.deleteOne({_id: new ObjectId(args.id)});
            const editoriales = await editorialesCollection.find({books: new ObjectId(args.id)}).toArray();
            const librosBorrados = await booksCollection.deleteMany({author: new ObjectId(args.id)});
            await editorialesCollection.updateMany({}, {$pull: {books: {$in: editoriales.map((libro) => libro._id)}}});

            return {
                _id: comprobarAutor._id,
                name: comprobarAutor.name,
                lang: comprobarAutor.lang,
                books: comprobarAutor.books
            }
            
        } catch (error) {
            console.error(error);
            throw new Error("Internal error");
        }
    },

    deleteBook: async (_: unknown, args: { id: string }): Promise<BooksSchema> => {
        try {
            if(!args.id) throw new Error("Missing arguments");
            const comprobarLibro = await booksCollection.findOne({_id: new ObjectId(args.id)}); 
            if(!comprobarLibro) throw new Error("Book doesn't exists");

            const deleteLibro = await booksCollection.deleteOne({_id: new ObjectId(args.id)});
            await autoresCollection.updateMany({}, {$pull: {books: new ObjectId(args.id)}});
            await editorialesCollection.updateMany({}, {$pull: {books: new ObjectId(args.id)}});

            return {
                _id: comprobarLibro._id,
                title: comprobarLibro.title,
                author: comprobarLibro.author,
                editorial: comprobarLibro.editorial,
                year: comprobarLibro.year,
            }
            
        } catch (error) {
            console.error(error);
            throw new Error("Internal error");
        }
    }

   
    



    
}