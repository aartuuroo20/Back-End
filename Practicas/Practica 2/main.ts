import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts"; 
import { addUser } from "./resolvers/post.ts";
import { getUser } from "./resolvers/get.ts";
import { deleteUser } from "./resolvers/delete.ts";
import { addTransaccion } from "./resolvers/transactions.ts";

const router = new Router();

router
.get("/users/:ID", getUser)
.post("/users", addUser)
.post("/users/addTransaction", addTransaccion)
.delete("/users/:email", deleteUser);


const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });