import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts"; 
import { postAddCoche } from "./resolvers/post.ts";
import { removeCar } from "./resolvers/delete.ts";
import { askCar, getCar } from "./resolvers/get.ts";
import { releaseCar } from "./resolvers/put.ts";

const router = new Router();

router
.post("/addCar", postAddCoche)
.delete("/removeCar/:id", removeCar)
.get("/car/:id", getCar)
.get("/askCar", askCar)
.put("/releaseCar/:id", releaseCar)


const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7070 });