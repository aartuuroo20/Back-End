import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { EventosSchema } from "../db/schema.ts";
import { eventosCollection } from "../db/mongo.ts";
import { Eventos } from "../types.ts";


export const Query = {
    events: async (): Promise<Eventos[]> => {
        try {
            const eventos = await eventosCollection.find({}).toArray();

            if(eventos.length === 0) throw new Error("No hay eventos registrados")
            const eventosConId: Eventos[] = eventos.map((evento: EventosSchema) => {
                const eventoConId = {
                    id: evento._id.toString(),
                    titulo: evento.titulo,
                    descripcion: evento.descripcion,
                    fecha: evento.fecha,
                    inicio: evento.inicio,
                    fin: evento.fin,
                    invitados: evento.invitados,
                }
                return eventoConId;
            });
            return eventosConId;
            
        } catch (error) {
            console.log(error);
            throw new Error("Error al obtener los eventos");
        }
    },

    event: async (_: unknown, args: { id: string }): Promise<Eventos> => {
        try {
            if(!args.id) throw new Error("Faltan datos")
            const evento = await eventosCollection.findOne({ _id: new  ObjectId(args.id) });
            if(!evento) throw new Error("Evento no encontrado")

            return {
                id: evento._id.toString(),
                ...evento
            }
            
        } catch (error) {
            console.log(error);
            throw new Error("Error al obtener el evento");
        }
    }
    
}