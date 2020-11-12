export interface NotificationValidation {
  name: {
    [key: string]: boolean;
  };
  description: {
    short: {
      [key: string]: boolean;
    };
    long: {
      [key: string]: boolean;
    };
  };
  address?: {
    fi?: {
      street?: boolean;
      postal_code?: boolean;
      post_office?: boolean;
    };
    sv?: {
      street?: boolean;
      postal_code?: boolean;
      post_office?: boolean;
    };
  };
  phone?: boolean;
  email?: boolean;
  website?: {
    fi?: boolean;
    sv?: boolean;
    en?: boolean;
  };
  price?: {
    fi?: boolean;
    sv?: boolean;
    en?: boolean;
  };
  payment_options?: {
    name?: boolean;
  }[];
  ontology_ids?: boolean;
  comments?: boolean;
  notifier?: {
    fullName?: boolean;
    email?: boolean;
    phone?: boolean;
  };
  photos?: {
    url?: boolean;
    description?: boolean;
    permission?: boolean;
    photographer?: boolean;
  }[];
}
