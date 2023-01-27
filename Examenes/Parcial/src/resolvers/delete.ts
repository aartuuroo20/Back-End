import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { SlotsCollection } from "../database.ts/database.ts";

type DeleteSlotContext = RouterContext<
"/removeSlot",
Record<string | number, string | undefined>,
Record<string, any>
>;

export const deleteSlot = async (context: DeleteSlotContext) => {
    try {
        const params = getQuery(context, { mergeParams: true });
        if(!params.day || !params.month || !params.year || !params.hour || !params.id_doctor){
            context.response.status = 406;
            context.response.body = { message: "No se recibieron algunos de los datos" };
            return;
        }

        const { day, month, year, hour, id_doctor } = params;

        const foundSlot = await SlotsCollection.findOne({day: parseInt(day), month: parseInt(month), year: parseInt(year), hour: parseInt(hour), id_doctor: id_doctor});

        if(!foundSlot){
            context.response.status = 404;
            context.response.body = { message: "No se encontró el turno" };
            return;
        }

        if(foundSlot && foundSlot.available === false){
            context.response.status = 403;
        }

        await SlotsCollection.deleteOne({_id: foundSlot._id});
        context.response.body = { message: "Turno eliminado" };
        context.response.status = 200;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

}