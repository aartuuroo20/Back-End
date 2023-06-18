import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { slotsCollection } from "../db/mongo.ts";
import { Slots } from "../types.ts";
import { SlotsSchema } from "../db/schema.ts";

type PostSlotContext = RouterContext<
  "/addSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;
export const addSlots = async (context: PostSlotContext) => {
    try{
        const result = context.request.body({type: "json"});
        const value = await result.value;

        if(!value?.day || !value?.month || !value?.year || !value?.hour || !value?.id_doctor){
            context.response.status = 400;
            context.response.body = {msg: "Faltan datos"};
            return;
        }

        if(value.day <= 1 || value.day >= 31){
            context.response.status = 406;
            context.response.body = {msg: "El día debe estar entre 1 y 31"};
            return;
        }

        if(value.month < 1 || value.month > 12){
            context.response.status = 406;
            context.response.body = {msg: "El mes debe estar entre 1 y 12"};
            return;
        }

        if(value.hour < 0 || value.hour > 24){
            context.response.status = 406;
            context.response.body = {msg: "La hora debe estar entre 0 y 24"};
            return;
        }

        const comprobarSlot = await slotsCollection.findOne({day: value.day, month: value.month, year: value.year, hour: value.hour});
        if(comprobarSlot?.available === false && comprobarSlot?.id_doctor === value.id_doctor){
            context.response.status = 409;
            context.response.body = {msg: "El slot ya está ocupado"};
            return;
        }

        const newSlot: Partial<Slots> = {
            id_doctor: value.id_doctor,
            day: value.day,
            month: value.month,
            year: value.year,
            hour: value.hour,
            available: true,
        }

        const id = await slotsCollection.insertOne(newSlot as SlotsSchema);
        newSlot.id = id.toString();
        const {_id, ...slotSinId} = newSlot as SlotsSchema;
        context.response.body = slotSinId;

        
    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}
