import React, { Dispatch, ChangeEvent, ReactElement, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, Select, TextInput } from "hds-react";
import moment from "moment";
import { TranslationAction } from "../../state/actions/translationTypes";
import { setTranslationTaskResults, setTranslationTaskSearch } from "../../state/actions/translation";
import { RootState } from "../../state/reducers";
import { MAX_LENGTH } from "../../types/constants";
import { OptionType, TranslationTodoResult } from "../../types/general";
import { getTaskStatus, getTaskType } from "../../utils/conversion";
import getOrigin from "../../utils/request";
import styles from "./TaskSearch.module.scss";

const TaskSearch = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<TranslationAction>>();
  const router = useRouter();

  const taskSearch = useSelector((state: RootState) => state.translation.taskSearch);
  const { placeName, request: searchRequest, requestOptions } = taskSearch;

  const convertOptions = (options: string[]): OptionType[] => options.map((option) => ({ id: option, label: option }));

  const convertValue = (value: string | undefined): OptionType | undefined => requestOptions.find((t) => t.id === value);

  const updateSearchText = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setTranslationTaskSearch({ ...taskSearch, [evt.target.name]: evt.target.value }));
  };

  const updateSearchRequestOption = (selected: OptionType) => {
    dispatch(setTranslationTaskSearch({ ...taskSearch, request: selected.id as string }));
  };

  const searchTasks = async () => {
    // const taskResponse = await fetch(`${getOrigin(router)}/api/translation/todos/find/?search=${placeName.trim()}`);
    const taskResponse = await fetch(`${getOrigin(router)}/mockapi/translation/todos/find/?search=${placeName.trim()}`);
    if (taskResponse.ok) {
      const taskResult = await (taskResponse.json() as Promise<{ count: number; next: string; results: TranslationTodoResult[] }>);

      console.log("TASK RESPONSE", taskResult);

      if (taskResult && taskResult.results && taskResult.results.length > 0) {
        const { results, count, next } = taskResult;

        dispatch(
          setTranslationTaskResults({
            results: results.map((result) => {
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
          setTranslationTaskSearch({
            ...taskSearch,
            requestOptions: [
              { id: "", label: "" },
              ...convertOptions(results.map((result) => result.request).filter((v, i, a) => a.indexOf(v) === i)),
            ],
            searchDone: true,
          })
        );
      } else {
        dispatch(setTranslationTaskResults({ results: [], count: 0 }));

        dispatch(setTranslationTaskSearch({ ...taskSearch, searchDone: true }));
      }
    }
  };

  // If specified, search all tasks on first render only, using a workaround utilising useEffect with empty dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const useMountEffect = (fun: () => void) => useEffect(fun, []);
  useMountEffect(searchTasks);

  return (
    <div className={`formSection ${styles.taskSearch}`}>
      <h2>{i18n.t("translation.taskSearch.title")}</h2>

      <div className={`gridLayoutContainer ${styles.search}`}>
        <TextInput
          id="placeName"
          className={styles.gridInputPlaceName}
          label={i18n.t("translation.taskSearch.placeName.label")}
          name="placeName"
          value={placeName}
          maxLength={MAX_LENGTH}
          onChange={updateSearchText}
        />
        <Select
          id="request"
          className={styles.gridInputRequest}
          options={requestOptions}
          value={convertValue(searchRequest)}
          onChange={updateSearchRequestOption}
          label={i18n.t("translation.taskSearch.request.label")}
          selectedItemRemoveButtonAriaLabel={i18n.t("translation.button.remove")}
          clearButtonAriaLabel={i18n.t("translation.button.clearAllSelections")}
        />
        <div className={styles.gridButton}>
          <Button onClick={searchTasks}>{i18n.t("translation.button.search")}</Button>
        </div>
      </div>
    </div>
  );
};

export default TaskSearch;
