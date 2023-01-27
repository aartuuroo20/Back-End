import { SlotsCollection } from "../db/database.ts";
import { Slots } from "../types.ts";
import { ObjectId } from "mongo";



export const Mutation = {
    addSlot: async (_:unknown, args: {day: number, month: number, year: number, hour: number}): Promise<Slots>  => {
        try {
            if(!args.day || !args.month || !args.year || !args.hour) throw new Error('Faltan campos')
            if(args.day < 0 || args.day > 31) throw new Error('Mal los dias')
            if(args.month < 0 || args.month > 12) throw new Error('Mal los meses')
            if(args.year < 2022) throw new Error('Mal los años')
            if(args.hour < 0 || args.hour > 23) throw new Error('Mal los dias')

            const cita = await SlotsCollection.findOne({day: args.day, month: args.month, year: args.year, hour: args.hour, available: false})
            if(cita) throw new Error('Cita ya existente')

            const newCita = await SlotsCollection.insertOne({
                day: args.day,
                month: args.month,
                year: args.year,
                hour: args.hour,
                available: true
            })

            return newCita

        } catch (error) {
            console.log(error);
            throw new Error(error);  
        }
    },

    removeSlot: async (_:unknown, args: {day: number, month: number, year: number, hour: number}): Promise<Slots> => {
        try {
            if(!args.day || !args.month || !args.year || !args.hour) throw new Error('Faltan campos')
            if(args.day < 0 || args.day > 31) throw new Error('Mal los dias')
            if(args.month < 0 || args.month > 12) throw new Error('Mal los meses')
            if(args.year < 2022) throw new Error('Mal los años')
            if(args.hour < 0 || args.hour > 23) throw new Error('Mal los dias')

            const cita = await SlotsCollection.findOne({day: args.day, month: args.month, year: args.year, hour: args.hour, available: false})
            if(cita) throw new Error('Cita ya existente')

            const newCita = await SlotsCollection.deleteOne({
                day: args.day,
                month: args.month,
                year: args.year,
                hour: args.hour,
            })

            return newCita

        } catch (error) {
            console.log(error);
            throw new Error(error);  
        }
    },

    bookSlot: async (_:unknown, args: {day: number, month: number, year: number, hour: number, dni: string}): Promise<Slots> => {
        try {
            if(!args.day || !args.month || !args.year || !args.hour || !args.dni) throw new Error('Faltan campos')
            if(args.day < 0 || args.day > 31) throw new Error('Mal los dias')
            if(args.month < 0 || args.month > 12) throw new Error('Mal los meses')
            if(args.year < 2022) throw new Error('Mal los años')
            if(args.hour < 0 || args.hour > 23) throw new Error('Mal los dias')

            const cita = await SlotsCollection.findOne({day: args.day, month: args.month, year: args.year, hour: args.hour})
            if(cita.available === false) throw new Error('Cita ya ocupada')

            const newCita = await SlotsCollection.updateOne(
                {_id: new ObjectId(cita._id)}, 
                {$set: {available: false}}
            )

            return newCita

        } catch (error) {
            console.log(error);
            throw new Error(error);  
        }
    }
}