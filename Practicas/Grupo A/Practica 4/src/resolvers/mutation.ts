import { slotsCollection } from "../db/mongo.ts";
import { SlotsSchema } from "../db/schema.ts";



export const Mutation = {
    addSlot: async (_: unknown, args: {day: number, month: number, year: number, hour: number}): Promise<SlotsSchema> => {
        try {
            if(!args.day || !args.month || !args.year || !args.hour){
                throw new Error("Faltan datos para añadir el slot");
            }

            if(args.day < 0 || args.day > 31 || args.month < 0 || args.month > 12 || args.year < 0 || args.hour < 0 || args.hour > 23){
                throw new Error("Datos incorrectos para añadir el slot");
            }

            const comprobarSlot = await slotsCollection.findOne({day: args.day, month: args.month, year: args.year, hour: args.hour, available: false});
            if(comprobarSlot){
                throw new Error("El slot ya está ocupado");
            }

            const comprobarSlot2 = await slotsCollection.findOne({day: args.day, month: args.month, year: args.year, hour: args.hour, available: true});
            if(comprobarSlot2){
                return {
                    ...comprobarSlot2
                }                
            }

            const slot = await slotsCollection.insertOne({
                day: args.day,
                month: args.month,
                year: args.year,
                hour: args.hour,
                available: true,
            });

            return {
                _id: slot,
                day: args.day,
                month: args.month,
                year: args.year,
                hour: args.hour,
                available: true,
                
            }
        } catch (error) {
            console.error(error);
            throw new Error("Error al añadir el slot");
        }
    },

    removeSlot: async (_: unknown, args: {day: number, month: number, year: number, hour: number}): Promise<SlotsSchema | undefined> => {
        try {
            if(!args.day || !args.month || !args.year || !args.hour){
                throw new Error("Faltan datos para eliminar el slot");
            }

            if(args.day < 0 || args.day > 31 || args.month < 0 || args.month > 12 || args.year < 0 || args.hour < 0 || args.hour > 23){
                throw new Error("Datos incorrectos para eliminar el slot");
            }

            const comprobarSlot = await slotsCollection.findOne({day: args.day, month: args.month, year: args.year, hour: args.hour, available: false});
            if(comprobarSlot){
                throw new Error("El slot está ocupado");
            }

            const comprobarSlot2 = await slotsCollection.findOne({day: args.day, month: args.month, year: args.year, hour: args.hour, available: true});
            if(comprobarSlot2){
                await slotsCollection.deleteOne({day: args.day, month: args.month, year: args.year, hour: args.hour, available: true});
                return {
                    ...comprobarSlot2 as SlotsSchema
                }                
            }
        } catch (error) {
            console.error(error);
            throw new Error("Error al eliminar el slot");
        }
    },

    bookSlot: async (_: unknown, args: {day: number, month: number, year: number, hour: number, dni: string}): Promise<SlotsSchema> => {
        try {
            if(!args.day || !args.month || !args.year || !args.hour || !args.dni){
                throw new Error("Faltan datos para reservar el slot");
            }

            if(args.day < 0 || args.day > 31 || args.month < 0 || args.month > 12 || args.year < 0 || args.hour < 0 || args.hour > 23){
                throw new Error("Datos incorrectos para reservar el slot");
            }

            const comprobarSlot: SlotsSchema | undefined = await slotsCollection.findOne({day: args.day, month: args.month, year: args.year, hour: args.hour, available: false});
            if (!comprobarSlot) {
                throw new Error("No existe")
            }
            
            if(comprobarSlot?.available === false){
                throw new Error("El slot está ocupado");
            }else{
                const updatedSlot = await slotsCollection.updateOne({day: args.day, month: args.month, year: args.year, hour: args.hour, available: true}, {$set: {available: false, dni: args.dni}});
                
                return {
                    _id: comprobarSlot?._id,
                    day: args.day,
                    month: args.month,
                    year: args.year,
                    hour: args.hour,
                    available: false,
                    dni: args.dni,
                }
            }
        } catch (error) {
            console.error(error);
            throw new Error("Error al reservar el slot");
        }
    }
}