// NOTE: These functions should only be used during server-side rendering

import { IncomingMessage } from "http";
import { Redirect } from "next";
import { LANGUAGE_OPTIONS } from "../types/constants";
import { MatkoTagOption, TagOption, User } from "../types/general";

export const getOriginServerSide = (): string => {
  // The server-side calls should use the local backend directly
  // Note: the client-side calls use the full path, which is handled by getOrigin in request.ts
  return "http://localhost:8008";
};

export const redirectToLogin = (resolvedUrl: string): { redirect: Redirect } => {
  // The server-side needs to redirect the client-side, so don't use getOriginServerSide here
  // The base path is needed to make sure the login page redirects work correctly in the server environment
  return {
    redirect: {
      destination: `${process.env.BASE_PATH}/helauth/login/?next=${process.env.BASE_PATH}${resolvedUrl}`,
      permanent: false,
      basePath: false,
    },
  };
};

export const redirectToNotAuthorized = (): { redirect: Redirect } => {
  // The server-side needs to redirect the client-side, so don't use getOriginServerSide here
  // The base path is needed to make sure the login page redirects work correctly in the server environment
  return {
    redirect: {
      destination: `${process.env.BASE_PATH}/notauthorized/`,
      permanent: false,
      basePath: false,
    },
  };
};

export const checkUser = async (req: IncomingMessage): Promise<User | undefined> => {
  // Check the current user
  const userResponse = await fetch(`${getOriginServerSide()}/api/user/?format=json`, { headers: { cookie: req.headers.cookie as string } });

  if (!userResponse.ok) {
    // Invalid user
    return undefined;
  }

  // Check the user response
  const user = await userResponse.json();

  if (!user.email || user.email.length === 0) {
    // Invalid user
    return undefined;
  }

  // Valid user
  // return { authenticated: true, ...user };

  // TEST - is_translator - FOR DEVELOPMENT USE ONLY
  return { authenticated: true, is_translator: true, ...user };
};

export const getTags = async (): Promise<TagOption[]> => {
  // Note: this currently fetches all tags which may cause performance issues
  const tagResponse = await fetch(`${getOriginServerSide()}/api/ontologywords/?format=json&search=`);
  if (tagResponse.ok) {
    const tagResult = await (tagResponse.json() as Promise<TagOption[]>);
    return tagResult;
  }
  return [];
};

export const getMatkoTags = async (): Promise<MatkoTagOption[]> => {
  const tagResponse = await fetch(`${getOriginServerSide()}/api/matkowords/?format=json&search=`);
  if (tagResponse.ok) {
    const tagResult = await (tagResponse.json() as Promise<MatkoTagOption[]>);
    return tagResult;
  }
  return [];
};

export const getPreviousInputLanguages = (locale: string, name: { [key: string]: unknown }): string[] => {
  // Determine the previously selected input languages using the supplied place names, which are mandatory for selected input languages
  // Also add the current locale in case it's different from the place names, and remove duplicates from the final array
  return LANGUAGE_OPTIONS.reduce(
    (acc, language) => {
      return name[language] && (name[language] as string).length > 0 ? [...acc, language] : acc;
    },
    [locale]
  ).filter((v, i, a) => a.indexOf(v) === i);
};
