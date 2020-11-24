import { SET_PAGE } from "../../types/constants";
import { ModerationAction } from "./types";

export const setPage = (pageNumber: number): ModerationAction => ({
  type: SET_PAGE,
  payload: pageNumber,
});

export default setPage;
