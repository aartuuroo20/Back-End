import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { usersCollection } from "../db/mongo.ts";


type RemoveUserContext = RouterContext<
  "/deleteUser/:email",
  {
    email: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const removeUser = async (context: RemoveUserContext) => {
    try{
      const email = context.params.email;
      const user = await usersCollection.findOne({email: email});

      if(!user){
        context.response.status = 404;
        context.response.body = {msg: "El usuario no existe"};
        return;
      }

      const deletedUser = await usersCollection.deleteOne({email: email});
      context.response.body = deletedUser;
        
    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}