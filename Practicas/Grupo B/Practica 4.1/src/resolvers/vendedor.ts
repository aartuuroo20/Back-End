import { cocheCollection } from "../db/mongo.ts";
import { CocheSchema } from "../db/schema.ts";
import { VendedorSchema } from "../db/schema.ts";


export const Vendedor = {
    coches: async (parent: VendedorSchema): Promise<CocheSchema[]> => {
        return await cocheCollection.find({_id: {$in: parent.coches}}).toArray();
    }
}