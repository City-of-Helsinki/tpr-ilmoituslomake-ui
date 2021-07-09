import { NextApiRequest, NextApiResponse } from "next";

// NOTE: this is used for mock translation test data only
// This can be removed after the backend has been implemented

const handler = (req: NextApiRequest, res: NextApiResponse): void => {
  res.status(200).json({
    id: 2,
    request: "06.07.2021",
    language: {
      from: "en",
      to: "zh",
    },
    message: "test",
    tasks: [
      {
        id: 45,
        target: {
          id: 4,
          name: {
            en: "test 4",
            fi: "test 4",
            sv: "test 4",
          },
        },
      },
    ],
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
  });
};

export default handler;
