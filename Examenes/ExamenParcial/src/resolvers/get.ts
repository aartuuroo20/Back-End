import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { slotsCollection } from "../db/mongo.ts";

type GetAvailableSlotsContext = RouterContext<
  "/availableSlots",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getSlots = async (context: GetAvailableSlotsContext) => {
  try {
    const day = context.request.url.searchParams.get('day');
    const month = context.request.url.searchParams.get('month');
    const year = context.request.url.searchParams.get('year');

    if(!month || !year){
      context.response.status = 400;
      context.response.body = {msg: "Faltan datos"};
      return;
    }

    if(day && month && year){
      const slots = await slotsCollection.find({day: parseInt(day), month: parseInt(month), year: parseInt(year)}).toArray();
      context.response.body = slots;
      context.response.status = 200;
    }else if(month && year){
      const slots = await slotsCollection.find({month: parseInt(month), year: parseInt(year)}).toArray();
      context.response.body = slots;
      context.response.status = 200;
    }else{
      context.response.status = 403;
      context.response.body = {msg: "Error al buscar los slots"};
    }
  } catch (error) {
    console.log(error);
    context.response.status = 500;
  }
}

