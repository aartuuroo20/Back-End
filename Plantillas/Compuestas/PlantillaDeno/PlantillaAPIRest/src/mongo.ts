import { Db, MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";;
import { config } from "https://deno.land/x/dotenv/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

config()
export const connectDB = async (): Promise<Db> => {

  const dbName = Deno.env.get("DB_NAME");
  const usr = Deno.env.get("DB_USR");
  const pwd = Deno.env.get("DB_PWD");
  const mongouri: string =   `mongodb+srv://${usr}:${pwd}@cluster0.6xzff.mongodb.net/${dbName}?authMechanism=SCRAM-SHA-1`//`  mongodb+srv://${usr}:${pwd}@cluster0.6xzff.mongodb.net/${dbName}?retryWrites=true&w=majority`;



  const client = new MongoClient();

  try {
    await client.connect(mongouri);
    console.info("MongoDB connected");

    return client.database(dbName);
  } catch (e) {
    throw e;
  }
};
