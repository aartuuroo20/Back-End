import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { cocheCollection } from "../db/mongo.ts";
import { CocheSchema } from "../db/schema.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";


type ReleaseCarContext = RouterContext<
  "/releaseCar/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;


export const releaseCar = async (context: ReleaseCarContext) => {
    try{
        if(context.params?.id){
            const coche = await cocheCollection.findOne({_id: new ObjectId(context.params.id)})
            if(coche){
                if(coche.status){
                    context.response.status = 400;
                    context.response.body = {message: "Coche no ocupado"}
                }else{
                    await cocheCollection.updateOne({_id: coche._id}, {$set: {status: true}})
                    context.response.status = 200;
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