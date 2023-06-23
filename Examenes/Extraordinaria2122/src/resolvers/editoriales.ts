import {booksCollection } from "../db/mongo.ts";
import { BooksSchema, EditorialesSchema } from "../db/schema.ts";

export const Editoriales = {
    id: (parent: EditorialesSchema): string => {
        return parent._id.toString();
    },

    books: async (parent: EditorialesSchema): Promise<BooksSchema[]> => {
        return await booksCollection.find({_id: {$in: parent.books}}).toArray();
    },
}