export interface Message {
  text: string;
}

export interface Thing {
  something: {
    somethingElse: string;
  };
}

export interface OtherThing {
  other: {
    thing: string;
  };
}
