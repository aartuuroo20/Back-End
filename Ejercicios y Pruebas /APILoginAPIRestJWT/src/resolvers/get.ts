import { Context } from "https://deno.land/x/oak/mod.ts";

export const auth = (ctx: Context) => {
    ctx.response.body = 'Auth succed'
}