import { useCallback, useState } from 'react';
import { LeftCircleOutlined } from '@ant-design/icons';
import { Input, Row, Spin } from 'antd';
import { debounce } from 'lodash';

import { WorkFlowStatusColor } from 'lib/global/workflow';
import useI18n from 'lib/hooks/useI18n';
import { StatusType } from 'lib/types/workflow';

import StatusButton from './StatusButton';

import cx from '../index.less';

interface WorkflowStatusProps {
  list: StatusType[];
  loading: boolean;
  draggedStatus: string[];
  getList: (key?: string) => void;
}

const WorkflowStatus: React.FC<WorkflowStatusProps> = ({ list: statusList, loading, draggedStatus, getList }) => {
  const { t } = useI18n();
  const [fold, setFold] = useState(false);

  const statusSearch = useCallback(
    (e: { target: { value: string } }) => {
      getList(e.target.value);
    },
    [getList],
  );

  return (
    <aside className={cx('workflow-status-container', { fold })}>
      <span className={cx('workflow-status-icon', { fold })} onClick={() => setFold(f => !f)}>
        <LeftCircleOutlined />
      </span>
      <div className={cx('workflow-status-content', { fold })}>
        <div className={cx('status-content-header')}>
          <h4 className={cx('description')}>{t('pages.workflow.columns.releaseStatus')}</h4>
          <Input.Search
            onChange={debounce(statusSearch, 300)}
            placeholder={t('pages.workflow.placeholder.statusNameKeyWord')}
          />
        </div>
        <div className={cx('status-content-body')}>
          <Spin spinning={loading}>
            <Row gutter={8} className={cx('status-wrapper')}>
              {statusList.map(({ objectId: id, type, name }) => {
                return (
                  <StatusButton
                    key={id}
                    id={id}
                    name={name}
                    type={type}
                    color={WorkFlowStatusColor[type].color}
                    bgColor={WorkFlowStatusColor[type].bgColor}
                    draggedStatus={draggedStatus}
                  />
                );
              })}
            </Row>
          </Spin>
        </div>
      </div>
    </aside>
  );
};

WorkflowStatus.defaultProps = {};

export default WorkflowStatus;
