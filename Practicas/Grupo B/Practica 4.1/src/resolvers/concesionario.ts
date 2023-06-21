import { vendedorCollection } from "../db/mongo.ts";
import { VendedorSchema } from "../db/schema.ts";
import { ConcecionarioSchema } from "../db/schema.ts";


export const Concecionario = {
    vendedores: async (parent: ConcecionarioSchema): Promise<VendedorSchema[]> => {
        return await vendedorCollection.find({_id: {$in: parent.vendedores}}).toArray();
    }
}