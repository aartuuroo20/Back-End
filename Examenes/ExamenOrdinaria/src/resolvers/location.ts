import { CharacterFromAPI, LocationFromAPI } from "../types.ts";



export const Location = { 
    residents: async (parent: LocationFromAPI): Promise<CharacterFromAPI>[] => {
        try {
            const characters: Promise<CharacterFromAPI>[] = parent.residents.map(async (character: CharacterFromAPI) => {
                const result = await fetch(character);
                const data: CharacterFromAPI = await result.json()
                return data
            }) 
            return characters
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
}