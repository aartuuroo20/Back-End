import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts"; 
import { addSlots } from "./resolvers/post.ts";
import { deleteSlot } from "./resolvers/delete.ts";
import { getSlots } from "./resolvers/get.ts";
import { updateSlot } from "./resolvers/put.ts";


const router = new Router();

router
.post("/addSlot", addSlots)
.delete("/removeSlot", deleteSlot)
.get("/availableSlots", getSlots)
.put("/bookSlot", updateSlot)

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });