import React from 'react';

import { WorkFlowStatusColor, WorkflowStatusType } from 'lib/global/workflow';
import useI18n from 'lib/hooks/useI18n';

import cx from './index.less';

interface StatusTagType {
  data: { type: WorkflowStatusType; name?: string };
  isAny?: boolean;
}

const StatusTag: React.VFC<StatusTagType> = ({ data, isAny }) => {
  const { t } = useI18n();
  if (isAny) {
    return <span className={cx('workflow-status-tag', 'is-any')}>{t('pages.workflow.views.anyState')}</span>;
  } else {
    return (
      <span
        className={cx('workflow-status-tag')}
        style={{
          backgroundColor: WorkFlowStatusColor[data?.type]?.bgColor,
          color: WorkFlowStatusColor[data?.type]?.color,
        }}
      >
        {data?.name}
      </span>
    );
  }
};

export default StatusTag;
