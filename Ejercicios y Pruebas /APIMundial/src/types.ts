export type equipo = {
    nombre: string,
    eliminado: boolean,
    jugadores: string[],
    golesFavor: number,
    golesContra: number,
    puntos: number,
    partidos: number //partido[]
}


export enum Status {
    not_started = "not_started",
    started = "started",
    finished = "finished"
}



export type partido = {
    id: string,
    equipo1: equipo,
    equipo2: equipo,
    golesEquipo1: number,
    golesEquipo2: number,
    estado: Status,
    time: number,
}