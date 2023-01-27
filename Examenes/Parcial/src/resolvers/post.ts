import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { SlotsCollection } from "../database.ts/database.ts";
import { SlotSchema } from "../database.ts/schema.ts";
import { Slots } from "../types.ts";


type PostSlotContext = RouterContext<
"/addSlot",
Record<string | number, string | undefined>,
Record<string, any>
>;
export const addSlot = async (context: PostSlotContext) => {
    try {
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if(!value?.day || !value?.month || !value?.year || !value?.hour || !value?.id_doctor){
            context.response.status = 406;
            context.response.body = { message: "No se recibieron algunos de los datos" };
            return;
        }

        if(value.day < 1  || value.day > 31){
            context.response.status = 406;
            context.response.body = { message: "El día debe estar entre 1 y 31" };
            return;
        }

        if(value.month < 1  || value.month > 12){
            context.response.status = 406;
            context.response.body = { message: "El mes debe estar entre 1 y 12" };
            return;
        }

        if(value.hour < 0  || value.hour > 23){
            context.response.status = 406;
            context.response.body = { message: "La hora debe estar entre 0 y 23" };
            return;
        }

        const { day, month, year, hour, id_doctor } = value;

        const foundSlot = await SlotsCollection.findOne({day, month, year, hour, id_doctor});
        if(foundSlot){
            context.response.status = 409;
            context.response.body = { message: "Ya existe un turno para ese día y hora" };
            return;
        }

        const Slot: Partial<Slots> = {
            ...value,
            available: true,
        }

        await SlotsCollection.insertOne(Slot as SlotSchema);
        const {_id, ...rest} = Slot as SlotSchema;
        context.response.body = rest;
        
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

}