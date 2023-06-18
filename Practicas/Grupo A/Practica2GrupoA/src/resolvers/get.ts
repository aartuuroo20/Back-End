import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { cocheCollection } from "../db/mongo.ts";
import { Coche } from "../types.ts";
import { CocheSchema } from "../db/schema.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";


type GetCarContext = RouterContext<
  "/car/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

type AskCarContext = RouterContext<
  "/askCar",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getCar = async (context: GetCarContext) => {
    try{
        if(context.params?.id){
            const coche = await cocheCollection.findOne({_id: new ObjectId(context.params.id)})
            if(coche){
                const {_id, ...carWithOutId} = coche as CocheSchema
                context.response.body = {
                    ...carWithOutId,
                    id: _id.toString()
                }
            }else{
                context.response.status = 404;
                context.response.body = {message: "Coche no existente"}
            }
        }
    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}

export const askCar = async (context: AskCarContext) => {
    try {
        const cochesLibres = await cocheCollection.find({status: true}).toArray()
        if(cochesLibres.length > 0){
            const coche = cochesLibres[0];
            const {_id, ...cocheWithoutId} = coche as CocheSchema

            await cocheCollection.updateOne({
                _id
            }, {$set: {status: false}})

            context.response.body = {...cocheWithoutId, id: _id.toString()}
            
        }else{
            context.response.status = 404;
            context.response.body = {message: "No hay coches libres"}
        }
        
    } catch (error) {
        console.log(error)
        context.response.status = 500
    }
}