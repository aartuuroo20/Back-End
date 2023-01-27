import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts"; 
import { LogIn, postBook, SignIn } from "./resolvers/post.ts";
import authMiddleware from "./authmiddleware.ts";
import { auth } from "./resolvers/get.ts";


const router = new Router();

router
.post("/SignIn", SignIn)
.post("/LogIn", LogIn)
.post("/Book",postBook)
.get("/auth", authMiddleware, auth)

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
  });

await app.listen({ port: 7777 });
