export type Users = {
    DNI: string,
    nombre: string,
    apellido: string,
    telefono: string,
    email: string,
    IBAN: string,
    ID: string,
}

export type Transacciones = {
    ID_Sender: string,
    ID_Receiver: string,
    Amount: number,
}