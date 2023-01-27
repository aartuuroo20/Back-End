import { charactersCollection } from "../database.ts/database.ts";
import { Character, CharactersData } from "../types.ts";
import { ObjectId } from "mongo";


const fetchCharacters = async (
    page: number,
    name?: string
  ): Promise<CharactersData> => {
    const jsonResponse = await fetch("https://rickandmortyapi.com/api/character"); //Llama a la api y espera su respuesta
    const data = await jsonResponse.json();
    return data;
  };

  const fetchAllCharacters = async (name?: string): Promise<Character[]> => {
    const numberOfPages = (await fetchCharacters(1, name)).info.pages;
    const pageNumbers: number[] = [];
    for (let i = 1; i <= numberOfPages; i++) {
      pageNumbers.push(i);
    }
  
    const characters = await Promise.all(
      pageNumbers.map((page) => fetchCharacters(page, name))
    );
  
    const allCharacters = characters.flatMap((character) => character.results);
    return allCharacters;
  };


export const Query = {
   character: async (_: unknown, args: {id: string}): Promise<Character> => {
    try {
        if(!args.id) throw new Error("Falta el campo id")
        const personajes = await fetchAllCharacters()
        const personaje = personajes.find((personaje: Character) => personaje.id === parseInt(args.id))
        if(!personaje) throw new Error("Personaje no existente")

        return personaje
        
    } catch (e) {
        console.log(e)
        throw new Error(e);
    }
   },
   //Para introducir los datos en formato array por charactersByIds(ids: [1,2]) y los datos a sacar
   charactersByIds: async (_: unknown, args: {ids: string[]}): Promise<Character[]> => {
    try {
        if(!args.ids)  throw new Error("Falta el campos id")
        if(args.ids.length === 0) throw new Error("Array de ids vacio")
        const personajes = await fetchAllCharacters()
        let elecciones: Character[] = []
        
        personajes.filter((personaje: Character) => {
            for(let i=0; i<=args.ids.length; i++){
                if(personaje.id === parseInt(args.ids[i])){
                    const comprobar = elecciones.find((aux: Character) => aux.id === personaje.id)
                    if(comprobar){
                        break
                    }else{
                        elecciones.push(personaje)

                    }
                }
            }
        })  
        
        return elecciones.map((personaje: Character) => ({...personaje}))
    } catch (e) {
        console.log(e)
        throw new Error(e);
    }
   }
   
    
}