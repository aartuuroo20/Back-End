import { equiposCollection, partidosCollection } from "../db/database.ts";
import { equipo, partido, Status } from "../types.ts";
import { ObjectId } from "mongo";
import { Partido } from "./partido.ts";



export const Mutation = {
    addEquipo: async (_: unknown, args: {nombre: string, jugadores: string[]}): Promise<equipo> => {
        try {
            if(!args.nombre || !args.jugadores) throw new Error("El nombre y los jugadores son obligatorios");

            const equipo: equipo = await equiposCollection.insertOne({
                nombre: args.nombre,
                jugadores: args.jugadores,
                eliminado: false,
                golesFavor: 0,
                golesContra: 0,
                puntos: 0,
                partidos: 0
            })
            
            return {
                nombre: args.nombre,
                jugadores: args.jugadores,
                eliminado: false,
                golesFavor: 0,
                golesContra: 0,
                puntos: 0,
                partidos: 0
            };
            
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },

    addPartido: async (_: unknown, args: {equipo1: string, equipo2: string}): Promise<partido> => {
        try {
            if(!args.equipo1 || !args.equipo2) throw new Error("Los equipos son obligatorios");
            const equipo1 = await equiposCollection.findOne({_id: new ObjectId(args.equipo1)});
            const equipo2 = await equiposCollection.findOne({_id: new ObjectId(args.equipo2)});
            if(!equipo1 || !equipo2) throw new Error("Uno de los equipos o ambos no existen");

            const partido: partido = await partidosCollection.insertOne({
                equipo1: new ObjectId(args.equipo1),
                equipo2: new ObjectId(args.equipo2),
                golesEquipo1: 0,
                golesEquipo2: 0,
                estado: Status.not_started,
                time: 0
            })

            return {
                ...partido
            }

            
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },

    updatePartido: async (_: unknown, args: {id: string, status?: Status, equipo1?: number, equipo2?: number, time?: number}): Promise<partido> => {
        try {
            if(!args.id) throw new Error("El id del partido es obligatorio");
            const partido1 = await partidosCollection.findOne({_id: new ObjectId(args.id)});
            if(!partido1) throw new Error("El partido no existe");
            const equipo1 = await equiposCollection.findOne({_id: partido1.equipo1});
            const equipo2 = await equiposCollection.findOne({_id: partido1.equipo2});
            if(!equipo1 || !equipo2) throw new Error("Uno de los equipos o ambos no existen");

            const partido = await partidosCollection.updateOne(
                {_id: new ObjectId(args.id)},   
                { $set: {  estado: args.status ? args.status : partido1.estado, 
                            golesEquipo1: args.equipo1 ? args.equipo1 : partido1.golesEquipo1,
                            golesEquipo2: args.equipo2 ? args.equipo2 : partido1.golesEquipo2,
                            time: args.time ? args.time : partido1.time
                        } 
                });

        

////////////////////////////////////////////////////////////////////////////////////////////////

            if(args.time === 90){
                await partidosCollection.updateOne(
                    {_id: partido1._id},
                    { $set: { estado: Status.finished } }
                );
            }else{
                await partidosCollection.updateOne(
                    {_id: partido1._id},
                    { $set: { estado: Status.started } }
                );
            }

            if(args.time === 90){
                await equiposCollection.updateOne(
                    {_id: equipo1._id},
                    { $set: { partidos: equipo1.partidos + 1 } }
                );
                await equiposCollection.updateOne(
                    {_id: equipo2._id},
                    { $set: { partidos: equipo2.partidos + 1 } }
                );

                await equiposCollection.updateOne(
                    {_id: equipo1._id},
                    { $set: { golesFavor: equipo1.golesFavor + partido1.golesEquipo1,
                            golesContra: equipo1.golesContra + partido1.golesEquipo2 } }
                );

                await equiposCollection.updateOne(
                    {_id: equipo2._id},
                    { $set: { golesFavor: equipo2.golesFavor + partido1.golesEquipo2,
                            golesContra: equipo2.golesContra + partido1.golesEquipo1  } }
                );

                if(partido1.golesEquipo1 === partido1.golesEquipo2){
                    await equiposCollection.updateOne(
                        {_id: equipo1._id},   
                        { $set: { puntos: equipo1.puntos + 1} 
                        });
                    await equiposCollection.updateOne(
                        {_id: equipo2._id},   
                        { $set: {  puntos: equipo2.puntos + 1 } 
                        });
                }else if(partido1.golesEquipo1 < partido1.golesEquipo2){
                    await equiposCollection.updateOne(
                        {_id: equipo1._id},   
                        { $set: {  puntos: equipo1.puntos + 0 } 
                        });
                    await equiposCollection.updateOne(
                        {_id: equipo2._id},   
                        { $set: {  puntos: equipo2.puntos + 3} 
                        });
                }else{
                    await equiposCollection.updateOne(
                        {_id: equipo1._id},   
                        { $set: {  puntos: equipo1.puntos + 3} 
                        });
                    await equiposCollection.updateOne(
                        {_id: equipo2._id},   
                        { $set: {  puntos: equipo2.puntos + 0} 
                        });
                }
            }
            
            return {
                ...partido
            }
            
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }


    }
    
}