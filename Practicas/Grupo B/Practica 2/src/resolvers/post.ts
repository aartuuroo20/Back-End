import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { transactionsCollection, usersCollection } from "../db/mongo.ts";
import { Transactions, Users } from "../types.ts";
import { TransactionsSchema, UsersSchema } from "../db/schema.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";

type PostUserContext = RouterContext<
  "/addUser",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type PostTransactionContext = RouterContext<
    "/addTransaction",
    Record<string | number, string | undefined>,
    Record<string, any>
>;


export const addUser = async (context: PostUserContext) => {
    try{
        const result = context.request.body({type: "json"});
        const value = await result.value;

        if(!value?.nombre || !value?.apellidos || !value?.dni || !value?.telefono || !value?.email){
            context.response.status = 400;
            context.response.body = {msg: "Faltan datos"};
            return;
        }

        if (!/^[0-9]{8}[A-Z]$/.test(value.dni)) {
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

        const comprobarDNI = await usersCollection.findOne({dni: value.dni});
        const comprobarTelefono = await usersCollection.findOne({telefono: value.telefono});
        const comprobarEmail = await usersCollection.findOne({email: value.email});
        const ibanAleatorio = "ES21" + Math.floor(Math.random() * 1000000000000000000000);
        const comprobarIban = await usersCollection.findOne({iban: ibanAleatorio});

        if(comprobarDNI || comprobarTelefono || comprobarEmail || comprobarIban){
            context.response.status = 400;
            context.response.body = {msg: "El usuario ya existe"};
            return;
        }

        const newUser: Partial<Users> = {
            dni: value.dni,
            nombre: value.nombre,
            apellidos: value.apellidos,
            telefono: value.telefono,
            email: value.email,
            iban: ibanAleatorio,
        }

        const id = await usersCollection.insertOne(newUser as UsersSchema);
        newUser.id = id.toString()
        const {_id, ...userSinId} = newUser as UsersSchema;
        context.response.body = userSinId;
        
    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}

export const addTransaction = async (context: PostTransactionContext) => {
    try {
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if(!value?.id_sender || !value?.id_receiver || !value?.amount){
            context.response.status = 400;
            context.response.body = {msg: "Faltan datos"};
            return;
        }

        const userSender = await usersCollection.findOne({_id: new ObjectId(value.id_sender)});
        const userReceiver = await usersCollection.findOne({_id: new ObjectId(value.id_receiver)});

        if(!userSender || !userReceiver){
            context.response.status = 404;
            context.response.body = {msg: "Los usuarios no existen"};
            return;
        }

        const newTransaction: Partial<Transactions> = {
            id_sender: value.id_sender,
            id_receiver: value.id_receiver,
            amount: value.amount,
        }

        const id = await transactionsCollection.insertOne(newTransaction as TransactionsSchema);
        newTransaction.id = id.toString()
        const {_id, ...transactionSinId} = newTransaction as TransactionsSchema;
        context.response.body = transactionSinId;
        
    } catch (error) {
        console.log(error);
        context.response.status = 500;
    }
}