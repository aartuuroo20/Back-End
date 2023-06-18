

export type Users = {
    id: string,
    dni: string,
    nombre: string,
    apellidos: string,
    telefono: string,
    email: string,
    iban: string,
}

export type Transactions = {
    id: string,
    id_sender: string,
    id_receiver: string,
    amount: number,
}