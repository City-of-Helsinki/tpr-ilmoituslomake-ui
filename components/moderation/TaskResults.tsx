import React, { Dispatch, ReactElement, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "next-localization";
import { Button, IconPen } from "hds-react";
import moment from "moment";
import { ModerationAction } from "../../state/actions/types";
import { selectModerationTask } from "../../state/actions/moderation";
import { RootState } from "../../state/reducers";
import { ModerationTask } from "../../types/general";
import styles from "./TaskResults.module.scss";

const TaskResults = (): ReactElement => {
  const i18n = useI18n();
  const dispatch = useDispatch<Dispatch<ModerationAction>>();

  const taskResults = useSelector((state: RootState) => state.moderation.taskResults);

  const selectResult = (id: number) => {
    dispatch(selectModerationTask(id));
  };

  return (
    <div className="formSection">
      <h3>{`${i18n.t("moderation.taskResults.found")} ${taskResults.length} ${i18n.t("moderation.taskResults.places")}`}</h3>
      <div className={styles.taskResults}>
        <h5 className="gridColumn1 gridHeader">{i18n.t("moderation.taskResults.nameId")}</h5>
        <h5 className="gridColumn2 gridHeader">{i18n.t("moderation.taskResults.type")}</h5>
        <h5 className="gridColumn3 gridHeader">{i18n.t("moderation.taskResults.notified")}</h5>
        <h5 className="gridColumn4 gridHeader">{i18n.t("moderation.taskResults.status")}</h5>
        {taskResults
          .sort((a: ModerationTask, b: ModerationTask) => b.created.getTime() - a.created.getTime())
          .map((result) => {
            const {
              id,
              target: { id: targetId, name },
              category,
              created,
              status,
            } = result;
            return (
              <Fragment key={`taskresult_${id}`}>
                <div className={`gridColumn1 ${styles.gridContent} ${styles.gridButton}`}>
                  <Button variant="supplementary" size="small" iconLeft={<IconPen />} onClick={() => selectResult(id)}>
                    {`${name} (${targetId})`}
                  </Button>
                </div>
                <div className={`gridColumn2 ${styles.gridContent}`}>{category}</div>
                <div className={`gridColumn3 ${styles.gridContent}`}>{moment(created).format("D.M.YYYY H:m")}</div>
                <div className={`gridColumn4 ${styles.gridContent}`}>{status}</div>
              </Fragment>
            );
          })}
      </div>
    </div>
  );
};

export default TaskResults;
