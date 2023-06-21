import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { booksCollection, usersCollection } from "../db/mongo.ts";


type UpdateCartContext = RouterContext<
  "/updateCart",
  Record<string | number, string | undefined>,
  Record<string, any>
>;


export const updateCart = async (context: UpdateCartContext) => {
    try{
      const result = context.request.body({ type: "json" });
      const value = await result.value;
      if(!value?.id_book || !value?.id_user){
          context.response.status = 400;
          context.response.body = {msg: "Faltan datos"};
          return;
      }

      const user = await usersCollection.findOne({_id: new ObjectId(value.id_user)});
      const book = await booksCollection.findOne({_id: new ObjectId(value.id_book)});

      if(!user){
          context.response.status = 404;
          context.response.body = {msg: "El usuario no existe"};
          return;
      }

      if(!book){
          context.response.status = 404;
          context.response.body = {msg: "El libro no existe"};
          return;
      }

      const comprobarLibro = await usersCollection.findOne({_id: new ObjectId(value.id_user), cart: value.id_book});
      if(comprobarLibro){
          context.response.status = 400;
          context.response.body = {msg: "El libro ya está en el carrito"};
          return;
      }

      const updatedUser = await usersCollection.updateOne({_id: new ObjectId(value.id_user)}, {$push: {cart: value.id_book}});
      context.response.body = updatedUser;

    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}