import { slotsCollection } from "../db/mongo.ts";
import { SlotsSchema } from "../db/schema.ts";

export const Query = {
    availableSlots: async (_: unknown, args: {day: number, month: number, year: number}): Promise<SlotsSchema[]> => {
        try {
            if(!args.month || !args.year){
                throw new Error("Faltan datos para la consulta");
            }

            if(args.day < 0 || args.day > 31 || args.month < 0 || args.month > 12 || args.year < 0){
                throw new Error("Datos incorrectos para la consulta");
            }

            if(args.day){
                const slots = await slotsCollection.find({day: args.day, month: args.month, year: args.year}).toArray();
                return slots.map((slot) => ({...slot})) as SlotsSchema[];
            }else{
                const slots = await slotsCollection.find({month: args.month, year: args.year}).toArray();
                return slots.map((slot) => ({...slot})) as SlotsSchema[];
            }
        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener los slots disponibles");
        }
    }
}