import { MongoClient, Database} from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { TransactionSchema, UserSchema } from "./schema.ts";
import { dotEnvConfig as config } from "../deps.ts"

config({ export: true });

const client = new MongoClient();

await client.connect({
  db: Deno.env.get('DB_NAME')?.toString() || 'Banco',
  tls: true,
  servers: [
    {
      host: "ac-qlfnwbi-shard-00-02.ldcrudh.mongodb.net",
      port: 27017,
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

export const UsersCollection = db.collection<UserSchema>("Users");
export const TransactionsCollection = db.collection<TransactionSchema>("Transactions");