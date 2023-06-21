import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { usersCollection } from "../db/mongo.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";


type RemoveUserContext = RouterContext<
  "/deleteUser/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const deleteUser = async (context: RemoveUserContext) => {
    try{
      const id = context.params.id;
      const user = await usersCollection.findOne({_id: new ObjectId(id)});

      if(!user){
        context.response.status = 404;
        context.response.body = {msg: "El usuario no existe"};
        return;
      }

      const deletedUser = await usersCollection.deleteOne({_id: new ObjectId(id)});
      context.response.body = deletedUser;
        
    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}