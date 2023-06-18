import { cocheCollection, concesionarioCollection } from "../db/database.ts";
import { CocheSchema, ConcesionarioSchema } from "../db/schema.ts";
import { VendedorSchema } from "../db/schema.ts";



export const Vendedor = {
    coches: async (parent: VendedorSchema): Promise<CocheSchema[]>  => {
        return await cocheCollection.find({_id: {$in: parent.coches}}).toArray();
    }
}