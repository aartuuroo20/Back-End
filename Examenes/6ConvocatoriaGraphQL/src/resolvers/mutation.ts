import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { eventosCollection } from "../db/mongo.ts";
import { Eventos } from "../types.ts";
import { EventosSchema } from "../db/schema.ts";

export const Mutation = {
    addEvent: async (_: unknown, args: { titulo: string, descripcion: string, fecha: string, inicio: number, fin: number, invitados: string[] }): Promise<Eventos> => {
        try {
            if(!args.titulo || !args.fecha || !args.inicio || !args.fin || !args.invitados) throw new Error("Faltan datos")
            if(args.fin <= args.inicio) throw new Error("La hora de inicio debe ser menor a la hora de fin")

            if(args.inicio < 0 || args.inicio > 23 || args.fin < 0 || args.fin > 23) throw new Error("La hora de inicio y fin deben estar entre 0 y 23")

            const eventos = await eventosCollection.find({fecha: new Date(args.fecha)}).toArray();
            if(eventos.length > 0) {
                /*En el momento de crear un evento, se verifica que no haya otro evento en el mismo horario en el momento que algun if devuelve true salta el error*/

                if(eventos.some((evento: EventosSchema) => {
                    if(evento.inicio <= args.inicio && evento.fin > args.inicio) return true;
                    if(evento.inicio < args.fin && evento.fin >= args.fin) return true;
                    if(evento.inicio >= args.inicio && evento.fin <= args.fin) return true;
                    return false;
                })) throw new Error("Ya hay un evento en ese horario")
            }

            const id: ObjectId = await eventosCollection.insertOne({
                titulo: args.titulo,
                descripcion: args.descripcion,
                fecha: new Date(args.fecha),
                inicio: args.inicio,
                fin: args.fin,
                invitados: args.invitados,
            });

            return {
                id: id.toString(),
                titulo: args.titulo,
                descripcion: args.descripcion,
                fecha: new Date(args.fecha),
                inicio: args.inicio,
                fin: args.fin,
                invitados: args.invitados,
            }
            
        } catch (error) {
            console.log(error);
            throw new Error("Error al agregar el evento");
        }
    },

    deleteEvent: async (_: unknown, args: { id: string }): Promise<Eventos> => {
        try {
            if(!args.id) throw new Error("Faltan datos")
            const evento = await eventosCollection.findOne({ _id: new  ObjectId(args.id) });
            if(!evento) throw new Error("Evento no encontrado")

            await eventosCollection.deleteOne({ _id: new  ObjectId(args.id) });

            return {
                id: evento._id.toString(),
                ...evento
            }
            
        } catch (error) {
            console.log(error);
            throw new Error("Error al eliminar el evento");
        }
    },

    updateEvent: async (_: unknown, args: { id: string, titulo: string, descripcion: string, fecha: string, inicio: number, fin: number, invitados: string[] }): Promise<Eventos> => {
        try {
            if(!args.id) throw new Error("Faltan datos")
            const evento = await eventosCollection.findOne({ _id: new ObjectId(args.id) });
            if(!evento) throw new Error("Evento no encontrado")
            if(args.fin <= args.inicio) throw new Error("La hora de inicio debe ser menor a la hora de fin")
            if(args.inicio < 0 || args.inicio > 23 || args.fin < 0 || args.fin > 23) throw new Error("La hora de inicio y fin deben estar entre 0 y 23")

            if(!args.titulo && !args.descripcion && !args.fecha && !args.inicio && !args.fin && !args.invitados) throw new Error("No hay datos para actualizar")

            const eventos = await eventosCollection.find({fecha: new Date(args.fecha)}).toArray();
            if(eventos.length > 0) {
                if(eventos.some((evento: EventosSchema) => {
                    if(evento.inicio <= args.inicio && evento.fin > args.inicio) return true;
                    if(evento.inicio < args.fin && evento.fin >= args.fin) return true;
                    if(evento.inicio >= args.inicio && evento.fin <= args.fin) return true;
                    return false;
                })) throw new Error("Ya hay un evento en ese horario")
            }

            await eventosCollection.updateOne({ _id: new ObjectId(args.id) }, {
                $set: {
                    titulo: args.titulo || evento.titulo,
                    descripcion: args.descripcion || evento.descripcion,
                    fecha: new Date(args.fecha) || evento.fecha,
                    inicio: args.inicio || evento.inicio,
                    fin: args.fin || evento.fin,
                    invitados: args.invitados || evento.invitados,
                }
            });

            return {
                id: evento._id.toString(),
                titulo: args.titulo || evento.titulo,
                descripcion: args.descripcion || evento.descripcion,
                fecha: new Date(args.fecha) || evento.fecha,
                inicio: args.inicio || evento.inicio,
                fin: args.fin || evento.fin,
                invitados: args.invitados || evento.invitados,
            }

        } catch (error) {
            console.log(error);
            throw new Error("Error al actualizar el evento");
        }
    }

}