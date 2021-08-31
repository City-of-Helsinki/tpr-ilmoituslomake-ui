import React, { Dispatch, ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Button } from "hds-react";
import moment from "moment";
import { ModerationTranslationAction } from "../../../state/actions/moderationTranslationTypes";
import { setModerationTranslationTaskResults } from "../../../state/actions/moderationTranslation";
import { RootState } from "../../../state/reducers";
import { DATETIME_FORMAT } from "../../../types/constants";
import { ModerationTranslationTaskResult } from "../../../types/general";
import { getTaskStatus, getTaskType } from "../../../utils/conversion";

const MoreResultsButton = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationTranslationAction>>();

  const taskResults = useSelector((state: RootState) => state.moderationTranslation.taskResults);
  const { results, count, next } = taskResults;

  const fetchMoreResults = async () => {
    if (next) {
      const taskResponse = await fetch(next);
      if (taskResponse.ok) {
        const taskResult = await (taskResponse.json() as Promise<{
          count: number;
          next: string;
          results: ModerationTranslationTaskResult[];
        }>);

        console.log("TASK RESPONSE", taskResult);

        if (taskResult && taskResult.results && taskResult.results.length > 0) {
          const { results: moreResults, next: nextBatch } = taskResult;

          dispatch(
            setModerationTranslationTaskResults({
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
          {i18n.t("moderation.button.showMore")}
        </Button>
      )}
    </div>
  );
};

export default MoreResultsButton;
