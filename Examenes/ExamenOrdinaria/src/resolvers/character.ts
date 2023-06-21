import { CharacterFromAPI, EpisodeFromAPI } from "../types.ts";
import { LocationFromAPI } from "../types.ts";



export const Character = { 
    location: async (parent: CharacterFromAPI): Promise<LocationFromAPI> => {
        try{
            const result = await fetch(parent.location.url)
            const data: LocationFromAPI = await result.json()
            return data
        }catch(error){
            console.log(error);
            throw error;
        }
    },

    origin: async (parent: CharacterFromAPI): Promise<LocationFromAPI> => {
        try {
            const result = await fetch(parent.origin.url)
            const data: LocationFromAPI = await result.json()
            return data
        } catch (error) {
            console.log(error)
            throw error;
        }
    },

    episode: async (parent: CharacterFromAPI): Promise<EpisodeFromAPI>[] => {
        try {
            const episodes: Promise<EpisodeFromAPI>[] = parent.episode.map(async (episode: EpisodeFromAPI) => {
                const result = await fetch(episode);
                const data: EpisodeFromAPI = await result.json()
                return data
            }) 
            return episodes
            
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
}