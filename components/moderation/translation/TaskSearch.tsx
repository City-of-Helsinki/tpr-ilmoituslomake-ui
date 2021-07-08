import React, { Dispatch, ChangeEvent, ReactElement, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, Select, TextInput } from "hds-react";
import moment from "moment";
import { ModerationTranslationAction } from "../../../state/actions/moderationTranslationTypes";
import {
  setModerationTranslationSelectedTasks,
  setModerationTranslationTaskResults,
  setModerationTranslationTaskSearch,
} from "../../../state/actions/moderationTranslation";
import { RootState } from "../../../state/reducers";
import { MAX_LENGTH } from "../../../types/constants";
import { OptionType, TranslationTodoResult } from "../../../types/general";
import { getTaskStatus, getTaskType } from "../../../utils/conversion";
import getOrigin from "../../../utils/request";
import styles from "./TaskSearch.module.scss";

const TaskSearch = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationTranslationAction>>();
  const router = useRouter();

  const taskSearch = useSelector((state: RootState) => state.moderationTranslation.taskSearch);
  const { placeName, request: searchRequest, requestOptions } = taskSearch;

  const convertOptions = (options: string[]): OptionType[] => options.map((option) => ({ id: option, label: option }));

  // const convertValue = (value: string | undefined): OptionType | undefined => requestOptions.find((t) => t.id === value);

  const updateSearchText = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationTranslationTaskSearch({ ...taskSearch, [evt.target.name]: evt.target.value }));
  };

  const updateSearchRequestOption = (selected: OptionType) => {
    dispatch(setModerationTranslationTaskSearch({ ...taskSearch, request: selected.id as string }));
  };

  const searchTasks = async () => {
    // const taskResponse = await fetch(`${getOrigin(router)}/api/moderation/translation/tasks/find/?search=${placeName.trim()}`);
    const taskResponse = await fetch(`${getOrigin(router)}/mockapi/moderation/translation/tasks/find/?search=${placeName.trim()}`);
    if (taskResponse.ok) {
      const taskResult = await (taskResponse.json() as Promise<{ count: number; next: string; results: TranslationTodoResult[] }>);

      console.log("TASK RESPONSE", taskResult);

      if (taskResult && taskResult.results && taskResult.results.length > 0) {
        const { results, count, next } = taskResult;

        dispatch(
          setModerationTranslationTaskResults({
            results: results
              .filter((result) => {
                const { request: resultRequest } = result;
                return searchRequest.length === 0 || searchRequest === resultRequest;
              })
              .map((result) => {
                return {
                  ...result,
                  created: moment(result.created_at).toDate(),
                  updated: moment(result.updated_at).toDate(),
                  taskType: getTaskType(result.category, result.item_type),
                  taskStatus: getTaskStatus(result.status),
                };
              }),
            count,
            next,
          })
        );

        dispatch(
          setModerationTranslationTaskSearch({
            ...taskSearch,
            requestOptions: [
              { id: "", label: "" },
              ...convertOptions(results.map((result) => result.request).filter((v, i, a) => a.indexOf(v) === i)),
            ],
            searchDone: true,
          })
        );
      } else {
        dispatch(setModerationTranslationTaskResults({ results: [], count: 0 }));

        dispatch(setModerationTranslationTaskSearch({ ...taskSearch, searchDone: true }));
      }

      // Clear any previously selected tasks
      dispatch(
        setModerationTranslationSelectedTasks({
          selectedIds: [],
          isAllSelected: false,
        })
      );
    }
  };

  // If specified, search all tasks on first render only, using a workaround utilising useEffect with empty dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const useMountEffect = (fun: () => void) => useEffect(fun, []);
  useMountEffect(searchTasks);

  return (
    <div className={`formSection ${styles.taskSearch}`}>
      <div className={styles.header}>
        <h1 className="moderation">{i18n.t("moderation.translation.taskSearch.title")}</h1>
      </div>

      <div className={`gridLayoutContainer ${styles.search}`}>
        <TextInput
          id="placeName"
          className={styles.gridInputPlaceName}
          label={i18n.t("moderation.translation.taskSearch.placeName.label")}
          name="placeName"
          value={placeName}
          maxLength={MAX_LENGTH}
          onChange={updateSearchText}
        />
        <Select
          id="request"
          className={styles.gridInputRequest}
          options={requestOptions}
          // value={convertValue(searchRequest)}
          onChange={updateSearchRequestOption}
          label={i18n.t("moderation.translation.taskSearch.request.label")}
          selectedItemRemoveButtonAriaLabel={i18n.t("moderation.button.remove")}
          clearButtonAriaLabel={i18n.t("moderation.button.clearAllSelections")}
        />
        <div className={styles.gridButton}>
          <Button onClick={searchTasks}>{i18n.t("moderation.button.search")}</Button>
        </div>
      </div>
    </div>
  );
};

export default TaskSearch;
