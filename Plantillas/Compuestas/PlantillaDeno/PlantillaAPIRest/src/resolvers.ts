import { Request, Response } from "https://deno.land/x/oak/mod.ts"; 
import { Db } from "https://deno.land/x/mongo@v0.31.1/mod.ts";;
import * as uuid from "https://deno.land/std@0.155.0/uuid/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
const checkDateValidity = (
  day: string,
  month: string,
  year: string
): boolean => {
  const date = new Date(`${month} ${day}, ${year}`);
  return date.toString() !== "Invalid Date";
};

export const status = async (ctx:any) => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  ctx.response.status=200;
  ctx.response.body=(`${day}-${month}-${year}`);
};

export const signin = async (ctx:any) => {

  const db: Db = ctx.request.app.get("db");
  const collection = db.collection("Users");
  if (!ctx.request.body) {
    ctx.response.status=500;
    ctx.response.body=({ error: "No params" });
    return ctx.response;
 
  }

  const { username, password } = ctx.request.body as {
    username: string;
    password: string;
  }

  if (!username || !password) {
    console.log(ctx.request.body)
    ctx.response.status=500;
    ctx.response.body=({ error: "No username or password" });
    return ctx.response;
  }
  const user = await collection.findOne({ username });
  if (user) {
    ctx.response.status=409;
    ctx.response.body=({ error: "User already exists" });
    return ctx.response;
  } else {
    await collection.insertOne({ username, password:bcrypt.hashSync(password, 10), token:null });
    ctx.response.status=200;
    ctx.response.body=({ message: "User created" });
    return ctx.response;
  }
}
export const login = async (req: Request, res: Response) => {

  const db: Db = req.app.get("db");
  const collection = db.collection("Users");
  if (!req.query) {
    return res.status(500).send("No params");
  }

  const { username, password } = req.body as {
    username: string;
    password: string;
  }

  if (!username || !password) {
    return res.status(500).send("No username or password");
  }
  const user = await collection.findOne({ username});
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      if(user.token!=null){
      res.status(500).send(`Already logged in, your token is ${user.token}`)
    } else {
      const token = uuid();
      await collection.updateOne({ username }, { $set: { token:token } });

      return res.status(200).send(`Logged in ${token}`);
    }
  }
  } else {
    return res.status(401).send("Incorrect username or password");
  }
}

export const logout = async (req: Request, res: Response) => {

  const db: Db = req.app.get("db");
  const collection = db.collection("Users");
  if (!req.query) {
    return res.status(500).send("No params");
  }
  const active = await collection.findOne({ token:req.headers.token });
  if (active) {
    await collection.updateOne({token:req.headers.token},{$set:{ token:null} });
    return res.status(200).send(`Logged out ${active.username}`);
  } else {
    return res.status(401).send(`This user is not active or not found`);
  }
}

