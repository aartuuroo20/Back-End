import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { TransactionSchema, UserSchema } from "../db/schema.ts";
import { UsersCollection } from "../db/db.ts";
import { TransactionsCollection } from "../db/db.ts";
import { Transacciones } from "../types.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";

type PostTransactionContext = RouterContext<
    "/users/addTransaction",
    Record<string | number, string | undefined>,
    {
        ID_Sender : string,
        ID_Receiver : string,
        Amount : number
    }
>;

// Puedes realizar la transaccion tanto con el _id de mongo como con el ID del usuario
export const addTransaccion = async (context: PostTransactionContext) => {
  try {
      const result = context.request.body({ type: "json" });
      const value = await result.value;
      const sender = await UsersCollection.findOne({ ID: value.ID_Sender });
      const receiver = await UsersCollection.findOne({ ID: value.ID_Receiver });
      if (sender && receiver && sender._ID == receiver._ID && value.Amount > 0) {
          context.response.status = 200;
          context.response.body = { message: "Transacción realizada" };
          await TransactionsCollection.insertOne(value);
      } else if(await UsersCollection.findOne({ _id: new ObjectId(value.ID_Sender) }) && await UsersCollection.findOne({ _id: new ObjectId(value.ID_Receiver) }) && value.Amount > 0) {
          context.response.status = 200;
          context.response.body = { message: "Transacción realizada" };
          await TransactionsCollection.insertOne(value);
      } else {
          context.response.status = 404;
          context.response.body = { message: "No existe el usuario, o son los mismos o la cantidad es igual o inferior a 0" };
      }
      return context;
  } catch (error) {
      console.error(error);
      context.response.status = 500; 
  }
}
