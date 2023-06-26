import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { eventosCollection } from "../db/mongo.ts";
import { Eventos } from "../types.ts";


type UpdateEventContext = RouterContext<
  "/updateEvent",
  Record<string | number, string | undefined>,
  Record<string, any>
>;


export const updateEvent = async (context: UpdateEventContext) => {
    try{
        const result = context.request.body({type: "json"});
        const value = await result.value;

        if(!value.id){
            context.response.status = 400;
            context.response.body = "Falta el id para identificar el evento";
            return;
        }

        if(value.horaInicio >= value.horaFinal){
            context.response.status = 400;
            context.response.body = "La hora de inicio no puede ser mayor o igual a la hora final";
            return;
        }

        const evento = await eventosCollection.findOne({_id: new ObjectId(value.id)});
        if(!evento){
            context.response.status = 404;
            context.response.body = "No existe el evento";
            return;
        }

        const comprobarEvento = await eventosCollection.find({fecha: new Date(value.fecha)}).toArray();
        if(comprobarEvento.length > 0){
            for(let i = 0; i < comprobarEvento.length; i++){
                if(comprobarEvento[i].horaInicio <= value.horaInicio && comprobarEvento[i].horaFinal >= value.horaInicio){
                    context.response.status = 400;
                    context.response.body = "Ya hay un evento en esa hora";
                    return;
                }
                if(comprobarEvento[i].horaInicio <= value.horaFinal && comprobarEvento[i].horaFinal >= value.horaFinal){
                    context.response.status = 400;
                    context.response.body = "Ya hay un evento en esa hora";
                    return;
                }
            }
        }

        const newEvent: Partial<Eventos> = {
            titulo: value.titulo,
            descripcion: value.descripcion,
            fecha: new Date(value.fecha),
            horaInicio: value.horaInicio,
            horaFinal: value.horaFinal,
            invitados: value.invitados,
        }

        await eventosCollection.updateOne({_id: new ObjectId(value.id)}, {$set: newEvent as Eventos});

        const mostrarEvento = await eventosCollection.findOne({_id: new ObjectId(value.id)});
        context.response.status = 200;
        context.response.body = mostrarEvento;
        
    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}