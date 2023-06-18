import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { usersCollection } from "../db/mongo.ts";
import {isValidObjectId} from "npm:mongoose@^6.7";


type GetUserContext = RouterContext<
  "/getUser/:parametro",
  {
    parametro: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getUser = async (context: GetUserContext) => {
    try{
        const parametro = context.params.parametro;
        const user = await usersCollection.findOne({$or: [{dni: parametro}, {telefono: parametro}, {email: parametro}, {iban: parametro}]});
        const isValid = isValidObjectId(parametro);

        if(isValid){
          const userId = await usersCollection.findOne({_id: new ObjectId(parametro)});
          context.response.body = userId;
        }

        if(user){
            context.response.body = user;
        }

        if(!user && !isValid){
            context.response.status = 404;
            context.response.body = {msg: "El usuario no existe"};
            return;
        }      
    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}
