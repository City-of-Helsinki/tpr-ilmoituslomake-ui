import React, { Dispatch, ChangeEvent, ReactElement, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, Select, TextInput, type Option } from "hds-react";
import moment from "moment";
import { TranslationAction } from "../../state/actions/translationTypes";
import { setTranslationTaskResults, setTranslationTaskSearch } from "../../state/actions/translation";
import { RootState } from "../../state/reducers";
import { DATETIME_FORMAT, MAX_LENGTH } from "../../types/constants";
import { OptionType, TranslationTodoResult } from "../../types/general";
import { getTaskStatus, getTaskType } from "../../utils/conversion";
import getOrigin from "../../utils/request";
import styles from "./TaskSearch.module.scss";

const TaskSearch = (): ReactElement => {
  const i18n = useI18n();
  //const dispatch = useDispatch<Dispatch<TranslationAction>>();
  const dispatch = useDispatch();
  const router = useRouter();

  const taskSearch = useSelector((state: RootState) => state.translation.taskSearch);
  const { placeName, request: searchRequest } = taskSearch;
  const taskResults = useSelector((state: RootState) => state.translation.taskResults);
  const { results } = taskResults;

  const convertOptions = (options: string[]): OptionType[] => options.map((option) => ({ value: option, label: option }));

  const requestOptions = useMemo(
    () => [{ value: "", label: "" }, ...convertOptions(results.map((result) => result.formattedRequest).filter((v, i, a) => a.indexOf(v) === i))],
    [results]
  );

  //const convertValue = (value: string | undefined): OptionType | undefined => requestOptions.find((t) => t.value === value);
  const convertValue = (value: string | undefined): string | undefined => value;

  const updateSearchText = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch(setTranslationTaskSearch({ ...taskSearch, [evt.target.name]: evt.target.value }));
  };

  /*
  const updateSearchRequestOption = (selected: OptionType) => {
    dispatch(setTranslationTaskSearch({ ...taskSearch, request: selected.value as string }));
  };*/

  const updateSearchRequestOption = (selectedOptions: OptionType[]) => {
      const selected = selectedOptions && selectedOptions.length > 0 ? selectedOptions[0] : null;
      if (selected) {
        dispatch(setTranslationTaskSearch(({ ...taskSearch, request: selected.value as string })));
      }
    };

  const searchTasks = async () => {
    const taskResponse = await fetch(`${getOrigin(router)}/api/translation/todos/find/?search=${placeName.trim()}`);
    if (taskResponse.ok) {
      const taskResult = await (taskResponse.json() as Promise<{ count: number; next: string; results: TranslationTodoResult[] }>);

      console.log("TASK RESPONSE", taskResult);

      if (taskResult && taskResult.results && taskResult.results.length > 0) {
        const { results: firstResults, count, next: nextBatch } = taskResult;

        dispatch(
          setTranslationTaskResults({
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

        dispatch(setTranslationTaskSearch({ ...taskSearch, searchDone: true }));
      } else {
        dispatch(setTranslationTaskResults({ results: [], count: 0 }));

        dispatch(setTranslationTaskSearch({ ...taskSearch, searchDone: true }));
      }
    }
  };

  // If specified, search all tasks on first render only, using a workaround utilising useEffect with empty dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  //const useMountEffect = (fun: () => void) => useEffect(fun, []);
  //useMountEffect(searchTasks);

  useEffect(() => {
    searchTasks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        {requestOptions.length > 0 && (
          <Select
            id="request"
            className={styles.gridInputRequest}
            options={requestOptions as (string | Partial<{ value: string; label: string }>)[]}
            value={searchRequest}
            onChange={updateSearchRequestOption}
            texts={{
              label: i18n.t("translation.taskSearch.request.label"),
              tagRemoveSelectionAriaLabel: i18n.t("translation.button.remove"),
              tagsClearAllButton: i18n.t("translation.button.clearAllSelections")
            }}
          />
        )}
        <div className={styles.gridButton}>
          <Button onClick={searchTasks}>{i18n.t("translation.button.search")}</Button>
        </div>
      </div>
    </div>
  );
};

export default TaskSearch;
