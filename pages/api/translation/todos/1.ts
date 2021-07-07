import { NextApiRequest, NextApiResponse } from "next";

// NOTE: this is used for mock translation test data only
// This can be removed after the backend has been implemented

const handler = (req: NextApiRequest, res: NextApiResponse): void => {
  res.status(200).json({
    id: 1,
    request: "05.07.2021",
    target: {
      id: 1,
      published: true,
      location: {
        type: "Point",
        coordinates: [24.9409737, 60.1675352],
      },
      data: {
        name: {
          en: "test 1",
          fi: "test 1",
          sv: "test 1",
        },
        email: "a@b.c",
        phone: "123",
        images: [
          {
            url: "https://tprimages.blob.core.windows.net/tpr-notification-dev-public/1/084f941a-90aa-4690-a18a-3f5cff72932c.jpg",
            uuid: "084f941a-90aa-4690-a18a-3f5cff72932c",
            index: 0,
            source: "test",
            alt_text: {
              en: "test",
              fi: "test",
              sv: "test",
            },
            permission: "myHelsinki",
            source_type: "device",
          },
          {
            url: "https://tprimages.blob.core.windows.net/tpr-notification-dev-public/1/573de7d7-c463-45ce-b299-0890e555dd22.jpg",
            uuid: "573de7d7-c463-45ce-b299-0890e555dd22",
            index: 1,
            source: "test",
            alt_text: {
              en: "test",
              fi: "test",
              sv: "test",
            },
            permission: "creativeCommons",
            source_type: "link",
          },
        ],
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
    status: "open",
    data: {
      language: "zh",
      name: {
        lang: "test_chinese",
      },
      email: "a@b.c",
      phone: "123",
      images: [
        {
          url: "https://tprimages.blob.core.windows.net/tpr-notification-dev-public/1/084f941a-90aa-4690-a18a-3f5cff72932c.jpg",
          uuid: "084f941a-90aa-4690-a18a-3f5cff72932c",
          index: 0,
          source: "test_chinese",
          alt_text: {
            lang: "test_chinese",
          },
          permission: "myHelsinki",
          source_type: "device",
        },
        {
          url: "https://tprimages.blob.core.windows.net/tpr-notification-dev-public/1/573de7d7-c463-45ce-b299-0890e555dd22.jpg",
          uuid: "573de7d7-c463-45ce-b299-0890e555dd22",
          index: 1,
          source: "test_chinese",
          alt_text: {
            lang: "test_chinese",
          },
          permission: "creativeCommons",
          source_type: "link",
        },
      ],
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
      first_name: "Anthony",
      last_name: "Brown",
      is_translator: true,
      email: "ant.brown@cgi.com",
    },
    moderator: {
      first_name: "Anthony",
      last_name: "Brown",
      is_staff: true,
      email: "ant.brown@cgi.com",
    },
    created_at: "2021-06-11T06:47:27.512075Z",
    updated_at: "2021-06-11T07:21:31.800104Z",
  });
};

export default handler;
