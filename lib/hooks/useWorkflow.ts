import { useEffect, useState } from 'react';

import StatusList from 'components/workflow/config/status.json';
import { StatusType } from 'lib/types/workflow';

export const useWorkflowState = (): [list: StatusType[], loading: boolean, getList: (key?: string) => void] => {
  const [loading, setLoading] = useState(false);
  const [statusList, setStatusList] = useState([]);

  const getStatusList = async (keyword?: string) => {
    setLoading(true);
    try {
      let list = StatusList;
      if (keyword) {
        list = StatusList.filter(status => status.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()));
      }
      setStatusList(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 查询状态列表接口
    getStatusList();
  }, []);

  return [statusList, loading, getStatusList];
};
