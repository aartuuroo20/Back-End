import { SlotsCollection } from "../db/database.ts";
import { Slots } from "../types.ts";


export const Query = {
    availableSlot: async (_:unknown, args: {day: number, month: number, year: number}): Promise<Slots> => {
        try {
            if(!args.month || !args.year) throw new Error('Faltan campos')

            const cita = await SlotsCollection.find({day: args.day, month: args.month, year: args.year}).toArray()
            if(!cita) throw new Error('No hay citas')

            return cita.map((slots: Slots) => ({...slots}))

        } catch (error) {
            console.log(error);
            throw new Error(error);  
        }
    }
}