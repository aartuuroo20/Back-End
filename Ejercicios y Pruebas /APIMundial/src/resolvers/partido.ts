import { EquipoSchema } from "../../../APIGestionMundial/src/db/schema.ts";
import { PartidoSchema } from "../../../APIGestionMundial/src/db/schema.ts";
import { equiposCollection } from "../db/database.ts";
import { ObjectId } from "mongo";


export const Partido = {
    equipo1:  (parent: PartidoSchema): Promise<EquipoSchema> => {
        return  equiposCollection.findOne({_id: new ObjectId(parent.equipo1)});   
    },
    
    equipo2: (parent: PartidoSchema): Promise<EquipoSchema> => {
        return  equiposCollection.findOne({_id: new ObjectId(parent.equipo2)});   
    }
    

}