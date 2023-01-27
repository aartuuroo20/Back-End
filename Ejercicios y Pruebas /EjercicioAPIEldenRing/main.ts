type information = {
  success : boolean,
  count : number,
  total : number
}

type boss = {
  id : string,
  name : string,
  image : string,
  region : string,
  description : string,
  location : string,
  drops : string[],
  healthPoint : string
}

type bossData = {
  information : information,
  data : boss[];
}

const jsonResponseE = await fetch("https://eldenring.fanapis.com/api/bosses");
const jsonDataE : bossData = await jsonResponseE.json();

const Kindreds = jsonDataE.data.filter((myboss) => myboss.name.includes("Abductor Virgins")).map((myboss) => {
  return {name: myboss.name, drescription: myboss.description}
})

console.log(Kindreds)