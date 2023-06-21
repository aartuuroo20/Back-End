import { Character } from "../types.ts";

export const Query = {
    character: async (_: unknown, agrs: {id: string}): Promise<Character> => {
        try {
            if(!agrs.id) throw new Error("No id provided");
            const res = await fetch(`https://rickandmortyapi.com/api/character/${agrs.id}`);
            const results  = await res.json();
            return results;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    charactersByIds: async (_: unknown, agrs: {ids: string[]}): Promise<Character>[] => {
        try {
            if(!agrs.ids) throw new Error("No ids provided");
            const Characters: Promise<Character>[] = agrs.ids.map(async (id: string) => {
                const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
                const results  = await res.json();
                return results;
            });
            return Characters;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
}