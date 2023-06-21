import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { slotsCollection } from "../db/mongo.ts";
import { SlotsSchema } from "../db/schema.ts";

type UpdateSlotContext = RouterContext<
  "/bookSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;


export const updateSlot = async (context: UpdateSlotContext) => {
    try{
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if(!value?.day || !value?.month || !value?.year || !value?.hour || !value?.dni || !value?.id_doctor){
            context.response.status = 400;
            context.response.body = {msg: "Faltan datos"};
            return;
        }

        const comprobarSlot = await slotsCollection.findOne({id_doctor: value.id_doctor, day: parseInt(value.day), month: parseInt(value.month), year: parseInt(value.year), hour: parseInt(value.hour), available: true});
        if(!comprobarSlot){
            context.response.status = 404;
            context.response.body = {msg: "Slot no disponible"};
            return;
        }

        const updateSlot = await slotsCollection.updateOne({id_doctor: value.id_doctor, day: parseInt(value.day), month: parseInt(value.month), year: parseInt(value.year), hour: parseInt(value.hour), available: true}, {$set: {available: false, dni: value.dni}});
        const {_id, ...slotSinid} = updateSlot as SlotsSchema;
        context.response.body = slotSinid;
        context.response.status = 200;

    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}