import { ItemType, TaskCategory, TaskStatus, TaskType } from "../types/constants";

export const getTaskType = (category: string, itemType: string): TaskType => {
  const taskCategory = category ? (category as TaskCategory) : TaskCategory.Unknown;
  const taskItemType = itemType ? (itemType as ItemType) : ItemType.Unknown;

  if (taskCategory === TaskCategory.ModerationTask) {
    if (taskItemType === ItemType.ModerationTaskCreated) {
      return TaskType.NewPlace;
    }
    if (taskItemType === ItemType.ModerationTaskModified) {
      return TaskType.PlaceChange;
    }
  }
  if (taskCategory === TaskCategory.ChangeRequest) {
    if (taskItemType === ItemType.ChangeRequestChange) {
      return TaskType.ChangeTip;
    }
    if (taskItemType === ItemType.ChangeRequestAdd) {
      return TaskType.AddTip;
    }
    if (taskItemType === ItemType.ChangeRequestDelete) {
      return TaskType.RemoveTip;
    }
  }
  if (taskCategory === TaskCategory.ModeratorChangeRequest) {
    if (taskItemType === ItemType.ChangeRequestChange) {
      return TaskType.ModeratorChange;
    }
    if (taskItemType === ItemType.ChangeRequestAdd) {
      return TaskType.ModeratorAdd;
    }
    if (taskItemType === ItemType.ChangeRequestDelete) {
      return TaskType.ModeratorRemove;
    }
  }
  if (taskCategory === TaskCategory.TranslationTask) {
    if (taskItemType === ItemType.TranslationTaskCreated) {
      return TaskType.Translation;
    }
  }
  return TaskType.Unknown;
};

export const getTaskCategoryFromType = (taskType: TaskType): TaskCategory => {
  switch (taskType) {
    case TaskType.NewPlace:
    case TaskType.PlaceChange:
      return TaskCategory.ModerationTask;
    case TaskType.ChangeTip:
    case TaskType.AddTip:
    case TaskType.RemoveTip:
      return TaskCategory.ChangeRequest;
    case TaskType.ModeratorChange:
    case TaskType.ModeratorAdd:
    case TaskType.ModeratorRemove:
      return TaskCategory.ModeratorChangeRequest;
    case TaskType.Translation:
      return TaskCategory.TranslationTask;
    default:
      return TaskCategory.Unknown;
  }
};

export const getTaskItemTypeFromType = (taskType: TaskType): ItemType => {
  switch (taskType) {
    case TaskType.NewPlace:
      return ItemType.ModerationTaskCreated;
    case TaskType.PlaceChange:
      return ItemType.ModerationTaskModified;
    case TaskType.ChangeTip:
    case TaskType.ModeratorChange:
      return ItemType.ChangeRequestChange;
    case TaskType.AddTip:
    case TaskType.ModeratorAdd:
      return ItemType.ChangeRequestAdd;
    case TaskType.RemoveTip:
    case TaskType.ModeratorRemove:
      return ItemType.ChangeRequestDelete;
    case TaskType.Translation:
      return ItemType.TranslationTaskCreated;
    default:
      return ItemType.Unknown;
  }
};

export const getTaskStatus = (status: string): TaskStatus => (status ? (status as TaskStatus) : TaskStatus.Unknown);
