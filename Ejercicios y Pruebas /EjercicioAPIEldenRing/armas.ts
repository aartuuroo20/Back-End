type information = {
    success: boolean,
    count: number,
    total: number
}

type schema = {
    id: string,
    name: string,
    image: string,
    description: string,
    category: string,
    weight: number,
    attack: {name:string, amount: number},
    defence: {name:string, amount: number},
    requitedAttibutes: {name:string, amount: number},
    scalesWith: {name:string, scaling: number},
}

type data = {
    info: information,
    data: schema[]
}

const jsonResponseE = await fetch("https://eldenring.fanapis.com/api/weapons")
const jsonDataE: data = await jsonResponseE.json()


const handaxe = jsonDataE.data.filter((myboss) => myboss.name.includes("Hand Axe")).map((myboss) => {
    return {name: myboss.name, drescription: myboss.id}
  })

console.log(handaxe)