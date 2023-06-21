import { CharacterFromAPI, EpisodeFromAPI, LocationFromAPI } from "../types.ts";



export const Episode = { 
    characters: async (parent: EpisodeFromAPI): Promise<CharacterFromAPI>[] => {
        try {
            const characters: Promise<CharacterFromAPI>[] = parent.characters.map(async (character: CharacterFromAPI) => {
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