import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { cocheCollection } from "../db/mongo.ts";
import { Coche } from "../types.ts";
import { CocheSchema } from "../db/schema.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";


type RemoveCarContext = RouterContext<
  "/removeCar/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const removeCar = async (context: RemoveCarContext) => {
    try{
        if(context.params?.id){
            const coche = await cocheCollection.findOne({_id: new ObjectId(context.params.id)})
            if(coche){
                if(coche.status){
                    await cocheCollection.deleteOne({_id: new ObjectId(context.params.id)})
                    context.response.status = 200;
                    context.response.body = {message: "Coche eliminado"}
                }else{
                    context.response.status = 405;
                    context.response.body = {message: "Coche ocupado"}
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