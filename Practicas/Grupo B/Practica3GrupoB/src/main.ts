import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts"; 
import { addAuthor, addBook, addUser } from "./resolvers/post.ts";
import { deleteUser } from "./resolvers/delete.ts";
import { updateCart } from "./resolvers/put.ts";
import { getBooks, getUser } from "./resolvers/get.ts";

const router = new Router();

router
.post("/addUser", addUser)
.post("/addAuthor", addAuthor)
.post("/addBook", addBook)
.delete("/deleteUser/:id", deleteUser)
.put("/updateCart", updateCart)
.get("/getUser/:id", getUser)
.get("/getBooks", getBooks);



const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });