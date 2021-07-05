import React, { Dispatch, ReactElement, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, IconPen } from "hds-react";
import moment from "moment";
import { TranslationAction } from "../../state/actions/translationTypes";
import { setTranslationTaskResults } from "../../state/actions/translation";
import { RootState } from "../../state/reducers";
import { TranslationTaskResult } from "../../types/general";
import { getTaskStatus, getTaskType } from "../../utils/conversion";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import TaskStatusLabel from "./TaskStatusLabel";
import styles from "./TaskResults.module.scss";

const TaskResults = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<TranslationAction>>();
  const router = useRouter();

  const taskResults = useSelector((state: RootState) => state.translation.taskResults);
  const { results, count, next } = taskResults;
  const taskSearch = useSelector((state: RootState) => state.translation.taskSearch);
  const { request: searchRequest, searchDone } = taskSearch;

  const fetchMoreResults = async () => {
    if (next) {
      const taskResponse = await fetch(next);
      if (taskResponse.ok) {
        const taskResult = await (taskResponse.json() as Promise<{ count: number; next: string; results: TranslationTaskResult[] }>);

        console.log("TASK RESPONSE", taskResult);

        if (taskResult && taskResult.results && taskResult.results.length > 0) {
          const { results: moreResults, next: nextBatch } = taskResult;

          dispatch(
            setTranslationTaskResults({
              results: [
                ...results,
                ...moreResults
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
    <div className={`formSection ${styles.taskResults}`}>
      {results.length > 0 && (
        <h2>{`${i18n.t("translation.taskResults.found")} ${results.length} / ${count} ${i18n.t("translation.taskResults.tasks")}`}</h2>
      )}

      {searchDone && results.length === 0 && <h2>{i18n.t("translation.taskResults.notFound")}</h2>}

      {results.length > 0 && (
        <div className={`gridLayoutContainer ${styles.results}`}>
          <div className={`${styles.gridColumn1} ${styles.gridHeader}`}>{i18n.t("translation.taskResults.translationTask")}</div>
          <div className={`${styles.gridColumn2} ${styles.gridHeader}`}>{i18n.t("translation.taskResults.request")}</div>
          <div className={`${styles.gridColumn3} ${styles.gridHeader}`}>{i18n.t("translation.taskResults.moderator")}</div>
          <div className={`${styles.gridColumn4} ${styles.gridHeader}`}>{i18n.t("translation.taskResults.status")}</div>
          {results
            .sort((a: TranslationTaskResult, b: TranslationTaskResult) => b.updated.getTime() - a.updated.getTime())
            .map((result) => {
              const { id, request: resultRequest, target, moderator, taskStatus } = result;
              const { id: targetId, name } = target || {};

              return (
                <Fragment key={`taskresult_${id}`}>
                  <div className={`${styles.gridColumn1} ${styles.gridContent} ${styles.gridButton}`}>
                    <Link href={`/translation/task/${id}`}>
                      <Button variant="supplementary" size="small" iconLeft={<IconPen aria-hidden />}>
                        {`${getDisplayName(router.locale || defaultLocale, name, undefined, i18n.t("translation.taskResults.empty"))}${
                          targetId ? ` (${targetId})` : ""
                        }`}
                      </Button>
                    </Link>
                  </div>
                  <div className={`${styles.gridColumn2} ${styles.gridContent}`}>{resultRequest}</div>
                  <div className={`${styles.gridColumn3} ${styles.gridContent}`}>
                    {moderator ? `${moderator.first_name} ${moderator.last_name}`.trim() : ""}
                  </div>
                  <div className={`${styles.gridColumn4} ${styles.gridContent}`}>
                    <TaskStatusLabel status={taskStatus} />
                  </div>
                </Fragment>
              );
            })}
        </div>
      )}

      <div className={styles.nextResults}>
        {next && (
          <Button variant="secondary" onClick={fetchMoreResults}>
            {i18n.t("translation.button.showMore")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskResults;
