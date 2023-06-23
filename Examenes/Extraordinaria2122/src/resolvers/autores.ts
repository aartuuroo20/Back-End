import { booksCollection } from "../db/mongo.ts";
import { BooksSchema, AutoresSchema } from "../db/schema.ts";

export const Autores = {
    id: (parent: AutoresSchema): string => {
        return parent._id.toString();
    },

    books: async (parent: AutoresSchema): Promise<BooksSchema[]> => {
        return await booksCollection.find({_id: {$in: parent.books}}).toArray();
    },
}