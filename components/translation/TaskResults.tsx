import React, { Dispatch, ReactElement, SetStateAction, Fragment, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Link as HdsLink } from "hds-react";
import { RootState } from "../../state/reducers";
import { TaskStatus } from "../../types/constants";
import { TranslationTodoResult } from "../../types/general";
import { getDisplayName } from "../../utils/helper";
import { defaultLocale } from "../../utils/i18n";
import TaskStatusLabel from "../common/TaskStatusLabel";
import styles from "./TaskResults.module.scss";

// Note: The task filter has an attribute that uses a media query which does not work when server-side rendering
const DynamicTaskStatusFilter = dynamic(() => import("./TaskStatusFilter"), { ssr: false });
const DynamicTaskResultsFilter = dynamic(() => import("./TaskResultsFilter"), { ssr: false });

interface TaskResultsProps {
  showStatus: string;
  showResults: string;
  setShowStatus: Dispatch<SetStateAction<string>>;
  setShowResults: Dispatch<SetStateAction<string>>;
}

const TaskResults = ({ showStatus, showResults, setShowStatus, setShowResults }: TaskResultsProps): ReactElement => {
  const i18n = useI18n();
  const router = useRouter();

  const taskResults = useSelector((state: RootState) => state.translation.taskResults);
  const { results, count } = taskResults;
  const taskSearch = useSelector((state: RootState) => state.translation.taskSearch);
  const { request: searchRequest, searchDone } = taskSearch;

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

  return (
    <div className={`formSection ${styles.taskResults}`}>
      {filteredTaskResults.length > 0 && (
        <h2>{`${i18n.t("translation.taskResults.found")} ${filteredTaskResults.length} / ${count} ${i18n.t("translation.taskResults.tasks")}`}</h2>
      )}

      {searchDone && filteredTaskResults.length === 0 && <h2>{i18n.t("translation.taskResults.notFound")}</h2>}

      <div className={styles.resultsFilter}>
        <DynamicTaskStatusFilter prefix="translation" showStatus={showStatus} setShowStatus={setShowStatus} />
        <div className="flexSpace" />
        <DynamicTaskResultsFilter prefix="translation" showResults={showResults} setShowResults={setShowResults} />
      </div>

      {filteredTaskResults.length > 0 && (
        <div className={`gridLayoutContainer ${styles.results}`}>
          <div className={`${styles.gridColumn1} ${styles.gridHeader}`}>
            <div className={styles.flexItem}>{i18n.t("translation.taskResults.translationTask")}</div>
          </div>
          <div className={`${styles.gridColumn2} ${styles.gridHeader}`}>
            <div className={styles.flexItem}>{i18n.t("translation.taskResults.request")}</div>
          </div>
          <div className={`${styles.gridColumn3} ${styles.gridHeader}`}>
            <div className={styles.flexItem}>{i18n.t("translation.taskResults.moderator")}</div>
          </div>
          <div className={`${styles.gridColumn4} ${styles.gridHeader}`}>
            <div className={styles.flexItem}>{i18n.t("translation.taskResults.status")}</div>
          </div>

          {filteredTaskResults
            .sort((a: TranslationTodoResult, b: TranslationTodoResult) => b.updated.getTime() - a.updated.getTime())
            .map((result) => {
              const { id: taskId, formattedRequest, target, moderator, taskStatus } = result;
              const { id: targetId, name } = target || {};

              return (
                <Fragment key={`taskresult_${taskId}`}>
                  <div className={`${styles.gridColumn1} ${styles.gridContent} ${styles.gridButton}`}>
                    <div className={styles.flexItem}>
                      <Link href={`/translation/task/${taskId}`}>
                        <HdsLink href="#" size="M" disableVisitedStyles>
                          {`${getDisplayName(router.locale || defaultLocale, name, undefined, i18n.t("translation.taskResults.empty"))}${
                            targetId ? ` (${targetId})` : ""
                          }`}
                        </HdsLink>
                      </Link>
                    </div>
                  </div>
                  <div className={`${styles.gridColumn2} ${styles.gridContent}`}>
                    <div className={styles.flexItem}>
                      <span className={styles.mobileOnly}>{`${i18n.t("translation.taskResults.request")}: `}</span>
                      {formattedRequest}
                    </div>
                  </div>
                  <div className={`${styles.gridColumn3} ${styles.gridContent}`}>
                    <div className={styles.flexItem}>
                      <span className={styles.mobileOnly}>{`${i18n.t("translation.taskResults.moderator")}: `}</span>
                      {moderator ? `${moderator.first_name} ${moderator.last_name}`.trim() : ""}
                    </div>
                  </div>
                  <div className={`${styles.gridColumn4} ${styles.gridContent}`}>
                    <div className={styles.flexItem}>
                      <span className={styles.mobileOnly}>{`${i18n.t("translation.taskResults.status")}: `}</span>
                      <TaskStatusLabel prefix="translation" status={taskStatus} includeIcons />
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
