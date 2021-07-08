import { AnyAction } from "redux";
import {
  SET_MODERATION_TRANSLATION_TASK_SEARCH,
  SET_MODERATION_TRANSLATION_TASK_RESULTS,
  SET_MODERATION_TRANSLATION_SELECTED_TASKS,
} from "../../types/constants";
import { TranslationSelectedTasks, TranslationTaskSearch, TranslationTodoResults } from "../../types/general";

interface SetModerationTranslationTaskSearchAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_TASK_SEARCH;
  payload: TranslationTaskSearch;
}

interface SetModerationTranslationTaskResultsAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_TASK_RESULTS;
  payload: TranslationTodoResults;
}

interface SetModerationTranslationSelectedTasksAction extends AnyAction {
  type: typeof SET_MODERATION_TRANSLATION_SELECTED_TASKS;
  payload: TranslationSelectedTasks;
}

export type ModerationTranslationAction =
  | SetModerationTranslationTaskSearchAction
  | SetModerationTranslationTaskResultsAction
  | SetModerationTranslationSelectedTasksAction;
