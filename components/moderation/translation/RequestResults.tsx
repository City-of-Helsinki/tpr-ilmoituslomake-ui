import React, { Dispatch, ChangeEvent, ReactElement, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useI18n } from "next-localization";
import { Button, Checkbox, IconPen } from "hds-react";
import moment from "moment";
import { ModerationTranslationAction } from "../../../state/actions/moderationTranslationTypes";
import { setModerationTranslationRequestResults, setModerationTranslationSelectedRequests } from "../../../state/actions/moderationTranslation";
import { RootState } from "../../../state/reducers";
import { ModerationTranslationRequestResult } from "../../../types/general";
import { getTaskStatus, getTaskType } from "../../../utils/conversion";
import TaskStatusLabel from "../../common/TaskStatusLabel";
import styles from "./RequestResults.module.scss";

const RequestResults = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationTranslationAction>>();

  const requestResults = useSelector((state: RootState) => state.moderationTranslation.requestResults);
  const { results, count, next } = requestResults;
  const requestSearch = useSelector((state: RootState) => state.moderationTranslation.requestSearch);
  const { request: searchRequest, searchDone } = requestSearch;
  const selectedRequests = useSelector((state: RootState) => state.moderationTranslation.selectedRequests);
  const { selectedIds: selectedRequestIds, isAllSelected } = selectedRequests;

  const fetchMoreResults = async () => {
    if (next) {
      const requestResponse = await fetch(next);
      if (requestResponse.ok) {
        const requestResult = await (requestResponse.json() as Promise<{
          count: number;
          next: string;
          results: ModerationTranslationRequestResult[];
        }>);

        console.log("REQUEST RESPONSE", requestResult);

        if (requestResult && requestResult.results && requestResult.results.length > 0) {
          const { results: moreResults, next: nextBatch } = requestResult;

          dispatch(
            setModerationTranslationRequestResults({
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

  const updateSelectedRequests = (evt: ChangeEvent<HTMLInputElement>) => {
    const requestId = evt.target.value.replace("request_", "");
    const newSelectedRequestIds = evt.target.checked ? [...selectedRequestIds, requestId] : selectedRequestIds.filter((id) => id !== requestId);
    dispatch(
      setModerationTranslationSelectedRequests({
        selectedIds: newSelectedRequestIds,
        isAllSelected: newSelectedRequestIds.length === results.length,
      })
    );
  };

  const selectAllRequests = () => {
    dispatch(
      setModerationTranslationSelectedRequests({
        selectedIds: !isAllSelected ? results.map((result) => String(result.id)) : [],
        isAllSelected: !isAllSelected,
      })
    );
  };

  const cancelTranslationRequest = () => {
    // TODO
  };

  return (
    <div className={`formSection ${styles.requestResults}`}>
      {results.length > 0 && (
        <h2 className="moderation">{`${i18n.t("moderation.translation.requestResults.found")} ${results.length} / ${count} ${i18n.t(
          "moderation.translation.requestResults.requests"
        )}`}</h2>
      )}

      {results.length > 0 && (
        <div className={styles.optionsRow}>
          <Checkbox
            id="selectAllRequests"
            label={i18n.t("moderation.translation.requestResults.selectAll")}
            checked={isAllSelected}
            onChange={selectAllRequests}
          />

          <div className="flexSpace" />

          <Button variant="secondary" onClick={cancelTranslationRequest}>
            {i18n.t("moderation.button.cancelTranslationRequest")}
          </Button>
        </div>
      )}

      {searchDone && results.length === 0 && <h2>{i18n.t("moderation.translation.requestResults.notFound")}</h2>}

      {results.length > 0 && (
        <div className={`gridLayoutContainer ${styles.results}`}>
          <div className={`${styles.gridColumn1} ${styles.gridHeader}`}>{i18n.t("moderation.translation.requestResults.translationRequest")}</div>
          <div className={`${styles.gridColumn2} ${styles.gridHeader}`}>{i18n.t("moderation.translation.requestResults.translator")}</div>
          <div className={`${styles.gridColumn3} ${styles.gridHeader}`}>{i18n.t("moderation.translation.requestResults.languagePair")}</div>
          <div className={`${styles.gridColumn4} ${styles.gridHeader}`}>{i18n.t("moderation.translation.requestResults.translationTasks")}</div>
          <div className={`${styles.gridColumn5} ${styles.gridHeader}`}>{i18n.t("moderation.translation.requestResults.status")}</div>

          {results
            .sort((a: ModerationTranslationRequestResult, b: ModerationTranslationRequestResult) => b.updated.getTime() - a.updated.getTime())
            .map((result) => {
              const { id: requestId, request: resultRequest, language, tasks, translator, taskStatus } = result;
              const { from: translateFrom, to: translateTo } = language;

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
                          {resultRequest}
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className={`${styles.gridColumn2} ${styles.gridContent}`}>{translator.name}</div>
                  <div className={`${styles.gridColumn3} ${styles.gridContent}`}>{`${translateFrom.toUpperCase()}-${translateTo.toUpperCase()}`}</div>
                  <div className={`${styles.gridColumn4} ${styles.gridContent}`}>{tasks.length}</div>
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

export default RequestResults;
