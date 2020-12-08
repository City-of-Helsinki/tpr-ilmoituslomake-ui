import React, { Dispatch, ChangeEvent, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Button, Select, TextInput } from "hds-react";
import { ModerationAction } from "../../state/actions/types";
import { setModerationTaskSearch } from "../../state/actions/moderation";
import { RootState } from "../../state/reducers";
import styles from "./PlaceSearch.module.scss";

type OptionType = {
  label: string;
};

const TaskSearch = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();

  const taskSearch = useSelector((state: RootState) => state.moderation.taskSearch);
  const { placeName, taskType } = taskSearch;

  const taskTypeOptions = [{ label: "Kaikki" }, { label: "Muutos" }, { label: "Uusi kohde" }, { label: "Vinkki" }];

  const convertValue = (value: string | undefined): OptionType | undefined => ({ label: value ?? "" });

  const updateSearchText = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setModerationTaskSearch({ ...taskSearch, [evt.target.name]: evt.target.value }));
  };

  const updateSearchTaskType = (selected: OptionType) => {
    dispatch(setModerationTaskSearch({ ...taskSearch, taskType: selected ? selected.label : "" }));
  };

  const searchTasks = () => {
    console.log("TODO");
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
