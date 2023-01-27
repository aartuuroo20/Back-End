import { concesionarioCollection, vendedorCollection } from "../db/database.ts";
import { ConcesionarioSchema, VendedorSchema } from "../db/schema.ts";
import { Vendedor } from "../types.ts";



export const Concesionario = {
    
    vendedores:  async (parent: ConcesionarioSchema): Promise<VendedorSchema[]>  => {
        return await vendedorCollection.find({_id: {$in: parent.vendedores}}).toArray();
    },
}