import { cocheCollection, concecionarioCollection, vendedorCollection } from "../db/mongo.ts";
import { CocheSchema, ConcecionarioSchema, VendedorSchema } from "../db/schema.ts";
import { ObjectId } from "mongo";

export const Query = {
    getVendedorID: async (_: unknown, args: { id: string }): Promise<VendedorSchema> => {
        try {
            if(!args.id) throw new Error("Faltan argumentos");
            const vendedor = await vendedorCollection.findOne({_id: new ObjectId(args.id)});
            if(!vendedor) throw new Error("El vendedor no existe");

            return {
                _id: vendedor._id,
                nombre: vendedor.nombre,
                numeroEmpleado: vendedor.numeroEmpleado,
                email: vendedor.email,
                coches: vendedor.coches
            }
            
        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener el vendedor");
        }
    },

    getVendedorNombre: async (_: unknown, args: { nombre: string }): Promise<VendedorSchema[]> => {
        try {
            if(!args.nombre) throw new Error("Faltan argumentos");
            const vendedores = await vendedorCollection.find({nombre: args.nombre});
            if(!vendedores) throw new Error("El vendedor no existe");

            return vendedores.map((vendedor: any) => {
                return {
                    _id: vendedor._id,
                    nombre: vendedor.nombre,
                    numeroEmpleado: vendedor.numeroEmpleado,
                    email: vendedor.email,
                    coches: vendedor.coches
                }
            })
            
        } catch (error) {
            console.log(error)
            throw new Error("Error al obtener el vendedor");
        }
    },

    getConcesionarioID: async (_: unknown, args: { id: string }): Promise<ConcecionarioSchema> => {
        try {
            if(!args.id) throw new Error("Faltan argumentos");
            const concesionario = await concecionarioCollection.findOne({_id: new ObjectId(args.id)});
            if(!concesionario) throw new Error("El concecionario no existe");

            return {
                _id: concesionario._id,
                ciudad: concesionario.ciudad,
                direccion: concesionario.direccion,
                numeroDireccion: concesionario.numeroDireccion,
                vendedores: concesionario.vendedores
            }

        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener el vendedor");
        }
    },

    getConcesinarios: async (_: unknown, args: { paginas: Number }): Promise<ConcecionarioSchema[]> => {
        try {
            const concesionarios = await concecionarioCollection.find().skip(Number(args.paginas) * 10).limit(10).toArray();
            if(!concesionarios) throw new Error("El concecionario no existe");

            return concesionarios.map((concesionario: any) => {
                return {
                    _id: concesionario._id,
                    ciudad: concesionario.ciudad,
                    direccion: concesionario.direccion,
                    numeroDireccion: concesionario.numeroDireccion,
                    vendedores: concesionario.vendedores
                }
            })
            
        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener el vendedor");
        }
    },

    getCocheID: async (_: unknown, args: { id: string }): Promise<CocheSchema> => {
        try {
            if(!args.id) throw new Error("Faltan argumentos");
            const coche = await cocheCollection.findOne({_id: new ObjectId(args.id)});
            if(!coche) throw new Error("El coche no existe");

            return {
                _id: coche._id,
                marca: coche.marca,
                precio: coche.precio,
                matricula: coche.matricula,
                sitios: coche.sitios
            }

        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener el vendedor");
        }
    },

    getCocheRangoPrecio: async (_: unknown, args: { min: Number, max: Number }): Promise<CocheSchema[]> => {
        try {
            if(!args.min || !args.max) throw new Error("Faltan argumentos");
            const coches = await cocheCollection.find({precio: {$gte: Number(args.min), $lte: Number(args.max)}}).toArray();
            if(!coches) throw new Error("El coche no existe");

            return coches.map((coche: any) => {
                return {
                    _id: coche._id,
                    marca: coche.marca,
                    precio: coche.precio,
                    matricula: coche.matricula,
                    sitios: coche.sitios
                }
            })
        } catch (error) {
            console.error(error);
            throw new Error("Error al obtener el vendedor");
        }
    }
    
}