import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts"; 
import { addTransaction, addUser } from "./resolvers/post.ts";
import { getUser } from "./resolvers/get.ts";
import { removeUser } from "./resolvers/delete.ts";

const router = new Router();

router
.post("/addUser", addUser)
.get("/getUser/:parametro", getUser)
.delete("/deleteUser/:email", removeUser)
.post("/addTransaction", addTransaction)


const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });