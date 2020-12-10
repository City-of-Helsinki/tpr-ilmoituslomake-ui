import { TaskCategory, TaskStatus, TaskType } from "../types/constants";

export const getTaskType = (category: string): TaskType => {
  // TODO - improve this categorisation
  const taskCategory = category ? (category as TaskCategory) : TaskCategory.Unknown;
  if (taskCategory === TaskCategory.ModerationTask) {
    return TaskType.New;
  }
  if (taskCategory === TaskCategory.ChangeRequest) {
    return TaskType.Change;
  }
  return TaskType.Unknown;
};

export const getTaskStatus = (status: string): TaskStatus => (status ? (status as TaskStatus) : TaskStatus.Unknown);
