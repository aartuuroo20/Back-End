import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { slotsCollection } from "../db/mongo.ts";

type GetAvailableSlotsContext = RouterContext<
  "/availableSlots",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetDoctorAppointmentsContext = RouterContext<
  "/doctorAppointments/:id_doctor",
  {
    id_doctor: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetPatientAppointmentsContext = RouterContext<
  "/patientAppointments/:dni",
  {
    dni: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getSlots = async (context: GetAvailableSlotsContext) => {
  try {
    const day = context.request.url.searchParams.get('day');
    const month = context.request.url.searchParams.get('month');
    const year = context.request.url.searchParams.get('year');
    const id_doctor = context.request.url.searchParams.get('id_doctor');

    const comprobarDoctor = await slotsCollection.findOne({id_doctor: id_doctor});
    if(!comprobarDoctor){
      context.response.status = 404;
      context.response.body = {msg: "El doctor no existe"};
      return;
    }

    if(!month || !year){
      context.response.status = 400;
      context.response.body = {msg: "Faltan datos"};
      return;
    }

    if(id_doctor){
      if(day && month && year){
        const slots = await slotsCollection.find({id_doctor: id_doctor, day: parseInt(day), month: parseInt(month), year: parseInt(year)}).toArray();
        context.response.body = slots;
        context.response.status = 200;
      }else if(month && year){
        const slots = await slotsCollection.find({id_doctor: id_doctor, month: parseInt(month), year: parseInt(year)}).toArray();
        context.response.body = slots;
        context.response.status = 200;
      }else{
        context.response.status = 403;
        context.response.body = {msg: "Error al buscar los slots"};
      }
    }else{
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
    }
  } catch (error) {
    console.log(error);
    context.response.status = 500;
  }
}

export const getDoctorAppointments = async (context: GetDoctorAppointmentsContext) => {
  try {
    const id_doctor = context.params.id_doctor;
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const slots = await slotsCollection.find({id_doctor: id_doctor, day: {$gte: day}, month: {$gte: month}, year: {$gte: year}, available: false}).toArray();
    context.response.body = slots;
    
  } catch (error) {
    console.log(error);
    context.response.status = 500;
  }
}

export const getPatientAppointments = async (context: GetPatientAppointmentsContext) => {
  try {
    const dni = context.params.dni;
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const slots = await slotsCollection.find({dni: dni, day: {$gte: day}, month: {$gte: month}, year: {$gte: year}}).toArray();
    context.response.body = slots;
  } catch (error) {
    console.log(error);
    context.response.status = 500;
  }
}

