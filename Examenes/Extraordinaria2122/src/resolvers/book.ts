import { autoresCollection, editorialesCollection } from "../db/mongo.ts";
import { BooksSchema, EditorialesSchema, AutoresSchema } from "../db/schema.ts";

export const Books = {
    id: (parent: BooksSchema): string => {
        return parent._id.toString();
    },

    author: async (parent: BooksSchema): Promise<AutoresSchema | undefined> => {
        return await autoresCollection.findOne({_id: parent.author});
    },

    editorial: async (parent: BooksSchema): Promise<EditorialesSchema | undefined> => {
        return await editorialesCollection.findOne({_id: parent.editorial});
    }


}