import { NextApiRequest, NextApiResponse } from "next";

// NOTE: this is used for mock translation test data only
// This can be removed after the backend has been implemented

const handler = (req: NextApiRequest, res: NextApiResponse): void => {
  res.status(200).json({
    id: 2,
    requestId: 1,
    request: "05.07.2021",
    language: {
      from: "en",
      to: "zh",
    },
    message: "test",
    target: {
      id: 2,
      published: true,
      location: {
        type: "Point",
        coordinates: [24.9409737, 60.1675352],
      },
      data: {
        name: {
          en: "test 2",
          fi: "test 2",
          sv: "test 2",
        },
        email: "a@b.c",
        phone: "123",
        images: [],
        address: {
          fi: {
            street: "mannerheimintie 10",
            post_office: "helsinki",
            postal_code: "00100",
            neighborhood: "Kamppi",
            neighborhood_id: "91-004",
          },
          sv: {
            street: "",
            post_office: "",
            postal_code: "",
            neighborhood: "",
            neighborhood_id: "",
          },
        },
        website: {
          en: "http://www.fi",
          fi: "http://www.fi",
          sv: "http://www.fi",
        },
        comments: "test",
        location: [60.1675352, 24.9409737],
        matko_ids: [244],
        description: {
          long: {
            en: "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest",
            fi: "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest",
            sv: "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest",
          },
          short: {
            en: "test",
            fi: "test",
            sv: "test",
          },
        },
        ontology_ids: [869],
        organization: {},
        opening_times: {},
        extra_keywords: ["extra"],
      },
      updated_at: "2021-06-21T13:45:44.017349Z",
      created_at: "2021-06-11T07:21:25.933749Z",
    },
    category: "translation_task",
    item_type: "created",
    status: "in_progress",
    data: {
      language: "zh",
      name: {
        lang: "test_chinese",
      },
      email: "a@b.c",
      phone: "123",
      images: [],
      address: {
        fi: {
          street: "mannerheimintie 10",
          post_office: "helsinki",
          postal_code: "00100",
          neighborhood: "Kamppi",
          neighborhood_id: "91-004",
        },
        sv: {
          street: "",
          post_office: "",
          postal_code: "",
          neighborhood: "",
          neighborhood_id: "",
        },
      },
      website: {
        lang: "http://www.fi",
      },
      comments: "test",
      location: [60.1675352, 24.9409737],
      matko_ids: [],
      description: {
        long: {
          lang: "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest_chinese",
        },
        short: {
          lang: "test_chinese",
        },
      },
      ontology_ids: [869],
      organization: {},
      opening_times: {},
      extra_keywords: ["extra"],
    },
    translator: {
      name: "Anthony Brown",
      email: "ant.brown@cgi.com",
    },
    moderator: {
      first_name: "Anthony",
      last_name: "Brown",
      email: "ant.brown@cgi.com",
    },
    created_at: "2021-07-05T10:40:25.063641Z",
    updated_at: "2021-07-05T10:40:25.063667Z",
  });
};

export default handler;
