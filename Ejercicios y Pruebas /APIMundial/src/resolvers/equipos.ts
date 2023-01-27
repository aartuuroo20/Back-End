import { EquipoSchema } from "../../../APIGestionMundial/src/db/schema.ts";
import { PartidoSchema } from "../../../APIGestionMundial/src/db/schema.ts";
import { partidosCollection } from "../db/database.ts";



export const Equipo = {
    partidos: async (parent: EquipoSchema): Promise<PartidoSchema[]> => {
        return  await partidosCollection.find({_id: {$in: parent.jugadores}}).toArray();   
    },
}