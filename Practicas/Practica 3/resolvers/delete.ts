import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { UserCollection } from "../db/database.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";




type DeleteUserContext = RouterContext<
"/deleteUser/:id",
{
  id: string;
} & Record<string | number, string | undefined>,
Record<string, any>
>;

export const deleteUser = async (context: DeleteUserContext) => {
    try {
      const result = await context.request.body({type:"json"})
          const value = await result.value; //data in json format
          const {_id} = {
              _id: value?._id,
          }

          const count = await UserCollection.deleteOne({
             _id: new ObjectId(context.params.id),
          });

          if (count) {
              context.response.body = { message: "Usuario con id " + context.params.id + " eliminado" };
              context.response.status = 200;
            } else {
              context.response.body = { message: "Usuario con id " + context.params.id + " no encontrado" };
              context.response.status = 404;
            }
          
    } catch (error) {
        console.log(error)
        context.response.status = 500
    }
}