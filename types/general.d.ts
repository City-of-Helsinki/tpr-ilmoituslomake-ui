export interface User {
  authenticated: boolean;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface OtherThing {
  other: {
    thing: string;
  };
}
