import {
  SET_MODERATION_TRANSLATION_TASK_SEARCH,
  SET_MODERATION_TRANSLATION_TASK_RESULTS,
  SET_MODERATION_TRANSLATION_SELECTED_TASKS,
} from "../../types/constants";
import { TranslationSelectedTasks, TranslationTaskSearch, TranslationTodoResults } from "../../types/general";
import { ModerationTranslationAction } from "./moderationTranslationTypes";

export const setModerationTranslationTaskSearch = (taskSearch: TranslationTaskSearch): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_TASK_SEARCH,
  payload: taskSearch,
});

export const setModerationTranslationTaskResults = (taskResults: TranslationTodoResults): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_TASK_RESULTS,
  payload: taskResults,
});

export const setModerationTranslationSelectedTasks = (taskIds: TranslationSelectedTasks): ModerationTranslationAction => ({
  type: SET_MODERATION_TRANSLATION_SELECTED_TASKS,
  payload: taskIds,
});
