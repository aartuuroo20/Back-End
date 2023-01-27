import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { SlotsCollection } from "../database.ts/database.ts";
import { Slots } from "../types.ts";
import { SlotSchema } from "../database.ts/schema.ts";

type GetSlotContext = RouterContext<
"/availableSlot",
Record<string | number, string | undefined>,
Record<string, any>
>;

type DoctorAppointmentsContext = RouterContext<
"/doctorAppointments/:id", {
    id: string
} & 
Record<string | number, string | undefined>,
Record<string, any>
>;

type PatientAppointmentsContext = RouterContext<
"/doctorAppointments/:dni", {
    dni: string
} & 
Record<string | number, string | undefined>,
Record<string, any>
>;

export const availableSlot = async (context: GetSlotContext) => {
    try {
        const params = getQuery(context, { mergeParams: true });
        const {day, month, year, id_doctor} = params

        if(!month || !year){
            context.response.status = 400;
            context.response.body = {message: "Falta año o mes o ambos"}
            return;
        }

        if(!day){
            const Slots = await SlotsCollection.find({
                month: parseInt(month),
                year: parseInt(year),
                id_doctor: id_doctor,
                available: true
            }).toArray()

            context.response.body = context.response.body = Slots.map((slot: SlotSchema) => {
                const {_id, ...rest} = slot
                return rest
            })
        }else{
            const Slots = await SlotsCollection.find({
                day: parseInt(day),
                month: parseInt(month),
                year: parseInt(year),
                id_doctor: id_doctor,
                available: true
            }).toArray()

            context.response.body = context.response.body = Slots.map((slot: SlotSchema) => {
                const {_id, ...rest} = slot
                return rest
            })
        }
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const doctorAppointments = async (context: DoctorAppointmentsContext) => {
    try {
    const { id } = context.params;
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const slots = await SlotsCollection
      .find({
        doctor_id: id,
        $or: [
          {
            year,
            month,
            day: { $gte: day },
          },
          {
            year,
            month: { $gte: month },
          },
          {
            year: { $gte: year },
          },
        ],
      })
      .toArray();

    context.response.body = context.response.body = slots.map((slot: SlotSchema) => {
      const { _id, ...rest } = slot;
      return rest;
    });
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const patientAppointments = async (context: PatientAppointmentsContext) => {
    try {
        const { dni } = context.params;
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const slots = await SlotsCollection
      .find({
        dni: dni,
        $or: [
          {
            year,
            month,
            day: { $gte: day },
          },
          {
            year,
            month: { $gte: month },
          },
          {
            year: { $gte: year },
          },
        ],
      })
      .toArray();

    context.response.body = context.response.body = slots.map((slot: SlotSchema) => {
      const { _id, ...rest } = slot;
      return rest;
    });
        
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}