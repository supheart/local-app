import React from 'react';
import { BasePortComponent, BasePortProps } from '@jsplumbtoolkit/browser-ui-react';

import cx from './index.less';

interface PortProps {
  type: string;
  node: any;
}

interface PortState {
  name: string;
  id: string;
}

class Port extends BasePortComponent<PortProps & BasePortProps, PortState> {
  constructor(props: PortState) {
    super(props);
  }

  render(): React.ReactElement {
    console.info('port', this.props);
    const typeClass = this.props.type.toLocaleLowerCase();
    return (
      <div className={cx('node-point-wrapper', typeClass)}>
        <div
          id={`${this.props.node.id}_${typeClass}`}
          className={cx('node-point')}
          data-jtk-port-type={this.props.type}
          data-jtk-port={`${this.props.node.id}_${typeClass}`}
          data-jtk-source={true}
          data-jtk-target={true}
          // data-jtk-anchor-x="0.5"
          // data-jtk-anchor-y="0.5"
          // data-jtk-endpoint="true"
          // data-jtk-anchor-offset-x="0"
          // data-jtk-anchor-offset-y="0"
          // data-jtk-anchor-orientation-x="1"
          // data-jtk-anchor-orientation-y="1"
        >
          {/* <div>
          <span>{state.name}</span>
        </div> */}
        </div>
        {/* <div className={cx('aabb')}></div> */}
      </div>
    );
  }
}

export default Port;
