import { pathParse } from "https://deno.land/x/oak@v11.1.0/deps.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { DBRef, ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { BooksCollection, UserCollection } from "../db/database.ts";
import { BooksSchema, UserSchema } from "../db/schema.ts";


type GetBooksContext = RouterContext<
"/getBooks",
{
  ID: string;
} & Record<string | number, string | undefined>,
Record<string, any>
>;

type GetUserContext = RouterContext<
"/getUser/:id",
{
  id: string;
} & Record<string | number, string | undefined>,
Record<string, any>
>;


export const getBooks = async (context: GetBooksContext) => {
    try {
        const page = context.request.url.searchParams.get('page')
        const title = context.request.url.searchParams.get('title')

        if(page){
            const paginas = await BooksCollection.find().skip(Number(page) * 10).limit(10).toArray();
            const libros = await BooksCollection.find({}).toArray()
            const titulos = await libros.find((book: BooksSchema) => title === book.title)
            
            if(paginas){
                if(titulos){
                    if(paginas.find((book: BooksSchema) => title === book.title)){
                        context.response.body = titulos
                        context.response.status = 200
                    }else{
                        context.response.body = "No existe ese libro en esa pagina"
                        context.response.status = 404
                    }                
                }else{
                    context.response.body = paginas
                    context.response.status = 200
                }
            }else{
                context.response.body = "No existe el titulo ni las paginas"
                context.response.status = 400
            }
        }else{
            context.response.body = "Error has introducido mal la url"
            context.response.status = 404
        }    
    } catch (error) {
        console.log(error)
        context.response.status = 500
    }
}

export const getUser = async (context: GetUserContext) => {
    try {
        if(context.params?.id){
            const user: UserSchema | undefined = await UserCollection.findOne({
                _id: new ObjectId(context.params.id)
              });
              if (user) {
                context.response.body = user;
                context.response.status = 200
              } else{
                context.response.body = "No existe el usuario";
                context.response.status = 404;
              }
            } 

        }catch (error) {
        console.log(error)
        context.response.status = 500
    }
}