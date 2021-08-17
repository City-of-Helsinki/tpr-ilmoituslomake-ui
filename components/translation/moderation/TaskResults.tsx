import React, { Dispatch, ChangeEvent, ReactElement, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, Checkbox, IconPen } from "hds-react";
import moment from "moment";
import { ModerationTranslationAction } from "../../../state/actions/moderationTranslationTypes";
import { setModerationTranslationSelectedTasks, setModerationTranslationTaskResults } from "../../../state/actions/moderationTranslation";
import { RootState } from "../../../state/reducers";
import { DATETIME_FORMAT } from "../../../types/constants";
import { ModerationTranslationTaskResult } from "../../../types/general";
import { getTaskStatus, getTaskType } from "../../../utils/conversion";
import { getDisplayName } from "../../../utils/helper";
import { defaultLocale } from "../../../utils/i18n";
import TaskStatusLabel from "../../common/TaskStatusLabel";
import styles from "./TaskResults.module.scss";

const TaskResults = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationTranslationAction>>();
  const router = useRouter();

  const taskResults = useSelector((state: RootState) => state.moderationTranslation.taskResults);
  const { results, count, next } = taskResults;
  const taskSearch = useSelector((state: RootState) => state.moderationTranslation.taskSearch);
  const { request: searchRequest, searchDone } = taskSearch;
  const selectedTasks = useSelector((state: RootState) => state.moderationTranslation.selectedTasks);
  const { selectedIds: selectedTaskIds, isAllSelected } = selectedTasks;

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
                ...moreResults
                  .map((result) => {
                    return {
                      ...result,
                      created: moment(result.created_at).toDate(),
                      updated: moment(result.updated_at).toDate(),
                      taskType: getTaskType(result.category, result.item_type),
                      taskStatus: getTaskStatus(result.status),
                      formattedRequest: moment(result.request).format(DATETIME_FORMAT),
                    };
                  })
                  .filter((result) => {
                    const { formattedRequest } = result;
                    return searchRequest.length === 0 || searchRequest === formattedRequest;
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

  const updateSelectedTasks = (evt: ChangeEvent<HTMLInputElement>) => {
    const taskId = evt.target.value.replace("task_", "");
    const newSelectedTaskIds = evt.target.checked ? [...selectedTaskIds, taskId] : selectedTaskIds.filter((id) => id !== taskId);
    dispatch(
      setModerationTranslationSelectedTasks({
        selectedIds: newSelectedTaskIds,
        isAllSelected: newSelectedTaskIds.length === results.length,
      })
    );
  };

  const selectAllTasks = () => {
    dispatch(
      setModerationTranslationSelectedTasks({
        selectedIds: !isAllSelected ? results.map((result) => String(result.id)) : [],
        isAllSelected: !isAllSelected,
      })
    );
  };

  const cancelTranslationTask = () => {
    // TODO
  };

  return (
    <div className={`formSection ${styles.taskResults}`}>
      {results.length > 0 && (
        <h2 className="moderation">{`${i18n.t("moderation.translation.taskResults.found")} ${results.length} / ${count} ${i18n.t(
          "moderation.translation.taskResults.tasks"
        )}`}</h2>
      )}

      {results.length > 0 && (
        <div className={styles.optionsRow}>
          <Checkbox
            id="selectAllTasks"
            label={i18n.t("moderation.translation.taskResults.selectAll")}
            checked={isAllSelected}
            onChange={selectAllTasks}
          />
          <div className="flexSpace" />
          <Button variant="secondary" onClick={cancelTranslationTask}>
            {i18n.t("moderation.button.cancelTranslationTask")}
          </Button>
        </div>
      )}

      {searchDone && results.length === 0 && <h2>{i18n.t("moderation.translation.taskResults.notFound")}</h2>}

      {results.length > 0 && (
        <div className={`gridLayoutContainer ${styles.results}`}>
          <div className={`${styles.gridColumn1} ${styles.gridHeader}`}>{i18n.t("moderation.translation.taskResults.translationTask")}</div>
          <div className={`${styles.gridColumn2} ${styles.gridHeader}`}>{i18n.t("moderation.translation.taskResults.request")}</div>
          <div className={`${styles.gridColumn3} ${styles.gridHeader}`}>{i18n.t("moderation.translation.taskResults.languagePair")}</div>
          <div className={`${styles.gridColumn4} ${styles.gridHeader}`}>{i18n.t("moderation.translation.taskResults.translator")}</div>
          <div className={`${styles.gridColumn5} ${styles.gridHeader}`}>{i18n.t("moderation.translation.taskResults.status")}</div>

          {results
            .sort((a: ModerationTranslationTaskResult, b: ModerationTranslationTaskResult) => b.updated.getTime() - a.updated.getTime())
            .map((result) => {
              const { id: taskId, formattedRequest, language, target, translator, taskStatus } = result;
              const { id: targetId, name } = target || {};
              const { from: translateFrom, to: translateTo } = language;

              return (
                <Fragment key={`taskresult_${taskId}`}>
                  <div className={`${styles.gridColumn1} ${styles.gridContent} ${styles.gridButton}`}>
                    <div className={styles.checkboxLink}>
                      <Checkbox
                        id={`taskcheckbox_${taskId}`}
                        value={`task_${taskId}`}
                        checked={selectedTaskIds.includes(String(taskId))}
                        onChange={updateSelectedTasks}
                      />

                      <Link href={`/moderation/translation/task/${taskId}`}>
                        <Button variant="supplementary" size="small" iconLeft={<IconPen aria-hidden />}>
                          {`${getDisplayName(router.locale || defaultLocale, name, undefined, i18n.t("moderation.translation.taskResults.empty"))}${
                            targetId ? ` (${targetId})` : ""
                          }`}
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className={`${styles.gridColumn2} ${styles.gridContent}`}>{formattedRequest}</div>
                  <div className={`${styles.gridColumn3} ${styles.gridContent}`}>{`${translateFrom.toUpperCase()}-${translateTo.toUpperCase()}`}</div>
                  <div className={`${styles.gridColumn4} ${styles.gridContent}`}>{translator.name}</div>
                  <div className={`${styles.gridColumn5} ${styles.gridContent}`}>
                    <TaskStatusLabel prefix="moderation.translation" status={taskStatus} includeIcons />
                  </div>
                </Fragment>
              );
            })}
        </div>
      )}

      <div className={styles.nextResults}>
        {next && (
          <Button variant="secondary" onClick={fetchMoreResults}>
            {i18n.t("moderation.button.showMore")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskResults;
