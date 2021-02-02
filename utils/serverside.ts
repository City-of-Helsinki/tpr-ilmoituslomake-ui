// NOTE: These functions should only be used during server-side rendering

import { IncomingMessage, ServerResponse } from "http";
import { TagOption, User } from "../types/general";
import { getOrigin } from "./request";

const redirectToLogin = (req: IncomingMessage, res: ServerResponse, resolvedUrl: string) => {
  res.writeHead(302, { Location: `${getOrigin(req)}/helauth/login/?next=${resolvedUrl}` });
  res.end();
};

export const checkUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  resolvedUrl: string,
  isLoginRequired: boolean,
  isModeratorUserRequired?: boolean
): Promise<User | undefined> => {
  // Check the current user
  const userResponse = await fetch(`${getOrigin(req)}/api/user/?format=json`, { headers: { cookie: req.headers.cookie as string } });

  if (!userResponse.ok) {
    if (isLoginRequired || isModeratorUserRequired) {
      // Invalid user but login is required, so redirect to login
      redirectToLogin(req, res, resolvedUrl);
      return undefined;
    }

    // Invalid user but login is not required
    return undefined;
  }

  // Check the user response
  const user = await userResponse.json();

  if (!user.email || user.email.length === 0) {
    if (isLoginRequired || isModeratorUserRequired) {
      // Invalid user but login is required, so redirect to login
      redirectToLogin(req, res, resolvedUrl);
      return undefined;
    }

    // Invalid user but login is not required
    return undefined;
  }

  // TODO: define how a moderator user is identified
  /*
  if (isModeratorUserRequired && user.group !== "helsinki") {
    // Valid normal user but moderator user is required, so redirect to login
    redirectToLogin(req, res, resolvedUrl);
    return undefined;
  }
  */

  // Valid user
  return { authenticated: true, ...user };
};

export const getTags = async (req: IncomingMessage): Promise<TagOption[]> => {
  // Note: this currently fetches all tags which may cause performance issues
  const tagResponse = await fetch(`${getOrigin(req)}/api/ontologywords/?format=json&search=`);
  if (tagResponse.ok) {
    const tagResult = await (tagResponse.json() as Promise<TagOption[]>);
    return tagResult;
  }
  return [];
};
