import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts"; 
import { UserCollection } from "./db/database.ts";
import { deleteUser } from "./resolvers/delete.ts";
import { getBooks, getUser } from "./resolvers/get.ts";
import { addAuthor, addBook, addUser } from "./resolvers/post.ts";
import { updateCart } from "./resolvers/put.ts";


const router = new Router();

router
.post("/addUser", addUser) //Añade un usuario
.post("/addAuthor", addAuthor) //Añade un autor
.post("/addBook", addBook) //Añade un libro 
.delete("/deleteUser/:id", deleteUser) //Elimina un usuario por id de mongo
.get("/getBooks", getBooks) //Devuelve libros por paginas y titulos 
.get("/getUser/:id", getUser) //Devuelve un usuario por id de mongo
.put("/updateCart", updateCart)


const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });