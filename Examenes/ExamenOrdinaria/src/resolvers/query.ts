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

/*Solucion mediante API Rest
type GetCharacterContext = RouterContext<
  "/getCharacter/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

type GetCharactersContext = RouterContext<
  "/getCharacters/:id",
  {
    id: string;
  } & Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getCharacter = async (context: GetCharacterContext) => {
    try {
        if(!context.params.id){
            context.response.status = 400;
            return;
        }

        const response = await fetch(`https://rickandmortyapi.com/api/character/${context.params.id}`);
        const data = await response.json();
        context.response.body = data;
        
    } catch (error) {
        console.log(error);
        context.response.status = 500;
    }
}

export const getCharacters = async (context: GetCharactersContext) => {
    try {
        if(!context.params.id){
            context.response.status = 400;
            return;
        }

        const ids = context.params.id.split(',');
        const Characters = await Promise.all(ids.map(async (id) => {
            const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
            const data = await response.json();
            return data;
        }));

        context.response.body = Characters;
        
    } catch (error) {
        console.log(error);
        context.response.status = 500;
    }
}


*/