import React, { Dispatch, ChangeEvent, ReactElement, SetStateAction, Fragment, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, Checkbox, IconPen } from "hds-react";
import { ModerationTranslationAction } from "../../../state/actions/moderationTranslationTypes";
import { setModerationTranslationSelectedTasks } from "../../../state/actions/moderationTranslation";
import { RootState } from "../../../state/reducers";
import { TaskStatus } from "../../../types/constants";
import { ModerationTranslationTaskResult } from "../../../types/general";
import { getDisplayName } from "../../../utils/helper";
import { defaultLocale } from "../../../utils/i18n";
import TaskStatusLabel from "../../common/TaskStatusLabel";
import TaskResultsFilter from "../TaskResultsFilter";
import styles from "./TaskResults.module.scss";

interface TaskResultsProps {
  showStatus: string;
  showResults: string;
  setShowResults: Dispatch<SetStateAction<string>>;
}

const TaskResults = ({ showStatus, showResults, setShowResults }: TaskResultsProps): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationTranslationAction>>();
  const router = useRouter();

  const taskResults = useSelector((state: RootState) => state.moderationTranslation.taskResults);
  const { results, count } = taskResults;
  const taskSearch = useSelector((state: RootState) => state.moderationTranslation.taskSearch);
  const { request: searchRequest, searchDone } = taskSearch;
  const selectedTasks = useSelector((state: RootState) => state.moderationTranslation.selectedTasks);
  const { selectedIds: selectedTaskIds, isAllSelected: isAllTasksSelected } = selectedTasks;

  const filterStatus = useCallback(
    (taskStatus: TaskStatus) => {
      switch (showStatus) {
        case "active": {
          return taskStatus === TaskStatus.Open || taskStatus === TaskStatus.InProgress;
        }
        case "submitted": {
          return taskStatus === TaskStatus.Closed;
        }
        default: {
          return true;
        }
      }
    },
    [showStatus]
  );

  const filteredTaskResults = useMemo(
    () =>
      results.filter((result) => {
        const { formattedRequest, taskStatus } = result;
        return (searchRequest.length === 0 || searchRequest === formattedRequest) && filterStatus(taskStatus);
      }),
    [results, searchRequest, filterStatus]
  );

  const updateSelectedTasks = (evt: ChangeEvent<HTMLInputElement>) => {
    const taskId = evt.target.value.replace("task_", "");
    const newSelectedTaskIds = evt.target.checked ? [...selectedTaskIds, taskId] : selectedTaskIds.filter((id) => id !== taskId);
    dispatch(
      setModerationTranslationSelectedTasks({
        selectedIds: newSelectedTaskIds,
        isAllSelected: newSelectedTaskIds.length === filteredTaskResults.length,
      })
    );
  };

  const selectAllTasks = () => {
    dispatch(
      setModerationTranslationSelectedTasks({
        selectedIds: !isAllTasksSelected ? filteredTaskResults.map((result) => String(result.id)) : [],
        isAllSelected: !isAllTasksSelected,
      })
    );
  };

  const cancelTranslationTask = () => {
    // TODO
  };

  return (
    <div className={`formSection ${styles.taskResults}`}>
      {filteredTaskResults.length > 0 && (
        <h2 className="moderation">{`${i18n.t("moderation.translation.taskResults.found")} ${filteredTaskResults.length} / ${count} ${i18n.t(
          "moderation.translation.taskResults.tasks"
        )}`}</h2>
      )}

      {searchDone && filteredTaskResults.length === 0 && <h2 className="moderation">{i18n.t("moderation.translation.taskResults.notFound")}</h2>}

      {filteredTaskResults.length > 0 && (
        <div className={styles.optionsRow}>
          <Checkbox
            id="selectAllTasks"
            label={i18n.t("moderation.translation.taskResults.selectAll")}
            checked={isAllTasksSelected}
            onChange={selectAllTasks}
          />
          <div className="flexSpace" />
          <TaskResultsFilter prefix="moderation.translation" showResults={showResults} setShowResults={setShowResults} />
          <div className="flexSpace" />
          <Button variant="secondary" onClick={cancelTranslationTask}>
            {i18n.t("moderation.button.cancelTranslationTask")}
          </Button>
        </div>
      )}

      {filteredTaskResults.length > 0 && (
        <div className={`gridLayoutContainer ${styles.results}`}>
          <div className={`${styles.gridColumn1} ${styles.gridHeader}`}>{i18n.t("moderation.translation.taskResults.translationTask")}</div>
          <div className={`${styles.gridColumn2} ${styles.gridHeader}`}>{i18n.t("moderation.translation.taskResults.request")}</div>
          <div className={`${styles.gridColumn3} ${styles.gridHeader}`}>{i18n.t("moderation.translation.taskResults.languagePair")}</div>
          <div className={`${styles.gridColumn4} ${styles.gridHeader}`}>{i18n.t("moderation.translation.taskResults.translator")}</div>
          <div className={`${styles.gridColumn5} ${styles.gridHeader}`}>{i18n.t("moderation.translation.taskResults.status")}</div>

          {filteredTaskResults
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
    </div>
  );
};

export default TaskResults;
