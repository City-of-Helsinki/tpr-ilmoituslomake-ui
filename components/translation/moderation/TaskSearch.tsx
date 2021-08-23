import React, { Dispatch, ChangeEvent, ReactElement, SetStateAction, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, Select, TextInput } from "hds-react";
import moment from "moment";
import { ModerationTranslationAction } from "../../../state/actions/moderationTranslationTypes";
import {
  setModerationTranslationSelectedTasks,
  setModerationTranslationTaskSearch,
  setModerationTranslationTaskResults,
} from "../../../state/actions/moderationTranslation";
import { RootState } from "../../../state/reducers";
import { DATETIME_FORMAT, MAX_LENGTH } from "../../../types/constants";
import { OptionType, ModerationTranslationTaskResult } from "../../../types/general";
import { getTaskStatus, getTaskType } from "../../../utils/conversion";
import getOrigin from "../../../utils/request";
import TaskStatusFilter from "../TaskStatusFilter";
import styles from "./TaskSearch.module.scss";

interface TaskSearchProps {
  showStatus: string;
  setShowStatus: Dispatch<SetStateAction<string>>;
}

const TaskSearch = ({ showStatus, setShowStatus }: TaskSearchProps): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationTranslationAction>>();
  const router = useRouter();

  const taskSearch = useSelector((state: RootState) => state.moderationTranslation.taskSearch);
  const { placeName, request: searchRequest } = taskSearch;
  const taskResults = useSelector((state: RootState) => state.moderationTranslation.taskResults);
  const { results } = taskResults;

  const convertOptions = (options: string[]): OptionType[] => options.map((option) => ({ id: option, label: option }));

  const requestOptions = useMemo(
    () => [{ id: "", label: "" }, ...convertOptions(results.map((result) => result.formattedRequest).filter((v, i, a) => a.indexOf(v) === i))],
    [results]
  );

  const convertValue = (value: string | undefined): OptionType | undefined => requestOptions.find((t) => t.id === value);

  const updateSearchText = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationTranslationTaskSearch({ ...taskSearch, [evt.target.name]: evt.target.value }));
  };

  const updateSearchRequestOption = (selected: OptionType) => {
    dispatch(setModerationTranslationTaskSearch({ ...taskSearch, request: selected.id as string }));
  };

  const searchTasks = async () => {
    const taskResponse = await fetch(`${getOrigin(router)}/api/moderation/translation/task/find/?search=${placeName.trim()}`);
    // const taskResponse = await fetch(`${getOrigin(router)}/mockapi/moderation/translation/task/find/?search=${placeName.trim()}`);
    if (taskResponse.ok) {
      const taskResult = await (taskResponse.json() as Promise<{ count: number; next: string; results: ModerationTranslationTaskResult[] }>);

      console.log("TASK RESPONSE", taskResult);

      if (taskResult && taskResult.results && taskResult.results.length > 0) {
        const { results: firstResults, count, next: nextBatch } = taskResult;

        dispatch(
          setModerationTranslationTaskResults({
            results: firstResults.map((result) => {
              return {
                ...result,
                created: moment(result.created_at).toDate(),
                updated: moment(result.updated_at).toDate(),
                taskType: getTaskType(result.category, result.item_type),
                taskStatus: getTaskStatus(result.status),
                formattedRequest: moment(result.request).format(DATETIME_FORMAT),
              };
            }),
            count,
            next: nextBatch,
          })
        );

        dispatch(setModerationTranslationTaskSearch({ ...taskSearch, searchDone: true }));
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
        {requestOptions.length > 0 && (
          <Select
            id="request"
            className={styles.gridInputRequest}
            options={requestOptions}
            value={convertValue(searchRequest)}
            onChange={updateSearchRequestOption}
            label={i18n.t("moderation.translation.taskSearch.request.label")}
            selectedItemRemoveButtonAriaLabel={i18n.t("moderation.button.remove")}
            clearButtonAriaLabel={i18n.t("moderation.button.clearAllSelections")}
          />
        )}
        <div className={styles.gridButton}>
          <Button onClick={searchTasks}>{i18n.t("moderation.button.search")}</Button>
        </div>
      </div>

      <TaskStatusFilter prefix="moderation.translation" showStatus={showStatus} setShowStatus={setShowStatus} />
    </div>
  );
};

export default TaskSearch;
