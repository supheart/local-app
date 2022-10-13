import { useCallback, useState } from 'react';
import { LeftCircleOutlined } from '@ant-design/icons';
import { Input, Row, Spin } from 'antd';
import { debounce } from 'lodash';

import useI18n from 'lib/hooks/useI18n';
import { StatusType } from 'lib/types/workflow';

import ButtonContainer from './StatusContainer';

import cx from './index.less';

interface WorkflowStatusProps {
  surface: any;
  list: StatusType[];
  loading: boolean;
  draggedStatus: string[];
  getList: (key?: string) => void;
  dataGenerator: any;
}

const WorkflowStatus: React.FC<WorkflowStatusProps> = ({
  surface,
  list: statusList,
  loading,
  draggedStatus,
  getList,
  dataGenerator,
}) => {
  const { t } = useI18n();
  const [fold, setFold] = useState(false);
  const [rowElement, setRowElement] = useState(null);

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
            <Row
              gutter={8}
              className={cx('status-wrapper')}
              ref={element => {
                if (element) setRowElement(element);
              }}
            >
              {rowElement && (
                <ButtonContainer
                  surface={surface}
                  selector={'div'}
                  container={rowElement}
                  draggedStatus={draggedStatus}
                  statusList={statusList}
                  dataGenerator={dataGenerator}
                />
              )}
            </Row>
          </Spin>
        </div>
      </div>
    </aside>
  );
};

WorkflowStatus.defaultProps = {};

export default WorkflowStatus;
