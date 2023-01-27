import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts"; 


import { deleteSlot } from "./resolvers/delete.ts";
import { availableSlot, doctorAppointments } from "./resolvers/get.ts";
import { addSlot } from "./resolvers/post.ts";
import { bookSlot } from "./resolvers/put.ts";

const router = new Router();

router
.post("/addSlot", addSlot)
.delete("/removeSlot", deleteSlot)
.get("/availableSlot", availableSlot)
.put("/bookSlot", bookSlot)
.get("/doctorAppointments/:id", doctorAppointments)

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });

