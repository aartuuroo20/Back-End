import { ObjectId } from "mongo"
import { cocheCollection, concecionarioCollection, vendedorCollection } from "../db/mongo.ts";
import { CocheSchema, ConcecionarioSchema, VendedorSchema } from "../db/schema.ts";


export const Mutation = {
    addVendedor: async (_: unknown, args: { nombre: string, numeroEmpleado: string, email: string, concesionario: string }): Promise<VendedorSchema> => {
        try {
            if(!args.nombre || !args.numeroEmpleado || !args.email || !args.concesionario) throw new Error("Faltan argumentos");
            const comprobarVendedor = await vendedorCollection.findOne({numeroEmpleado: args.numeroEmpleado, email: args.email});
            if(comprobarVendedor) throw new Error("El vendedor ya existe");

            const newVendedor: ObjectId = await vendedorCollection.insertOne({nombre: args.nombre, numeroEmpleado: args.numeroEmpleado, email: args.email, coches: []});

            await concecionarioCollection.updateOne({_id: new ObjectId(args.concesionario)}, {$push: {vendedores: newVendedor}});

            return {
                _id: newVendedor,
                nombre: args.nombre,
                numeroEmpleado: args.numeroEmpleado,
                email: args.email,
                coches: []
            }
        } catch (error) {
            console.error(error);
            throw new Error("Error al añadir el vendedor");
        }

    },

    addCoche: async (_: unknown, args: { marca: string, precio: number, matricula: string, sitios: number, vendedor: string }): Promise<CocheSchema> => {
        try {
            if(!args.marca || !args.precio || !args.matricula || !args.sitios || !args.vendedor) throw new Error("Faltan argumentos");
            const comprobarCoche = await cocheCollection.findOne({matricula: args.matricula});
            if(comprobarCoche) throw new Error("El coche ya existe");

            const newCoche: ObjectId = await cocheCollection.insertOne({marca: args.marca, precio: args.precio, matricula: args.matricula, sitios: args.sitios});

            await vendedorCollection.updateOne({_id: new ObjectId(args.vendedor)}, {$push: {coches: newCoche}});

            return {
                _id: newCoche,
                marca: args.marca,
                precio: args.precio,
                matricula: args.matricula,
                sitios: args.sitios
            }
            
        } catch (error) {
            console.error(error);
            throw new Error("Error al añadir el coche");
        }
    },

    addConcecionario: async (_: unknown, args: { ciudad: string, direccion: string, numeroDireccion: number }): Promise<ConcecionarioSchema> => {
        try {
            if(!args.ciudad || !args.direccion || !args.numeroDireccion) throw new Error("Faltan argumentos");
            const comprobarConcecionario = await concecionarioCollection.findOne({ciudad: args.ciudad, direccion: args.direccion, numeroDireccion: args.numeroDireccion});
            if(comprobarConcecionario) throw new Error("El concecionario ya existe");

            const newConcecionario: ObjectId = await concecionarioCollection.insertOne({ciudad: args.ciudad, direccion: args.direccion, numeroDireccion: args.numeroDireccion, vendedores: []});

            return{
                _id: newConcecionario,
                ciudad: args.ciudad,
                direccion: args.direccion,
                numeroDireccion: args.numeroDireccion,
                vendedores: []
            }

        } catch (error) {
            console.error(error);
            throw new Error("Error al añadir el concecionario");
        }
    },

    addCocheToVendedor: async (_: unknown, args: { vendedorId: string, cocheId: string }): Promise<VendedorSchema> => {
        try {
            if(!args.vendedorId || !args.cocheId) throw new Error("Faltan argumentos");
            const comprobarVendedor = await vendedorCollection.findOne({_id: new ObjectId(args.vendedorId)});
            if(!comprobarVendedor) throw new Error("El vendedor no existe");
            const comprobarCoche = await cocheCollection.findOne({_id: new ObjectId(args.cocheId)});
            if(!comprobarCoche) throw new Error("El coche no existe");

            await vendedorCollection.updateOne({_id: new ObjectId(args.vendedorId)}, {$push: {coches: new ObjectId(args.cocheId)}});

            const eliminarVendedor = await vendedorCollection.findOne({_id: new ObjectId(args.vendedorId), coches: {_id: new ObjectId(args.cocheId)}});
            if(eliminarVendedor){
                await vendedorCollection.updateOne({_id: eliminarVendedor._id}, {$pull: {coches: new ObjectId(comprobarCoche._id)}});
            }

            return {
                _id: new ObjectId(args.vendedorId),
                nombre: comprobarVendedor.nombre,
                numeroEmpleado: comprobarVendedor.numeroEmpleado,
                email: comprobarVendedor.email,
                coches: comprobarVendedor.coches
            }
        } catch (error) {
            console.error(error);
            throw new Error("Error al añadir el coche al vendedor");
        }
    },

    addVendedorToConcecionario: async (_: unknown, args: { concecionarioId: string, vendedorId: string }): Promise<ConcecionarioSchema> => {
        try {
            if(!args.concecionarioId || !args.vendedorId) throw new Error("Faltan argumentos");
            const comprobarConcecionario = await concecionarioCollection.findOne({_id: new ObjectId(args.concecionarioId)});
            if(!comprobarConcecionario) throw new Error("El concecionario no existe");
            const comprobarVendedor = await vendedorCollection.findOne({_id: new ObjectId(args.vendedorId)});
            if(!comprobarVendedor) throw new Error("El vendedor no existe");

            await concecionarioCollection.updateOne({_id: new ObjectId(args.concecionarioId)}, {$push: {vendedores: new ObjectId(args.vendedorId)}});

            const eliminarConcecionario = await concecionarioCollection.findOne({_id: new ObjectId(args.concecionarioId), vendedores: {_id: new ObjectId(args.vendedorId)}});
            if(eliminarConcecionario){
                await concecionarioCollection.updateOne({_id: eliminarConcecionario._id}, {$pull: {vendedores: new ObjectId(comprobarVendedor._id)}});
            }

            return {
                _id: new ObjectId(args.concecionarioId),
                ciudad: comprobarConcecionario.ciudad,
                direccion: comprobarConcecionario.direccion,
                numeroDireccion: comprobarConcecionario.numeroDireccion,
                vendedores: comprobarConcecionario.vendedores
            }
            
        } catch (error) {
            console.error(error);
            throw new Error("Error al añadir el vendedor al concecionario");
        }
    }
    
}