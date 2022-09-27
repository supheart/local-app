import React from 'react';

import { NodeProps, TransitionProps } from 'lib/types/workflow';

interface PaletteProps {
  initialData: { nodes: NodeProps[]; transitions: TransitionProps[] };
  updateNode: (element?: NodeProps | TransitionProps, updateForceNode?: boolean) => void;
  updateDraggedStatus: (statusList: string[]) => void;
  updateNewDragStatus: React.Dispatch<React.SetStateAction<string[]>>;
  checkUsedStatus: (statusId: string) => Promise<boolean>;
}

const Palette: React.FC<PaletteProps> = () => {
  return <div>111</div>;
};

export default Palette;
