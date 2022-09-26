import React, { useCallback, useEffect, useRef, useState } from 'react';
import debug from 'debug';
import { RightArrow } from 'icons';

import storage from 'lib/storage';

import style from './SidebarContent.less';

type StateConfig = {
  sidebarWidth: number;
  folding: boolean;
};
const log = debug('sidebar:');

// 标识鼠标从哪个方向进入
const MouseOverFromType = {
  Sidebar: 'Sidebar', // 从侧边栏内容进入
  Control: 'Control', // 从收缩控制按钮进入
  Other: 'Other', // 从其他内容进入
};
const LAYOUT_STATE = 'LAYOUT_STATE';
const SIDEBAR_CONTROL = 'sidebarControl';
const MIN_CONTROL_WIDTH = 20; // 最小空间宽度
const DEFAULT_STATE: StateConfig = { sidebarWidth: 240, folding: false };

const SidebarContent: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => {
  const sidebarRef = useRef(null); // 整个sidebar的dom节点
  const split = useRef(null);
  const dragging = useRef(false);
  const previousClientX = useRef(0);
  const scheduledAnimationFrame = useRef(false);
  const mouseOverFrom = useRef(MouseOverFromType.Other); // 记录鼠标移动的组件方向
  const [isFold, setIsFold] = useState(false); // 是否收起
  const [isHover, setIsHover] = useState(false); // 是否聚焦到侧边栏
  const [moving, setMoving] = useState(false); // 鼠标是否按下，在移动中

  // 侧边栏展开
  const expandHandler = useCallback(() => {
    // 展开时获取flyoutWidth的值还原sideWidth
    const flyoutWidth = sidebarRef.current.style.getPropertyValue('--flyoutWidth');
    log('expand:flyoutWidth', flyoutWidth);
    sidebarRef.current.style.setProperty('--sideWidth', flyoutWidth);
    sidebarRef.current.style.setProperty('--controlWidth', '24px');
    setIsFold(false);
    // 记录状态
    const defaultLayoutConfig = storage.getItem(LAYOUT_STATE, DEFAULT_STATE);
    storage.setItem(LAYOUT_STATE, { ...defaultLayoutConfig, folding: false });
  }, [sidebarRef]);

  // 侧边栏收起
  const foldHandler = useCallback(() => {
    log('fold:SIDEBAR_CONTROL', MIN_CONTROL_WIDTH);
    // 收起时直接改变sideWidth
    setIsHover(false);
    sidebarRef.current.style.setProperty('--sideWidth', `${MIN_CONTROL_WIDTH}px`);
    sidebarRef.current.style.setProperty('--controlWidth', '0');
    setIsFold(true);
    // 记录状态
    const defaultLayoutConfig = storage.getItem(LAYOUT_STATE, DEFAULT_STATE);
    storage.setItem(LAYOUT_STATE, { ...defaultLayoutConfig, folding: true });
  }, [sidebarRef]);

  // 第一次渲染回显
  useEffect(() => {
    const defaultLayoutConfig = storage.getItem(LAYOUT_STATE, DEFAULT_STATE);
    log('init', defaultLayoutConfig);
    if (defaultLayoutConfig.sidebarWidth) {
      const sidebarWidth = `${defaultLayoutConfig.sidebarWidth}px`;
      sidebarRef.current.style.setProperty('--sideWidth', sidebarWidth);
      sidebarRef.current.style.setProperty('--flyoutWidth', sidebarWidth);
    }
    if (defaultLayoutConfig.folding) {
      foldHandler();
    }
  }, [foldHandler]);

  // 每次鼠标从侧边栏移入收缩图标/收缩图标移入侧边栏，记录移入的方向
  const signMouseFrom = (id: string) => {
    mouseOverFrom.current = id === SIDEBAR_CONTROL ? MouseOverFromType.Control : MouseOverFromType.Sidebar;
    setTimeout(() => {
      mouseOverFrom.current = MouseOverFromType.Other;
    }, 300);
  };

  // 拖拽鼠标时改变左侧栏宽度
  const changeWidth = useCallback((clientX: number) => {
    if (!dragging.current) return;
    // 计算偏移量
    const offsetX = clientX - previousClientX.current;
    previousClientX.current = clientX;

    const sideWidth = sidebarRef.current.style.getPropertyValue('--sideWidth');
    if (sideWidth) {
      const halfBodyWidth = Math.ceil(window.document.body.clientWidth / 2); // 一半屏幕宽度
      let sideNumber = pixelToNumber(sideWidth);
      log(
        'width change',
        `clientX:${clientX}, sideNumber:${sideNumber}, offsetX:${offsetX}, nowSide:${sideNumber + offsetX}px`,
      );
      // 这里如果鼠标向右移动超出了拖拽组件的位置，这时再向左拖到时不做处理
      if (clientX > halfBodyWidth + MIN_CONTROL_WIDTH) return;
      // 超出最大或最小都不处理
      if (sideNumber < MIN_CONTROL_WIDTH && offsetX < 0) {
        sideNumber = MIN_CONTROL_WIDTH;
        return;
      }
      if (sideNumber > halfBodyWidth && offsetX > 0) {
        sideNumber = halfBodyWidth;
        return;
      }
      sidebarRef.current.style.setProperty('--sideWidth', `${sideNumber + offsetX}px`);
    }
  }, []);

  // 鼠标移动方法
  const splitMoveHandler = useCallback(
    (event: MouseEvent) => {
      if (scheduledAnimationFrame.current) {
        return;
      }

      scheduledAnimationFrame.current = true;
      // requestAnimationFrame
      window.requestAnimationFrame(() => {
        scheduledAnimationFrame.current = false;
        changeWidth(event.clientX);
      });
    },
    [changeWidth],
  );

  // 鼠标抬起
  const onDocumentMouseUp = useCallback(() => {
    dragging.current = false;
    setMoving(false);
    const sideWidth = sidebarRef.current.style.getPropertyValue('--sideWidth');
    log('mouse up, sideWidth:', sideWidth);
    const sideNumber = pixelToNumber(sideWidth);
    if (sideNumber < 150) {
      // 如果在侧边栏的150像素范围内，直接收起
      foldHandler();
      return;
    } else if (sideNumber < DEFAULT_STATE.sidebarWidth) {
      // 在150到默认宽度的像素范围内，直接展开
      sidebarRef.current.style.setProperty('--flyoutWidth', `${DEFAULT_STATE.sidebarWidth}px`);
      expandHandler();
      return;
    }
    // 保存记录宽度
    log('log up', sideNumber);
    const defaultLayoutConfig = storage.getItem(LAYOUT_STATE, DEFAULT_STATE);
    storage.setItem(LAYOUT_STATE, { ...defaultLayoutConfig, sidebarWidth: sideNumber });
    sidebarRef.current.style.setProperty('--flyoutWidth', `${sideNumber}px`);

    document.removeEventListener('mousemove', splitMoveHandler);
    document.removeEventListener('mouseup', onDocumentMouseUp);
  }, [expandHandler, foldHandler, splitMoveHandler]);

  // 鼠标按下
  const onDocumentMouseDown = useCallback(
    (event: MouseEvent) => {
      dragging.current = true;
      previousClientX.current = event.clientX;
      setMoving(true);

      document.addEventListener('mousemove', splitMoveHandler);
      document.addEventListener('mouseup', onDocumentMouseUp);
      return () => {
        document.removeEventListener('mousemove', splitMoveHandler);
        document.removeEventListener('mouseup', onDocumentMouseUp);
      };
    },
    [onDocumentMouseUp, splitMoveHandler],
  );

  // 拖拽控件的鼠标事件监听
  useEffect(() => {
    if (split.current) {
      const splitDom = split.current;
      splitDom.addEventListener('mousedown', onDocumentMouseDown);
      return () => {
        if (splitDom) {
          splitDom.removeEventListener('mousedown', onDocumentMouseDown);
        }
      };
    }
  }, [onDocumentMouseDown, split]);

  // 处理鼠标进入侧边栏的展开逻辑
  useEffect(() => {
    if (sidebarRef.current) {
      let isOver = false;
      const onMouseOver = (event: MouseEvent & { target: { id?: string } }) => {
        if (isOver) return;
        if (mouseOverFrom.current === MouseOverFromType.Other && event.target.id === SIDEBAR_CONTROL) {
          // 这里应该是从其他范围进入控制图标范围
          return;
        }
        // 如果当前是收缩状态，则展开
        if (isFold) {
          setIsHover(true);
          isOver = true;
        }
      };
      const onMouseOut = (event: Event & { target: { id?: string } }) => {
        if (isOver) {
          // 鼠标移出拖拽控件，记录状态
          setIsHover(false);
          isOver = false;
          signMouseFrom(event.target.id);
        }
      };

      const sidebarDom = sidebarRef.current;
      sidebarDom.addEventListener('mouseover', onMouseOver);
      sidebarDom.addEventListener('mouseout', onMouseOut);
      return () => {
        if (sidebarDom) {
          sidebarDom.removeEventListener('mouseover', onMouseOver);
          sidebarDom.removeEventListener('mouseout', onMouseOut);
        }
      };
    }
  }, [sidebarRef, isFold]);

  // 切换收缩状态逻辑
  const toggleFold = useCallback(() => {
    if (sidebarRef.current) {
      if (isFold) {
        expandHandler();
      } else {
        foldHandler();
      }
    }
  }, [isFold, foldHandler, expandHandler]);

  return (
    <div id="sidebar" className={style('sidebar', { fold: isFold, hover: isHover })} ref={sidebarRef}>
      <div className={style('sidebar-nav')}>
        <div className={style('sidebar-container', { move: moving })}>
          <div className={style('sidebar-content', className)}>{children}</div>
          <div className={style('sidebar-control')}>
            <div className={style('control-shadow')} />
            <button className={style('control-content')} ref={split}>
              <span />
            </button>
            <button className={style('control-icon', { fold: isFold })} data-resize-button="true">
              <span className={style('icon-content')}>
                <RightArrow />
              </span>
              <div id={SIDEBAR_CONTROL} className={style('icon-container')} onClick={toggleFold} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 像素转数字
function pixelToNumber(pixel: string, defaults?: number): number {
  if (!pixel) return 0;
  let result = parseInt(pixel);
  if (isNaN(result)) {
    const matches = pixel.match(/(\d+)/g);
    if (matches.length) {
      result = parseInt(matches[0]);
    } else {
      result = defaults || 0;
    }
  }
  return result;
}

export default SidebarContent;
