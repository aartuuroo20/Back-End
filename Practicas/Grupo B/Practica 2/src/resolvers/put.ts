import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
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
        
    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}