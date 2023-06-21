import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { slotsCollection } from "../db/mongo.ts";


type RemoveSlotContext = RouterContext<
  "/removeSlot",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const deleteSlot = async (context: RemoveSlotContext) => {
    try{
      const day = context.request.url.searchParams.get('day');
      const month = context.request.url.searchParams.get('month');
      const year = context.request.url.searchParams.get('year');
      const hour = context.request.url.searchParams.get('hour');

      if(!day || !month || !year || !hour){
        context.response.status = 400;
        context.response.body = {msg: "Faltan datos"};
        return;
      }

      const comprobarSlot = await slotsCollection.findOne({day: parseInt(day), month: parseInt(month), year: parseInt(year), hour: parseInt(hour)});

      if(!comprobarSlot){
        context.response.status = 404;
        context.response.body = {msg: "No existe el slot"};
        return;
      }

      if(comprobarSlot.available === false){
        context.response.status = 403;
        context.response.body = {msg: "El slot no está disponible"};
        return;
      }else{
        await slotsCollection.deleteOne({_id: new ObjectId(comprobarSlot._id)});
        context.response.body = {msg: "Slot eliminado"};
        context.response.status = 200;
      }
    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}