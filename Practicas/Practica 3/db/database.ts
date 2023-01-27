import { MongoClient, Database} from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { AuthorSchema, BooksSchema, UserSchema } from "./schema.ts";
import { dotEnvConfig as config } from "../deps.ts"
import "https://deno.land/x/dotenv/load.ts";

config({ export: true });

const client = new MongoClient();

await client.connect({
  db: Deno.env.get('DB_NAME'),
  tls: true,
  servers: [
    {
      host: Deno.env.get('URL_MONGO'),
      port: Deno.env.get('PORT'),
    },
  ],
  credential: {
    username: Deno.env.get('USER_MONGO'),
    password: Deno.env.get('PASSWD_MONGO'),
    db: Deno.env.get('DB_NAME'),
    mechanism: "SCRAM-SHA-1",
  },
});

const db = client.database(Deno.env.get('DB_NAME'));
console.info("Mongodb connected");

console.info(`MongoDB ${db.name} connected`);

export const UserCollection = db.collection<UserSchema>("Users");
export const BooksCollection = db.collection<BooksSchema>("Books");
export const AuthorCollection = db.collection<AuthorSchema>("Author")