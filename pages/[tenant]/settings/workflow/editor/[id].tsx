import { useCallback } from 'react';
import { useRouter } from 'next/router';

import { WorkflowEditor } from 'components/workflow';
// import { getSettingServerSideProps } from 'lib/defaultServerSideProps';
import { useToken } from 'lib/hooks';
// import { i18n } from 'lib/i18n';
// import { withSettingLayout } from 'lib/withPageLayout';

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
// export default withSettingLayout(Workflow, i18n.t('pages.workflow.default.edit.title'));

// export const getServerSideProps = getSettingServerSideProps('workflow-editor-detail');
