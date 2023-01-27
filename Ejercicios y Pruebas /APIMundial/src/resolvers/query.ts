import {equipo, partido, Status} from '../types.ts';
import { ObjectId } from "mongo";
import { equiposCollection, partidosCollection } from "../db/database.ts";

export const Query = {
    //Funciona
    getEquipo: async (_: unknown, args:  { id: string }): Promise<equipo|null> => {
        try {
            const equipo = await equiposCollection.findOne({_id: new ObjectId(args.id)});
            if(equipo) return {...equipo};
            else return null;
            
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }   
    },

    //No consigo relacionar el equipo con jugando
    getEquipos: async (_:unknown, args: {eliminado?: boolean, jugando?: boolean}): Promise<equipo[]|null> => {
        try {
            const equipos = await equiposCollection.find().toArray();

            if(args.eliminado === true || args.eliminado === false) return equipos.filter((equipo: equipo) => equipo.eliminado === args.eliminado);
            if(args.jugando === true || args.jugando === false){
                /*
                const partido =  await partidosCollection.find({estado: args.jugando}).toArray();
                const equipo = partido.map((partido: partido) => partido.equipo1)
                console.log(equipo)
                return equipo.map((equipo: equipo) => ({...equipo}))
                */


            } 

            if(equipos){
                return equipos.map((equipo: equipo) => ({...equipo}));
            } else return null;
            
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },

    //Funciona
    getPartido: async (_: unknown, args:  { id: string }): Promise<partido|null> => {
        try {
            const partido = await partidosCollection.findOne({_id: new ObjectId(args.id)});
            if(partido) return {...partido};
            else return null;
            
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }   
    },

    //No consigo relacionar el equipo con el partido
    getPartidos: async (_: unknown, args: {status: Status, equipo?: string}): Promise<partido[] | null> => {
        try {
            if(!args.status) throw new Error("El estado es obligatorio");
            const partidos = await partidosCollection.find().toArray();
            const equipo = await equiposCollection.findOne({_id: new ObjectId(args.equipo)})
            /*

            if(args.equipo){
                
               //Buscar el partido que este jugando el equipo por id
               const partido = partidos.filter((partido: partido) => partido.estado === args.status && (partido.equipo1 === equipo._id || partido.equipo2 === equipo._id));
               console.log(partido)
               if(partido.status === args.status){º
                    return {...partido}
                }else{
                    throw new Error("El equipo no concuerda con la busqueda de estado");
                    
                }
            }*/

            //Obtener todos los parametros de un array de partidos

            const partidosEstado = partidos.filter((partido: partido) => partido.estado === args.status);
            

            if(partidosEstado) return partidosEstado.map((partido: partido) => ({...partido}));
            else return null;
            
            
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }

    }
}

