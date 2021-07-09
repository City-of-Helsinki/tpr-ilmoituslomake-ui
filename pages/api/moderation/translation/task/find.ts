import { NextApiRequest, NextApiResponse } from "next";

// NOTE: this is used for mock translation test data only
// This can be removed after the backend has been implemented

const handler = (req: NextApiRequest, res: NextApiResponse): void => {
  res.status(200).json({
    count: 4,
    next: null,
    previous: null,
    results: [
      {
        id: 1,
        requestId: 1,
        request: "05.07.2021",
        language: {
          from: "en",
          to: "zh",
        },
        message: "test",
        target: {
          id: 1,
          name: {
            en: "test 1",
            fi: "test 1",
            sv: "test 1",
          },
        },
        category: "translation_task",
        item_type: "created",
        status: "open",
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
      },
      {
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
          name: {
            en: "test 2",
            fi: "test 2",
            sv: "test 2",
          },
        },
        category: "translation_task",
        item_type: "created",
        status: "in_progress",
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
      },
      {
        id: 3,
        requestId: 1,
        request: "05.07.2021",
        language: {
          from: "en",
          to: "zh",
        },
        message: "test",
        target: {
          id: 34,
          name: {
            en: "test 3",
            fi: "test 3",
            sv: "test 3",
          },
        },
        category: "translation_task",
        item_type: "created",
        status: "closed",
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
      },
      {
        id: 4,
        requestId: 2,
        request: "06.07.2021",
        language: {
          from: "en",
          to: "zh",
        },
        message: "test",
        target: {
          id: 45,
          name: {
            en: "test 4",
            fi: "test 4",
            sv: "test 4",
          },
        },
        category: "translation_task",
        item_type: "created",
        status: "open",
        translator: {
          name: "Anthony Brown",
          email: "ant.brown@cgi.com",
        },
        moderator: {
          first_name: "Anthony",
          last_name: "Brown",
          email: "ant.brown@cgi.com",
        },
        created_at: "2021-07-06T10:40:25.063641Z",
        updated_at: "2021-07-06T10:40:25.063667Z",
      },
    ],
  });
};

export default handler;
