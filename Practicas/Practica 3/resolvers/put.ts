import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { BooksCollection, UserCollection } from "../db/database.ts";
import { BooksSchema, UserSchema } from "../db/schema.ts";



type PutUpdateCartContext = RouterContext<
"/updateCart",
Record<string | number, string | undefined>,
Record<string, any>
>;


export const updateCart = async (context: PutUpdateCartContext) => {
    try {
        const value = await context.request.body().value;
        if(!value?.id_user || !value?.id_book){
            context.response.status = 406
            return
        }

        const { id_user, id_book } = {
            id_book: value?.id_book,
            id_user: value?.id_user
        }

        const user = await UserCollection.findOne({ _id: new ObjectId(id_user)});
        const book = await BooksCollection.findOne({_id: new ObjectId(id_book)})

        if(!user || !book){
            context.response.body = "Usuario o libro no existente"
            context.response.status = 404
        }

        if(user && book){
            if(user.cart.find((book) => book === id_book)){
                context.response.body = "Libro ya en el carro del usuario"
                context.response.status = 400
            }else{
                await UserCollection.updateOne(
                    { _id: new ObjectId(id_user) },
                    {$push: { cart: id_book}}
                )
                context.response.status = 200;
            }
        }
    await UserCollection.updateOne(
            { _id: new ObjectId(id_user) },
            {$push: { cart: id_book}}
          )
          context.response.status = 200;
    } catch (error) {
        console.log(error)
        context.response.status = 500
    }
}
