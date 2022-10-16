import { SurfaceDropComponent, SurfaceDropProps } from '@jsplumbtoolkit/browser-ui-react-drop';

import { StatusType } from 'lib/types/workflow';

import StatusButton from './StatusButton';

interface StatusContainer {
  props: {
    statusList: StatusType[];
    draggedStatus: string[];
    dataGenerator: (el: Element) => Record<string, any>;
  } & SurfaceDropProps;
}

class StatusContainer extends SurfaceDropComponent {
  render(): React.ReactElement[] {
    return this.props.statusList.map(({ objectId: id, type, name }: any) => {
      return <StatusButton key={id} id={id} name={name} type={type} draggedStatus={this.props.draggedStatus} />;
    });
  }
}

export default StatusContainer;
