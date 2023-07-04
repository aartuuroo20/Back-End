import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { eventosCollection } from "../db/mongo.ts";
import { EventosSchema } from "../db/schema.ts";


type GetEventContext = RouterContext<
  "/event/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetEventosContext = RouterContext<
  "/events",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getEvent = async (context: GetEventContext) => {
    try{
       const id:string = context.params.id;
       if(!id){
           context.response.status = 400;
           context.response.body = "Falta el id";
           return;
       }

       const evento: EventosSchema|undefined = await eventosCollection.findOne({_id: new ObjectId(id)});
       if(!evento){
           context.response.status = 404;
           context.response.body = "No existe el evento";
           return;
       }

       context.response.status = 200;
        context.response.body = evento;
    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}

export const getEvents = async (context: GetEventosContext) => {
    try {
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDay()
        const fechaActual = new Date(year, month, day)

        const eventos: EventosSchema[] = await eventosCollection.find({}).toArray();
        const eventosFiltrados: EventosSchema[] = eventos.filter((evento: EventosSchema) => {
            return evento.fecha >= fechaActual
        } )

        if(eventosFiltrados.length === 0){
            context.response.status = 404;
            context.response.body = "No hay eventos";
            return;
        }

        context.response.status = 200;
        context.response.body = eventosFiltrados;
        
    } catch (error) {
        console.log(error)
        context.response.status = 500
    }
}