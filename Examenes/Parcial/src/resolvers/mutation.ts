import { SlotsCollection } from "../database.ts/database.ts";
import { SlotSchema } from "../database.ts/schema.ts";
import { Slots } from "../types.ts";




export const Mutation = {
    addSlot: async (_:unknown, args: {day: number, month: number, hour: number, id_doctor: string}): Promise<Slots> => {
        try {   
            const slot: SlotSchema = await SlotsCollection.insertOne({
                day: args.day,
                month: args.month,
                hour: args.hour,
                id_doctor: args.id_doctor
            })
                
            return {
                ...slot
            }
        } catch (error) {
            console.log(error);
            throw new Error(error); 
        }
    }
}