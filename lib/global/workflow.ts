export enum WorkflowStatusType {
  Start = 'Start',
  InProgress = 'InProgress',
  Finished = 'Finished',
}

export const WorkFlowStatusColor = {
  [WorkflowStatusType.Start]: { color: '#0C62FF', bgColor: '#E6F3FF' },
  [WorkflowStatusType.InProgress]: { color: '#FFAA0C', bgColor: '#FEF5D0' },
  [WorkflowStatusType.Finished]: { color: '#09B866', bgColor: '#DFF7E8' },
};
