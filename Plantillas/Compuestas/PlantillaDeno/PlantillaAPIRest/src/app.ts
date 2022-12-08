import { Db } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { connectDB } from "./mongo.ts";
import {Application,Router} from "https://deno.land/x/oak/mod.ts";
import { signin, status, login,logout } from "./resolvers.ts";
let username:string="unknown"
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { createBodyParser, JsonBodyParser,IBodyParserOptions } from "https://deno.land/x/body_parser@v0.0.1/mod.ts";


const run = async () => {
  const db: Db = await connectDB();
  config()
  const port = parseInt(Deno.env.get("PORT"));
  const app = new Application();
  const router= new Router();
 

  app.use(async(ctx, next) => {
    await next();
  });

  app.use(ctx=>{
    ctx.request.db=db;
  })
  
  /*const bodyParser = createBodyParser();
  app.use(bodyParser.json());
  app.use(bodyParser.text());
  app.use(bodyParser.urlencoded({ extended: true }))*/
  router.get("/status", status);
  router.post("/signin", signin);
  router.post("/login", login);
  router.post("/logout", logout);
  app.use(router.routes());
  app.use(router.allowedMethods());
  await app.listen({ port : 3000 });
  console.log(`Server running on port ${Deno.env.get("PORT")}`);
};

try {
  run();
} catch (e) {
  console.error(e);
}
