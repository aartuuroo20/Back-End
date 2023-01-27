import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { UsersCollection } from "../db/db.ts";
import { UserSchema } from "../db/schema.ts";


type DeleteUserContext = RouterContext<
  "/users/:email",
  {
    email: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const deleteUser = async (context: DeleteUserContext) => {
  try {
    if (context.params?.email) {
      const count = await UsersCollection.deleteOne({
        email: context.params.email,
      });
      if (count) {
        context.response.body = { message: "Usuario con mail " + context.params.email + " eliminado" };
        context.response.status = 200;
      } else {
        context.response.body = { message: "Usuario con mail " + context.params.email + " no encontrado" };
        context.response.status = 404;
      }
    }
  } catch (error) {
    console.log(error)
    context.response.status = 500
  }
   
  };