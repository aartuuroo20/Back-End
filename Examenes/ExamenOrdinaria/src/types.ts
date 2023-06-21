export type CharacterFromAPI = {
    id: string,
    name: string,
    status: string,
    species: string,
    type: string,
    gender: string,
    location: Info,
    origin: Info,
    image: string,
    url: string,
    episode: string[],
    created: string,
}

export type Info = {
    name: string,
    url: string,
}

export type LocationFromAPI = {
    id: string,
    name: string,
    type: string,
    dimension: string,
    residents: string[],
    url: string,
    created: string,
}

export type EpisodeFromAPI = {
    id: string,
    name: string,
    air_date: string,
    episode: string,
    characters: string[],
    url: string,
    created: string,
}