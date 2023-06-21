import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { booksCollection, usersCollection } from "../db/mongo.ts";
import { BookSchema } from "../db/schema.ts";

type GetUserContext = RouterContext<
  "/getUser/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetBooksContext = RouterContext<
  "/getBooks",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getBooks = async (context: GetBooksContext) => {
  try {
    const page = context.request.url.searchParams.get('page');
    const title = context.request.url.searchParams.get('title');

    const paginas = await booksCollection.find({}).skip(Number(page) * 10).limit(10).toArray();
    const libros = await booksCollection.find({}).toArray();
    const titulos = await libros.find((book: BookSchema) => book.titulo === title);

    if(page){
      if(title){
        context.response.body = titulos;
        context.response.status = 200;
        return
      }
      context.response.body = paginas;
      context.response.status = 200;
    }else if(title){
      context.response.body = titulos;
      context.response.status = 200;
    }else{
      context.response.body = libros;
      context.response.status = 200;
    }
    
  } catch (error) {
    console.log(error);
    context.response.status = 500;
  }
}

export const getUser = async (context: GetUserContext) => {
    try{
        const id = context.params.id;
        const user = await usersCollection.findOne({_id: new ObjectId(id)});

        if(user){
          const userId = await usersCollection.findOne({_id: new ObjectId(id)});
          context.response.body = userId;
        }else{
          context.response.status = 404;
          context.response.body = {msg: "El usuario no existe"};
        }
    }catch(error){
        console.log(error);
        context.response.status = 500;
    }
}
