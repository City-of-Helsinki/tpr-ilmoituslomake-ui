import React, { Dispatch, ChangeEvent, ReactElement, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, Select, TextInput } from "hds-react";
import moment from "moment";
import { ModerationTranslationAction } from "../../../state/actions/moderationTranslationTypes";
import {
  setModerationTranslationRequestResults,
  setModerationTranslationRequestSearch,
  setModerationTranslationSelectedRequests,
  setModerationTranslationSelectedTasks,
  setModerationTranslationTaskSearch,
  setModerationTranslationTaskResults,
} from "../../../state/actions/moderationTranslation";
import { RootState } from "../../../state/reducers";
import { MAX_LENGTH } from "../../../types/constants";
import { OptionType, ModerationTranslationRequestResult, ModerationTranslationTaskResult } from "../../../types/general";
import { getTaskStatus, getTaskType } from "../../../utils/conversion";
import getOrigin from "../../../utils/request";
import styles from "./TaskSearch.module.scss";

const TaskSearch = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationTranslationAction>>();
  const router = useRouter();

  const requestSearch = useSelector((state: RootState) => state.moderationTranslation.requestSearch);
  const { placeName, request: searchRequest, requestOptions } = requestSearch;
  const taskSearch = useSelector((state: RootState) => state.moderationTranslation.taskSearch);

  const convertOptions = (options: string[]): OptionType[] => options.map((option) => ({ id: option, label: option }));

  // const convertValue = (value: string | undefined): OptionType | undefined => requestOptions.find((t) => t.id === value);

  const updateSearchText = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationTranslationRequestSearch({ ...requestSearch, [evt.target.name]: evt.target.value }));
    dispatch(setModerationTranslationTaskSearch({ ...taskSearch, [evt.target.name]: evt.target.value }));
  };

  const updateSearchRequestOption = (selected: OptionType) => {
    dispatch(setModerationTranslationRequestSearch({ ...requestSearch, request: selected.id as string }));
    dispatch(setModerationTranslationTaskSearch({ ...taskSearch, request: selected.id as string }));
  };

  const searchRequests = async () => {
    // const requestResponse = await fetch(`${getOrigin(router)}/api/moderation/translation/request/find/?search=${placeName.trim()}`);
    const requestResponse = await fetch(`${getOrigin(router)}/mockapi/moderation/translation/request/find/?search=${placeName.trim()}`);
    if (requestResponse.ok) {
      const requestResult = await (requestResponse.json() as Promise<{ count: number; next: string; results: ModerationTranslationRequestResult[] }>);

      console.log("REQUEST RESPONSE", requestResult);

      if (requestResult && requestResult.results && requestResult.results.length > 0) {
        const { results, count, next } = requestResult;

        dispatch(
          setModerationTranslationRequestResults({
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
          setModerationTranslationRequestSearch({
            ...requestSearch,
            requestOptions: [
              { id: "", label: "" },
              ...convertOptions(results.map((result) => result.request).filter((v, i, a) => a.indexOf(v) === i)),
            ],
            searchDone: true,
          })
        );
      } else {
        dispatch(setModerationTranslationRequestResults({ results: [], count: 0 }));

        dispatch(setModerationTranslationRequestSearch({ ...requestSearch, searchDone: true }));
      }

      // Clear any previously selected requests
      dispatch(
        setModerationTranslationSelectedRequests({
          selectedIds: [],
          isAllSelected: false,
        })
      );
    }
  };

  const searchTasks = async () => {
    // const taskResponse = await fetch(`${getOrigin(router)}/api/moderation/translation/task/find/?search=${placeName.trim()}`);
    const taskResponse = await fetch(`${getOrigin(router)}/mockapi/moderation/translation/task/find/?search=${placeName.trim()}`);
    if (taskResponse.ok) {
      const taskResult = await (taskResponse.json() as Promise<{ count: number; next: string; results: ModerationTranslationTaskResult[] }>);

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

  const searchRequestsAndTasks = () => {
    searchRequests();
    searchTasks();
  };

  // If specified, search all tasks on first render only, using a workaround utilising useEffect with empty dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const useMountEffect = (fun: () => void) => useEffect(fun, []);
  useMountEffect(searchRequestsAndTasks);

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
          <Button onClick={searchRequestsAndTasks}>{i18n.t("moderation.button.search")}</Button>
        </div>
      </div>
    </div>
  );
};

export default TaskSearch;
