import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { cocheCollection } from "../db/mongo.ts";
import { Coche } from "../types.ts";
import { CocheSchema } from "../db/schema.ts";


type PostCarContext = RouterContext<
  "/addCar",
  Record<string | number, string | undefined>,
  Record<string, any>
>;


export const postAddCoche = async (context: PostCarContext) => {
    try{
        const result = context.request.body({type: "json"});
        const value = await result.value;

        if(!value?.matricula || !value?.numeroPlazas){
            context.response.status = 400;
            context.response.body = "Faltan campos";
            return;
        }

        const cocheExistente = await cocheCollection.findOne({matricula: value.matricula});
        if(cocheExistente){
            context.response.status = 409;
            context.response.body = "Ya existe un coche con esa matricula";
            return;
        }

        const coche: Partial<Coche> = {
            ...value,
            status: true
        }

        const id = await cocheCollection.insertOne(coche as CocheSchema);
        coche.id = id.toString()
        const {_id, ...cocheSinId} = coche as CocheSchema;
        context.response.body = cocheSinId;

    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}