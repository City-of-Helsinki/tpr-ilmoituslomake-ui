import React, { Dispatch, ChangeEvent, ReactElement, SetStateAction, Fragment, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Checkbox, Link as HdsLink } from "hds-react";
import { ModerationTranslationAction } from "../../../state/actions/moderationTranslationTypes";
import { setModerationTranslationSelectedTasks } from "../../../state/actions/moderationTranslation";
import { RootState } from "../../../state/reducers";
import { TaskStatus } from "../../../types/constants";
import { ModerationTranslationTaskResult } from "../../../types/general";
import { getDisplayName } from "../../../utils/helper";
import { defaultLocale } from "../../../utils/i18n";
import TaskStatusLabel from "../../common/TaskStatusLabel";
import styles from "./TaskResults.module.scss";

// Note: The task filter has an attribute that uses a media query which does not work when server-side rendering
const DynamicTaskResultsFilter = dynamic(() => import("../TaskResultsFilter"), { ssr: false });

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
          return taskStatus === TaskStatus.Closed || taskStatus === TaskStatus.Cancelled;
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

  return (
    <div className={`formSection ${styles.taskResults}`}>
      {filteredTaskResults.length > 0 && (
        <div className={styles.headerRow}>
          <h2 className="moderation">{`${i18n.t("moderation.translation.taskResults.found")} ${filteredTaskResults.length} / ${count} ${i18n.t(
            "moderation.translation.taskResults.tasks"
          )}`}</h2>
          <div className="flexSpace" />
        </div>
      )}

      {searchDone && filteredTaskResults.length === 0 && (
        <div className={styles.headerRow}>
          <h2 className="moderation">{i18n.t("moderation.translation.taskResults.notFound")}</h2>
          <div className="flexSpace" />
        </div>
      )}

      {filteredTaskResults.length > 0 && (
        <div className={styles.optionsRow}>
          <Checkbox
            id="selectAllTasks"
            label={i18n.t("moderation.translation.taskResults.selectAll")}
            checked={isAllTasksSelected}
            onChange={selectAllTasks}
          />
          <div className="flexSpace" />
          <DynamicTaskResultsFilter prefix="moderation.translation" showResults={showResults} setShowResults={setShowResults} isHorizontalWhenXS />
        </div>
      )}

      {filteredTaskResults.length > 0 && (
        <div className={`gridLayoutContainer ${styles.results}`}>
          <div className={`${styles.gridColumn1} ${styles.gridHeader}`}>
            <div className={styles.flexItem}>{i18n.t("moderation.translation.taskResults.translationTask")}</div>
          </div>
          <div className={`${styles.gridColumn2} ${styles.gridHeader}`}>
            <div className={styles.flexItem}>{i18n.t("moderation.translation.taskResults.request")}</div>
          </div>
          <div className={`${styles.gridColumn3} ${styles.gridHeader}`}>
            <div className={styles.flexItem}>{i18n.t("moderation.translation.taskResults.languagePair")}</div>
          </div>
          <div className={`${styles.gridColumn4} ${styles.gridHeader}`}>
            <div className={styles.flexItem}>{i18n.t("moderation.translation.taskResults.translator")}</div>
          </div>
          <div className={`${styles.gridColumn5} ${styles.gridHeader}`}>
            <div className={styles.flexItem}>{i18n.t("moderation.translation.taskResults.status")}</div>
          </div>

          {filteredTaskResults
            .sort((a: ModerationTranslationTaskResult, b: ModerationTranslationTaskResult) => b.updated.getTime() - a.updated.getTime())
            .map((result) => {
              const { id: taskId, formattedRequest, language, target, translator, taskStatus } = result;
              const { id: targetId, name } = target || {};
              const { from: translateFrom, to: translateTo } = language;

              return (
                <Fragment key={`taskresult_${taskId}`}>
                  <div className={`${styles.gridColumn1} ${styles.gridContent}`}>
                    <div className={styles.flexItem}>
                      <Checkbox
                        id={`taskcheckbox_${taskId}`}
                        value={`task_${taskId}`}
                        checked={selectedTaskIds.includes(String(taskId))}
                        onChange={updateSelectedTasks}
                      />

                      <Link href={`/moderation/translation/task/${taskId}`}>
                        <HdsLink href="#" size="M" disableVisitedStyles>
                          {`${getDisplayName(router.locale || defaultLocale, name, undefined, i18n.t("moderation.translation.taskResults.empty"))}${
                            targetId ? ` (${targetId})` : ""
                          }`}
                        </HdsLink>
                      </Link>
                    </div>
                  </div>
                  <div className={`${styles.gridColumn2} ${styles.gridContent}`}>
                    <div className={styles.flexItem}>
                      <span className={styles.mobileOnly}>{`${i18n.t("moderation.translation.taskResults.request")}: `}</span>
                      {formattedRequest}
                    </div>
                  </div>
                  <div className={`${styles.gridColumn3} ${styles.gridContent}`}>
                    <div className={styles.flexItem}>
                      <span className={styles.mobileOnly}>{`${i18n.t("moderation.translation.taskResults.languagePair")}: `}</span>
                      {`${translateFrom.toUpperCase()}-${translateTo.toUpperCase()}`}
                    </div>
                  </div>
                  <div className={`${styles.gridColumn4} ${styles.gridContent}`}>
                    <div className={styles.flexItem}>
                      <span className={styles.mobileOnly}>{`${i18n.t("moderation.translation.taskResults.translator")}: `}</span>
                      {translator ? `${translator.first_name} ${translator.last_name}` : ""}
                    </div>
                  </div>
                  <div className={`${styles.gridColumn5} ${styles.gridContent}`}>
                    <div className={styles.flexItem}>
                      <span className={styles.mobileOnly}>{`${i18n.t("moderation.translation.taskResults.status")}: `}</span>
                      <TaskStatusLabel prefix="moderation.translation" status={taskStatus} includeIcons />
                    </div>
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
