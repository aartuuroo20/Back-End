import { MongoClient, Database } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { CocheSchema } from "./schema.ts";
import { config } from "https://deno.land/x/dotenv@v1.0.1/mod.ts";

config({ export: true });

const client = new MongoClient();

await client.connect({
  db: Deno.env.get('DB_NAME')?.toString(),
  tls: true,
  servers: [
    {
      host: "ac-qlfnwbi-shard-00-02.ldcrudh.mongodb.net",
      port: 27017,
    },
  ],
  credential: {
    username: Deno.env.get('MONGO_USR'),
    password: Deno.env.get('MONGO_PWD'),
    db: Deno.env.get('DB_NAME'),
    mechanism: "SCRAM-SHA-1",
  },
});

const db = client.database(Deno.env.get('DB_NAME'));
console.info("Mongodb connected");

console.info(`MongoDB ${db.name} connected`);


export const cocheCollection = db.collection<CocheSchema>("Coches");