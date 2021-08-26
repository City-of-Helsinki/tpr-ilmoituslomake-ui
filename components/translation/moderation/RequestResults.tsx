import React, { Dispatch, ChangeEvent, ReactElement, SetStateAction, Fragment, useCallback, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { useI18n } from "next-localization";
import { Button, Checkbox, IconPen } from "hds-react";
import { ModerationTranslationAction } from "../../../state/actions/moderationTranslationTypes";
import { setModerationTranslationSelectedRequests } from "../../../state/actions/moderationTranslation";
import { RootState } from "../../../state/reducers";
import { TaskStatus, Toast } from "../../../types/constants";
import { TranslationRequestResult, TranslationRequestResultTask } from "../../../types/general";
import { cancelMultipleModerationTranslationRequests } from "../../../utils/moderation";
import ModalConfirmation from "../../common/ModalConfirmation";
import ToastNotification from "../../common/ToastNotification";
import TaskStatusLabel from "../../common/TaskStatusLabel";
import TaskResultsFilter from "../TaskResultsFilter";
import styles from "./RequestResults.module.scss";

interface RequestResultsProps {
  showStatus: string;
  showResults: string;
  setShowResults: Dispatch<SetStateAction<string>>;
}

const RequestResults = ({ showStatus, showResults, setShowResults }: RequestResultsProps): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationTranslationAction>>();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.general.user);

  const taskResults = useSelector((state: RootState) => state.moderationTranslation.taskResults);
  const { results } = taskResults;
  const taskSearch = useSelector((state: RootState) => state.moderationTranslation.taskSearch);
  const { request: searchRequest, searchDone } = taskSearch;
  const selectedRequests = useSelector((state: RootState) => state.moderationTranslation.selectedRequests);
  const { selectedIds: selectedRequestIds, isAllSelected: isAllRequestsSelected } = selectedRequests;

  const [toast, setToast] = useState<Toast>();
  const [confirmCancel, setConfirmCancel] = useState(false);

  const openCancelConfirmation = () => {
    setConfirmCancel(true);
  };

  const closeCancelConfirmation = () => {
    setConfirmCancel(false);
  };

  const requestResults = useMemo(
    () =>
      results.reduce((acc: TranslationRequestResult[], result) => {
        const { id: taskId, target, taskType, taskStatus } = result;
        const taskResult = { id: taskId, target, taskType, taskStatus };

        const requestResult = acc.find((r) => r.id === result.requestId);
        if (!requestResult) {
          // Create the request data
          const { requestId, request, formattedRequest, language, translator, moderator, updated_at, updated } = result;
          const newRequestResult = {
            id: requestId,
            request,
            formattedRequest,
            language,
            tasks: [taskResult],
            translator,
            moderator,
            updated_at,
            updated,
          };
          return [...acc, newRequestResult];
        }

        // Add the task to the existing request data
        requestResult.tasks = [...requestResult.tasks, taskResult];
        return acc;
      }, []),
    [results]
  );

  const taskCounts = (tasks: TranslationRequestResultTask[]) => {
    return tasks.reduce(
      (acc: { [key: string]: number }, task) => {
        acc[task.taskStatus] += 1;
        return acc;
      },
      { [TaskStatus.Open]: 0, [TaskStatus.InProgress]: 0, [TaskStatus.Closed]: 0 }
    );
  };

  const requestStatus = useCallback((tasks: TranslationRequestResultTask[]) => {
    const counts = taskCounts(tasks);
    if (counts[TaskStatus.Open] === tasks.length) {
      // All the tasks are open, so the request is open
      return TaskStatus.Open;
    }
    if (counts[TaskStatus.Closed] === tasks.length) {
      // All the tasks are closed, so the request is closed
      return TaskStatus.Closed;
    }
    // There is a mixed status, so the request is in progress
    return TaskStatus.InProgress;
  }, []);

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

  const filteredRequestResults = useMemo(
    () =>
      requestResults.filter((result) => {
        const { formattedRequest, tasks } = result;
        return (searchRequest.length === 0 || searchRequest === formattedRequest) && filterStatus(requestStatus(tasks));
      }),
    [requestResults, searchRequest, filterStatus, requestStatus]
  );

  const updateSelectedRequests = (evt: ChangeEvent<HTMLInputElement>) => {
    const requestId = evt.target.value.replace("request_", "");
    const newSelectedRequestIds = evt.target.checked ? [...selectedRequestIds, requestId] : selectedRequestIds.filter((id) => id !== requestId);
    dispatch(
      setModerationTranslationSelectedRequests({
        selectedIds: newSelectedRequestIds,
        isAllSelected: newSelectedRequestIds.length === filteredRequestResults.length,
      })
    );
  };

  const selectAllRequests = () => {
    dispatch(
      setModerationTranslationSelectedRequests({
        selectedIds: !isAllRequestsSelected ? filteredRequestResults.map((result) => String(result.id)) : [],
        isAllSelected: !isAllRequestsSelected,
      })
    );
  };

  const cancelRequest = () => {
    closeCancelConfirmation();

    const requestIds = selectedRequestIds.map((id) => Number(id));
    if (requestIds.length > 0) {
      cancelMultipleModerationTranslationRequests(currentUser, requestIds, router, setToast);
    }
  };

  return (
    <div className={`formSection ${styles.requestResults}`}>
      {filteredRequestResults.length > 0 && (
        <div className={styles.headerRow}>
          <h2 className="moderation">{`${i18n.t("moderation.translation.requestResults.found")} ${filteredRequestResults.length} / ${
            requestResults.length
          } ${i18n.t("moderation.translation.requestResults.requests")}`}</h2>
          <div className="flexSpace" />
          <Button variant="secondary" onClick={openCancelConfirmation}>
            {i18n.t("moderation.button.cancelTranslationRequests")}
          </Button>
        </div>
      )}

      {searchDone && filteredRequestResults.length === 0 && (
        <div className={styles.headerRow}>
          <h2 className="moderation">{i18n.t("moderation.translation.requestResults.notFound")}</h2>
          <div className="flexSpace" />
        </div>
      )}

      {filteredRequestResults.length > 0 && (
        <div className={styles.optionsRow}>
          <Checkbox
            id="selectAllRequests"
            label={i18n.t("moderation.translation.requestResults.selectAll")}
            checked={isAllRequestsSelected}
            onChange={selectAllRequests}
          />
          <div className="flexSpace" />
          <TaskResultsFilter prefix="moderation.translation" showResults={showResults} setShowResults={setShowResults} />
        </div>
      )}

      {filteredRequestResults.length > 0 && (
        <div className={`gridLayoutContainer ${styles.results}`}>
          <div className={`${styles.gridColumn1} ${styles.gridHeader}`}>{i18n.t("moderation.translation.requestResults.translationRequest")}</div>
          <div className={`${styles.gridColumn2} ${styles.gridHeader}`}>{i18n.t("moderation.translation.requestResults.translator")}</div>
          <div className={`${styles.gridColumn3} ${styles.gridHeader}`}>{i18n.t("moderation.translation.requestResults.languagePair")}</div>
          <div className={`${styles.gridColumn4} ${styles.gridHeader}`}>{i18n.t("moderation.translation.requestResults.translationTasks")}</div>
          <div className={`${styles.gridColumn5} ${styles.gridHeader}`}>{i18n.t("moderation.translation.requestResults.status")}</div>

          {filteredRequestResults
            .sort((a: TranslationRequestResult, b: TranslationRequestResult) => b.updated.getTime() - a.updated.getTime())
            .map((result) => {
              const { id: requestId, formattedRequest, language, tasks, translator } = result;
              const { from: translateFrom, to: translateTo } = language;
              const status = requestStatus(tasks);

              return (
                <Fragment key={`requestresult_${requestId}`}>
                  <div className={`${styles.gridColumn1} ${styles.gridContent} ${styles.gridButton}`}>
                    <div className={styles.checkboxLink}>
                      <Checkbox
                        id={`requestcheckbox_${requestId}`}
                        value={`request_${requestId}`}
                        checked={selectedRequestIds.includes(String(requestId))}
                        onChange={updateSelectedRequests}
                      />

                      <Link href={`/moderation/translation/request/${requestId}`}>
                        <Button variant="supplementary" size="small" iconLeft={<IconPen aria-hidden />}>
                          {formattedRequest}
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className={`${styles.gridColumn2} ${styles.gridContent}`}>{translator.name}</div>
                  <div className={`${styles.gridColumn3} ${styles.gridContent}`}>{`${translateFrom.toUpperCase()}-${translateTo.toUpperCase()}`}</div>
                  <div className={`${styles.gridColumn4} ${styles.gridContent}`}>{tasks.length}</div>
                  <div className={`${styles.gridColumn5} ${styles.gridContent}`}>
                    <TaskStatusLabel prefix="moderation.translation" status={status} includeIcons />
                  </div>
                </Fragment>
              );
            })}
        </div>
      )}

      {confirmCancel && (
        <ModalConfirmation
          open={confirmCancel}
          titleKey="moderation.button.cancelTranslationRequests"
          messageKey="moderation.confirmation.cancelTranslationRequests"
          cancelKey="moderation.button.back"
          confirmKey="moderation.button.cancel2"
          closeCallback={closeCancelConfirmation}
          confirmCallback={() => cancelRequest()}
        />
      )}

      {toast && <ToastNotification prefix="moderation" toast={toast} setToast={setToast} />}
    </div>
  );
};

export default RequestResults;
