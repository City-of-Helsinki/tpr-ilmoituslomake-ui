import { IncomingMessage } from "http";
import absoluteUrl from "next-absolute-url";

export const getOrigin = (req: IncomingMessage): string => {
  const { origin } = absoluteUrl(req);
  return origin;
};

export default getOrigin;
