import { useCallback } from 'react';
import { useRouter } from 'next/router';

import { WorkflowEditor } from 'components/flow';
import { useToken } from 'lib/hooks';
const Workflow: React.FC = () => {
  const { query, push } = useRouter();
  const { tenant } = useToken();
  const parentUrl = `/${tenant}/settings/workflow`;
  const processId = query.id as string;

  const back = useCallback(() => {
    push(parentUrl);
  }, [push, parentUrl]);

  return <WorkflowEditor id={processId} routerBack={back} routerPush={push} parentUrl={parentUrl} />;
};

export default Workflow;
