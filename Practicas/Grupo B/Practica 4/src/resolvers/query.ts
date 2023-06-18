import { cocheCollection, concesionarioCollection, vendedorCollection } from "../db/database.ts";
import { Coche, Concesionario, Vendedor } from "../types.ts";
import { ObjectId } from "mongo";
import { CocheSchema, VendedorSchema } from "../db/schema.ts";
import { argsToArgsConfig } from "https://deno.land/x/graphql_deno@v15.0.0/lib/type/definition.d.ts";




export const Query = {
    //Funciona
    getCochesMatricula: async (_:unknown, args: {matricula: String}): Promise<Coche | null> => {
        try {
            const coche = await cocheCollection.findOne((coche: Coche) => coche.matricula === args.matricula);
            if(coche) return {...coche};
            else return null;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }

    },

    //Funciona  
    getCochesPrecio: async (_:unknown, args: {max: Number, min: Number}): Promise<Coche | null> => {
        try {
            const coche = await cocheCollection.find({$and: [
                {"precio": {$lt: args.max} }, 
                {"precio": {$gt: args.min} }
            ]}).toArray();
            return coche.map((coche: Coche) => ({...coche}));
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },

    //Funciona
    getVendedorNumeroEmpleado: async (_: unknown, args: {id: String}): Promise<Vendedor | null> => {
        try {
            const vendedor = await vendedorCollection.findOne({numeroEmpleado: args.id});
            if(vendedor) return {...vendedor};
            else return null;
        } catch (error) {
            console.log(error);
            throw new Error(error);   
        }
    },

    //Funciona
    getVendedoresNombre: async (_: unknown, args: {nombre: String}): Promise<Vendedor | null> => {
        try {
            const vendedor = await vendedorCollection.find({nombre: args.nombre}).toArray();
            return vendedor.map((vendedor: Vendedor) => ({...vendedor}));


        } catch (error) {
            console.log(error);
            throw new Error(error);   
        }
    },

    //Funciona
    getConcesionario: async (_: unknown, args: {id: String}): Promise<Concesionario |null> => {
        try{
            
            const concesionario = await concesionarioCollection.findOne({_id: new ObjectId(args.id)})

            if(concesionario) return {...concesionario};                
            else return null;

        }catch(error){
            console.log(error);
            throw new Error(error);   
        }
    },

    //Funciona
    getConcesionarios: async (_: unknown, args: {paginas: Number}): Promise<Concesionario | null> => {
        try {
            const concesionarios = await concesionarioCollection.find().skip(Number(args.paginas) * 10).limit(10).toArray();
            if(concesionarios) return concesionarios.map((concesionario: Concesionario) => ({...concesionario}));
            else return null;
            
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }



    

}