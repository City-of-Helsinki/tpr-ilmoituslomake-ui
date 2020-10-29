import { ModerationAction, SET_OTHER_THING } from "./types";

export const setOtherThing = (thing: string): ModerationAction => ({
  type: SET_OTHER_THING,
  payload: thing,
});

export default setOtherThing;
