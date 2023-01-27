import { SlotsCollection } from "../database.ts/database.ts";
import { Slots } from "../types.ts";




export const Query = {
    getSlots: async (_:unknown, args: {id: String}): Promise<Slots | null> => {
        try {
            const slot = await SlotsCollection.findOne((slot: Slots) => slot.id_doctor === args.id);
            if(slot) return {...slot};
            else return null;
        } catch (error) {
            console.log(error);
            throw new Error(error); 
        }
    }
}