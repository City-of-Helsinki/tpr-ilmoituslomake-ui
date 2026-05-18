import React, { Dispatch, ChangeEvent, ReactElement, SetStateAction, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, Select, TextInput, type Option } from "hds-react";
import moment from "moment";
import { ModerationAction } from "../../state/actions/moderationTypes";
import { setModerationTaskSearch, setModerationTaskResults } from "../../state/actions/moderation";
import { RootState } from "../../state/reducers";
import { TaskType } from "../../types/constants";
import { ModerationTodoResult } from "../../types/general";
import { getTaskCategoryFromType, getTaskItemTypeFromType, getTaskStatus, getTaskType } from "../../utils/conversion";
import getOrigin from "../../utils/request";
import styles from "./TaskSearch.module.scss";

// Note: The task filter has an attribute that uses a media query which does not work when server-side rendering
const DynamicTaskStatusFilter = dynamic(() => import("./TaskStatusFilter"), { ssr: false });

type OptionTypeWithEnumId = {
  value: string;
  label: string;
};

interface TaskSearchProps {
  showStatus: string;
  setShowStatus: Dispatch<SetStateAction<string>>;
}

const TaskSearch = ({ showStatus, setShowStatus }: TaskSearchProps): ReactElement => {
  const i18n = useI18n();
  //const dispatch = useDispatch<Dispatch<ModerationAction>>();
  const dispatch = useDispatch();
  const router = useRouter();

  const taskSearch = useSelector((state: RootState) => state.moderation.taskSearch);
  const { placeName, taskType } = taskSearch;

  const taskTypeOptions = [
    { value: TaskType.Unknown.toString(), label: i18n.t("moderation.taskSearch.taskType.all") },
    { value: TaskType.PlaceChange.toString(), label: i18n.t("moderation.taskType.placeChange") },
    { value: TaskType.NewPlace.toString(), label: i18n.t("moderation.taskType.newPlace") },
    { value: TaskType.ChangeTip.toString(), label: i18n.t("moderation.taskType.changeTip") },
    { value: TaskType.AddTip.toString(), label: i18n.t("moderation.taskType.addTip") },
    { value: TaskType.RemoveTip.toString(), label: i18n.t("moderation.taskType.removeTip") },
    { value: TaskType.ModeratorChange.toString(), label: i18n.t("moderation.taskType.moderatorChange") },
    { value: TaskType.ModeratorAdd.toString(), label: i18n.t("moderation.taskType.moderatorAdd") },
    { value: TaskType.ModeratorRemove.toString(), label: i18n.t("moderation.taskType.moderatorRemove") },
  ];

  const convertValue = (value: string | undefined): OptionTypeWithEnumId | undefined => taskTypeOptions.find((t) => t.value === value);

  const updateSearchText = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationTaskSearch({ ...taskSearch, [evt.target.name]: evt.target.value }));
  };

  /*
  const updateSearchTaskType = (selected: OptionTypeWithEnumId) => {
    dispatch(setModerationTaskSearch({ ...taskSearch, taskType: selected.id }));
  };*/

  const updateSearchTaskType = (selectedOptions: Option[]) => {
    const selected = selectedOptions[0] as OptionTypeWithEnumId | undefined;
    dispatch(
      setModerationTaskSearch({
        ...taskSearch,
        taskType: selected?.value as TaskType ?? TaskType.Unknown,
      })
    );
  };

  const searchTasks = async () => {
    const searchCategory = taskType !== TaskType.Unknown ? `&category=${getTaskCategoryFromType(taskType)}` : "";
    const taskResponse = await fetch(`${getOrigin(router)}/api/moderation/todos/find/?search=${placeName.trim()}${searchCategory}`);
    if (taskResponse.ok) {
      const taskResult = await (taskResponse.json() as Promise<{ count: number; next: string; results: ModerationTodoResult[] }>);

      console.log("TASK RESPONSE", taskResult);
      console.log("task type", taskTypeOptions);

      if (taskResult && taskResult.results && taskResult.results.length > 0) {
        const { results, count, next } = taskResult;

        // Parse the date strings to date objects
        dispatch(
          setModerationTaskResults({
            results: results
              .filter((result) => {
                const searchItemType = taskType !== TaskType.Unknown ? getTaskItemTypeFromType(taskType) : "";
                return searchItemType.length === 0 || searchItemType === result.item_type;
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
      } else {
        dispatch(setModerationTaskResults({ results: [], count: 0 }));
      }
      dispatch(setModerationTaskSearch({ ...taskSearch, searchDone: true }));
    }
  };

  // Search all tasks on first render only, using a workaround utilising useEffect with empty dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  //const useMountEffect = (fun: () => void) => useEffect(fun, []);
  //useMountEffect(searchTasks);

  console.log(taskType);

  useEffect(() => {
    searchTasks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="formSection">
      <h1 className="moderation">{i18n.t("moderation.taskSearch.title")}</h1>
      <div className={`gridLayoutContainer ${styles.search}`}>
        <TextInput
          id="placeName"
          className={styles.gridInput}
          label={i18n.t("moderation.taskSearch.placeName.label")}
          name="placeName"
          value={placeName}
          onChange={updateSearchText}
        />
        <Select
          id="taskType"
          className={styles.gridInput}
          options={taskTypeOptions}
          value={taskType.toString() || ""}
          onChange={updateSearchTaskType}
          texts={{
            label: i18n.t("moderation.taskSearch.taskType.label"),
            tagRemoveSelectionAriaLabel: i18n.t("moderation.button.remove"),
            tagsClearAllButton: i18n.t("moderation.button.clearAllSelections")
          }}
        />
        <div className={styles.gridButton}>
          <Button onClick={searchTasks}>{i18n.t("moderation.button.search")}</Button>
        </div>
      </div>

      <DynamicTaskStatusFilter showStatus={showStatus} setShowStatus={setShowStatus} isHorizontalWhenXS />
    </div>
  );
};

export default TaskSearch;
