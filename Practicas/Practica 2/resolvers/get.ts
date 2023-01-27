import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { UsersCollection } from "../db/db.ts";
import { UserSchema } from "../db/schema.ts";

type GetUsersContext = RouterContext<
  "/users/:ID",
  {
    ID: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;


export const getUser = async (context: GetUsersContext) => {
  try {
    console.log(context.params.ID);
    
  if (context.params?.ID) {
    const user: UserSchema | undefined = await UsersCollection.findOne({
      ID: context.params.ID,
    });

    if (user) {
      context.response.body = user;
      return;
    } else{
      context.response.body = "No existe el usuario";
      context.response.status = 500;
    }
  } 

  context.response.status = 404;
    
  } catch (error) {
    console.log(error)
    context.response.status = 500
  }
  
};