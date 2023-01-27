import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { UserSchema } from "../db/schema.ts";
import { Users } from "../types.ts";
import { UsersCollection } from "../db/db.ts";

type PostUsersContext = RouterContext<
  "/users",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const addUser = async (context: PostUsersContext) => {
  try {
    const result = context.request.body({ type: "json" });
  const value = await result.value;
  if (!value?.DNI || !value?.nombre || !value?.apellido || !value?.telefono || !value?.email) {
    context.response.status = 400;
    return;
  }

  if (!/^[0-9]{8}[A-Z]$/.test(value.DNI)) {
    context.response.body = "Formato DNI incorrecto";
    context.response.status = 400;
    return;
  }
  if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value.email)) {
    context.response.body = "Formato email incorrecto";
    context.response.status = 400;
    return;
  }
  
  if (!/^[0-9]{9}$/.test(value.telefono)) {
    context.response.body = "Formato telefono incorrecto";
    context.response.status = 400;
    return;
  }

  const ibanAleatorio = "ES21" + Math.floor(Math.random() * 1000000000000000000000);

  const idAleatorio = Math.floor(Math.random() * 10).toString();

  const comprobarDNI = await UsersCollection.findOne({ DNI: value.DNI });
  if (comprobarDNI) {
    context.response.body = "El DNI ya existe";
    context.response.status = 400;
    return;
  }

  const comprobarTel = await UsersCollection.findOne({ telefono: value.telefono });
  if (comprobarTel) {
    context.response.body = "El telefono ya existe";
    context.response.status = 400;
    return;
  }

  const comprobarID = await UsersCollection.findOne({ ID: idAleatorio });
  if (comprobarID) {
    context.response.body = "El ID ya existe";
    context.response.status = 400;
    return;
  }

  const comprobarIBAN = await UsersCollection.findOne({ IBAN: ibanAleatorio });
  if (comprobarIBAN) {
    context.response.body = "El IBAN ya existe";
    context.response.status = 400;
    return;
  }

  const comprobarEmail = await UsersCollection.findOne({ email: value.email });
  if (comprobarEmail) {
    context.response.body = "El email ya existe";
    context.response.status = 400;
    return;
  }

  const user: Partial<Users> = {
    DNI: value.DNI,
    nombre: value.nombre,
    apellido: value.apellido,
    telefono: value.telefono,
    email: value.email,
    IBAN: ibanAleatorio,
    ID: idAleatorio,
  };
  const id = await UsersCollection.insertOne(user as UserSchema);
  context.response.body = {
    DNI: user.DNI,
    nombre: user.nombre,
    apellido: user.apellido,
    telefono: user.telefono,
    email: user.email,
    IBAN: user.IBAN,
    ID: user.ID,
  };
    
  } catch (error) {
    console.log(error)
    context.response.status = 500
  }
  
};