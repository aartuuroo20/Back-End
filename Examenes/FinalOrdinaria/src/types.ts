enum Status {
    alive = "Alive",
    death = "Death",
    unknown = "Unknown",
  }

  enum Gender {
    male = "Male",
    female = "Female",
    unknown = "Unknown",
  }

  type Loc = {
    name: string;
    url: string;
  };

  type Info = {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };

export type Character = {
    id: number;
    name: string;
    status: Status;
    species: string;
    type: string;
    gender: Gender;
    origin: Loc;
    location: Loc;
    image: string;
    episode: string[];
    url: string;
    created: string;
}

export type CharactersData = {
    info: Info;
    results: Character[];
  };


  export type episode = {
    id: string,
    name: string,
    air_date: string,
    characters: Character[],
    created: string
  }