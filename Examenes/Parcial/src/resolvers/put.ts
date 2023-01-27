import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { SlotsCollection } from "../database.ts/database.ts";


type PutSlotContext = RouterContext<
"/bookSlot",
Record<string | number, string | undefined>,
Record<string, any>
>;

export const bookSlot = async (context: PutSlotContext) => {
    try {
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if(!value?.day || !value?.month || !value?.year || !value?.hour || !value?.dni || !value?.id_doctor){
            context.response.status = 404
            context.response.body = {message: "Faltan datos"}
            return
        }

        const {day, month, year, hour, dni, id_doctor} = value
        const slot = await SlotsCollection.findOne({
            day: parseInt(day),
            month: parseInt(month),
            year: parseInt(year),
            hour: parseInt(hour),
            id_doctor: id_doctor
        })

        if(!slot){
            context.response.status = 404
            context.response.body = {message: "No existe el slot"}
            return
        }

        await SlotsCollection.updateOne(
            {_id: slot._id},
            {$set: {available: false, dni}}
        )

        context.response.status = 200
        const {_id, ...rest} = slot
        context.response.body = {...rest, available: false, dni}
        
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}