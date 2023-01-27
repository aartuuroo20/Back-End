import { cocheCollection, concesionarioCollection, vendedorCollection } from "../db/database.ts";
import { CocheSchema, ConcesionarioSchema, VendedorSchema } from "../db/schema.ts";
import { Coche, Concesionario, Vendedor } from "../types.ts";
import { ObjectId } from "mongo";


export const Mutation = {
    //Funciona
    crearVendedor: async (_: any, args: {nombre: String, numeroEmpleado: String, email: String, concesionario?: Concesionario, coches?: Coche[] | undefined}): Promise<Vendedor> => {
        try {
            const exist = await vendedorCollection.findOne({numeroEmpleado: args.numeroEmpleado});
            if(exist) throw new Error("El vendedor ya existe");
            if(!args.nombre || !args.email || !args.numeroEmpleado) throw new Error("El nombre, email y numero de empleado son obligatorios");
            
            const vendedor: VendedorSchema = await vendedorCollection.insertOne({
                nombre: args.nombre,
                numeroEmpleado: args.numeroEmpleado,
                email: args.email,
                coches: []
            })
                
            await concesionarioCollection.updateOne(
                { _id: new ObjectId(args.concesionario) },
                { $push: { vendedores: vendedor} }
            );

            return {
                nombre: args.nombre,
                numeroEmpleado: args.numeroEmpleado,
                email: args.email,
                coches: []
            }
        } catch (error) {
            console.log(error);
            throw new Error(error);   
        }
            
    },
    //Funciona
    crearCoche: async (_: any, args: {marca: String, precio: Number, matricula: String, sitios: Number, vendedor?: Vendedor}): Promise<Coche> => {
        try {
            const exist = await cocheCollection.findOne({matricula: args.matricula});
            if(exist) throw new Error("El coche ya existe");
            if(!args.marca || !args.precio || !args.matricula || !args.sitios) throw new Error("La marca, precio, matricula y sitios son obligatorios");


            const coche: CocheSchema = await cocheCollection.insertOne({
                marca: args.marca,
                precio: args.precio,
                matricula: args.matricula,
                sitios: args.sitios,
            })

            await vendedorCollection.updateOne(
                { _id: new ObjectId(args.vendedor) },
                { $push: { coches: coche } }
            );

            return {
                marca: args.marca,
                precio: args.precio,
                matricula: args.matricula,
                sitios: args.sitios,
            }    
 
        } catch (error) {
            console.log(error);
            throw new Error(error);   
        }
    },

    //Funciona
    crearConcesionario: async (_: any, args: {ciudad: String, direccion: String, numeroDireccion: number, vendedores?: Vendedor[] | undefined}): Promise<Concesionario> => {
        try {
            const exist = await concesionarioCollection.findOne({direccion: args.direccion});
            const exist2 = await concesionarioCollection.findOne({numeroDireccion: args.numeroDireccion});
            if(exist && exist2) throw new Error("El concesionario ya existe en esa direccion y numero de direccion");
            if(!args.ciudad || !args.direccion || !args.numeroDireccion) throw new Error("La ciudad, direccion y numero de direccion son obligatorios");

            const concesionario: ConcesionarioSchema = await concesionarioCollection.insertOne({
                ciudad: args.ciudad,
                direccion: args.direccion,
                numeroDireccion: args.numeroDireccion,
                vendedores: []
            })

            return {
                ciudad: args.ciudad,
                direccion: args.direccion,
                numeroDireccion: args.numeroDireccion,
                vendedores: []
            }


        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },
    
    //Funciona
    actualizarCocheVendedor: async (_: any, args: {coche: String, vendedor: String}) => {
        try {
            if(!args.coche || !args.vendedor) throw new Error("La matricula y el vendedor son obligatorios");
            const coche: CocheSchema = await cocheCollection.findOne({_id: new ObjectId(args.coche)});
            if(!coche) throw new Error("No existe el coche");
            const vendedor: VendedorSchema = await vendedorCollection.findOne({_id: new ObjectId(args.vendedor)});
            if(!vendedor) throw new Error("No existe el vendedor");

            //Buscar si el vendedor ya contiene el coche
            const cocheVendedor = vendedor.coches.find((c: Coche) => c.matricula == coche.matricula);
            if(cocheVendedor) throw new Error("El coche ya esta en ese vendedor");

            const vendedorAnterior = await vendedorCollection.findOne((c: Coche) => coche.matricula === new ObjectId(args.coche).matricula);   

            await concesionarioCollection.updateOne(
                { _id: vendedorAnterior._id },
                { $pull: { coches: new ObjectId(coche._id)}}
            );
            
            await vendedorCollection.updateOne(
                { _id: new ObjectId(args.vendedor) },
                { $push: { coches: new ObjectId(coche._id)}}
            );

            return {
                nombre: vendedor.nombre,
                numeroEmpleado: vendedor.numeroEmpleado,
                email: vendedor.email,
                coches: vendedor.coches
            }

        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },
    //Funciona
    actualizarVendedorConcesionario: async (_: any, args: {empleado: String, concesionario: String}) => {
        try {
            if(!args.empleado || !args.concesionario) throw new Error("El vendedor y el concesionario son obligatorios");
            const vendedor = await vendedorCollection.findOne({_id: new ObjectId(args.empleado)});
            if(!vendedor) throw new Error("No existe el vendedor");
            const concesionario: ConcesionarioSchema = await concesionarioCollection.findOne({_id: new ObjectId(args.concesionario)});
            if(!concesionario) throw new Error("No existe el concesionario");
            const vendedorConcesionario = concesionario.vendedores.find((vendedor: Vendedor) => vendedor.numeroEmpleado == new ObjectId(args.empleado).numeroEmpleado);
            if(vendedorConcesionario) throw new Error("El vendedor ya esta en ese concesionario");

            const concesionarioAnterior = await concesionarioCollection.findOne((v: Concesionario) => vendedor.numeroEmpleado === new ObjectId(args.empleado).numeroEmpleado);   

            await concesionarioCollection.updateOne(
                { _id: concesionarioAnterior._id },
                { $pull: { vendedores: new ObjectId(vendedor._id)}}
            );


            await concesionarioCollection.updateOne(
                { _id: new ObjectId(args.concesionario) },
                { $push: { vendedores: new ObjectId(vendedor._id)} }
            );

            return {
                ciudad: concesionario.ciudad,
                direccion: concesionario.direccion,
                numeroDireccion: concesionario.numeroDireccion,
                vendedores: concesionario.vendedores
            }
            
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
    
    
    
}