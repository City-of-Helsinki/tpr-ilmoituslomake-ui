import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Button } from "hds-react";
import moment from "moment";
import { TranslationAction } from "../../state/actions/translationTypes";
import { setTranslationTaskResults } from "../../state/actions/translation";
import { RootState } from "../../state/reducers";
import { DATETIME_FORMAT } from "../../types/constants";
import { TranslationTodoResult } from "../../types/general";
import { getTaskStatus, getTaskType } from "../../utils/conversion";

const MoreResultsButton = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<TranslationAction>>();

  const taskResults = useSelector((state: RootState) => state.translation.taskResults);
  const { results, count, next } = taskResults;

  const fetchMoreResults = async () => {
    if (next) {
      const taskResponse = await fetch(next);
      if (taskResponse.ok) {
        const taskResult = await (taskResponse.json() as Promise<{ count: number; next: string; results: TranslationTodoResult[] }>);

        console.log("TASK RESPONSE", taskResult);

        if (taskResult && taskResult.results && taskResult.results.length > 0) {
          const { results: moreResults, next: nextBatch } = taskResult;

          dispatch(
            setTranslationTaskResults({
              results: [
                ...results,
                ...moreResults.map((result) => {
                  return {
                    ...result,
                    created: moment(result.created_at).toDate(),
                    updated: moment(result.updated_at).toDate(),
                    taskType: getTaskType(result.category, result.item_type),
                    taskStatus: getTaskStatus(result.status),
                    formattedRequest: moment(result.request).format(DATETIME_FORMAT),
                  };
                }),
              ],
              count,
              next: nextBatch,
            })
          );
        }
      }
    }
  };

  return (
    <div>
      {next && (
        <Button variant="secondary" onClick={fetchMoreResults}>
          {i18n.t("translation.button.showMore")}
        </Button>
      )}
    </div>
  );
};

export default MoreResultsButton;
