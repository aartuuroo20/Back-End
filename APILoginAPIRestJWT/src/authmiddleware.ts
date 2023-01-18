import { Context } from "https://deno.land/x/oak/mod.ts";
import { validate } from "https://deno.land/x/djwt/mod.ts";
import { Header } from "jwt";

const header: Header = {
  alg: "HS256",
};


const authMiddleware = async (ctx: Context, next: any) => {
  const jwtToken: string = ctx.request.headers.get('Authorization') 
    ? ctx.request.headers.get('Authorization')! : '';
  const key: string  = Deno.env.get('JWT_SECRET')!
  const isValid = await validate(jwtToken, key, { isThrowing: false })
  console.log(jwtToken)
  if(!isValid){
    ctx.response.body = {msg: 'Unauthorized'}
    ctx.response.status = 401
    return
  }                                                                                                                                 
  await next()
  
}

export default authMiddleware;

