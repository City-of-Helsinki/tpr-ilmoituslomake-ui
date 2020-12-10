import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Button, Select, TextInput } from "hds-react";
import moment from "moment";
import { ModerationAction } from "../../state/actions/types";
import { setModerationTaskSearch, setModerationTaskResults } from "../../state/actions/moderation";
import { RootState } from "../../state/reducers";
import { TaskCategory } from "../../types/constants";
import { ModerationTodo } from "../../types/general";
import { getTaskStatus, getTaskType } from "../../utils/conversion";
import styles from "./PlaceSearch.module.scss";

type OptionTypeWithEnumId = {
  id: TaskCategory;
  label: string;
};

const TaskSearch = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();

  const taskSearch = useSelector((state: RootState) => state.moderation.taskSearch);
  const { placeName, taskType } = taskSearch;

  // TODO - improve this categorisation
  const taskTypeOptions = [
    { id: TaskCategory.Unknown, label: i18n.t("moderation.taskSearch.taskType.all") },
    { id: TaskCategory.ChangeRequest, label: i18n.t("moderation.taskType.change") },
    { id: TaskCategory.ModerationTask, label: i18n.t("moderation.taskType.new") },
  ];

  const convertValue = (value: string | undefined): OptionTypeWithEnumId | undefined => taskTypeOptions.find((t) => t.id === value);

  const updateSearchText = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationTaskSearch({ ...taskSearch, [evt.target.name]: evt.target.value }));
  };

  const updateSearchTaskType = (selected: OptionTypeWithEnumId) => {
    dispatch(setModerationTaskSearch({ ...taskSearch, taskType: selected.id }));
  };

  const searchTasks = async () => {
    const searchCategory = taskType !== TaskCategory.Unknown ? `&category=${taskType}` : "";
    const taskResponse = await fetch(`/api/moderation/todos/find/?search=${placeName}${searchCategory}`);
    if (taskResponse.ok) {
      const taskResult = await (taskResponse.json() as Promise<{ results: ModerationTodo[] }>);

      console.log("TASK RESPONSE", taskResult);

      if (taskResult && taskResult.results && taskResult.results.length > 0) {
        // Parse the date strings to date objects
        const results = taskResult.results.map((result) => {
          return {
            ...result,
            created: moment(result.created_at).toDate(),
            updated: moment(result.updated_at).toDate(),
            taskType: getTaskType(result.category),
            taskStatus: getTaskStatus(result.status),
          };
        });
        dispatch(setModerationTaskResults(results));
      } else {
        dispatch(setModerationTaskResults([]));
      }
    }
  };

  return (
    <div className={styles.placeSearch}>
      <h3>{i18n.t("moderation.taskSearch.title")}</h3>
      <div className="gridLayoutContainer">
        <TextInput
          id="placeName"
          className="gridColumn1"
          label={i18n.t("moderation.taskSearch.placeName.label")}
          name="placeName"
          value={placeName}
          onChange={updateSearchText}
        />
        <Select
          id="taskType"
          className="gridColumn2"
          options={taskTypeOptions}
          defaultValue={convertValue(taskType)}
          onChange={updateSearchTaskType}
          label={i18n.t("moderation.taskSearch.taskType.label")}
          selectedItemRemoveButtonAriaLabel={i18n.t("notification.button.remove")}
          clearButtonAriaLabel={i18n.t("notification.button.clearAllSelections")}
        />
        <div className="gridButton">
          <Button className="gridColumn3" onClick={searchTasks}>
            {i18n.t("moderation.button.search")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskSearch;
