// import { EncodedParseQuery } from '@parse/react-ssr';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

// import { getAllPart } from 'components/board/manage/hook';
import { WorkspaceLayout } from 'components/layout';
// import { withServerError } from 'lib/error';
// import fetch, { getRequestConfig } from 'lib/fetch';
// import { Workspace } from 'lib/models';
// import withServerPermission from 'lib/permission/withServerPermission';
// import { getUserTenant, getUserToken } from 'lib/token';
import { Workspace } from 'lib/types/models.d';
// import withPermission from 'lib/withPermission';

interface BoardProps {
  workspace: Workspace;
}

const WorkspacePage: React.FC<BoardProps> = ({ workspace }) => {
  return <WorkspaceLayout workspace={workspace} redirect />;
};

export default WorkspacePage;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  return {
    props: {}
  };
}
