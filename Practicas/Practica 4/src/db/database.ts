import { MongoClient, Database } from "mongo";
import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";
import { CocheSchema, ConcesionarioSchema, VendedorSchema } from "./schema.ts";


await config({ export: true, allowEmptyValues: true });

const client = new MongoClient();

await client.connect(
  `mongodb+srv://${Deno.env.get('MONGO_USR')}:${Deno.env.get('MONGO_PWD')}@${Deno.env.get('MONGO_URI')}/?authMechanism=SCRAM-SHA-1`,
);

const db = client.database(Deno.env.get('DB_NAME'));
console.info("Mongodb connected");

console.info(`MongoDB ${db.name} connected`);

//Librerias del proyecto

export const cocheCollection = db.collection<CocheSchema>("Coches");
export const vendedorCollection = db.collection<VendedorSchema>("Vendedores");
export const concesionarioCollection = db.collection<ConcesionarioSchema>("Concesionarios");
