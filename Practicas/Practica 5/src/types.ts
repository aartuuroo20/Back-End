import {ObjectId} from "mongo"

  export type User = {
    id: string,
    username: string,
    password?: string,
    idioma: string,
    token?: string,
    fechaCreacion: Date,
  }

  export type Message = {
    id: string,
    emisor: ObjectId,
    receptor: ObjectId,
    mensaje: string,
    fechaCreacion: Date,
  }