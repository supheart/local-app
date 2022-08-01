import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RightArrow } from 'icons';

import storage from 'lib/storage';

import style from './SidebarContent.less';

// 标识鼠标从哪个方向进入
const MouseOverFromType = {
  Sidebar: 'Sidebar', // 从侧边栏内容进入
  Control: 'Control', // 从收缩控制按钮进入
  Other: 'Other', // 从其他内容进入
};
const SIDEBAR_CONTROL = 'sidebarControl';
const DEFAULT_STATE = { sidebarWidth: 240 };

const SidebarContent: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => {
  const sidebarRef = useRef(null); // 整个sidebar的dom节点
  const split = useRef(null);
  const dragging = useRef(false);
  const previousClientX = useRef(0);
  const scheduledAnimationFrame = useRef(false);
  const mouseOverFrom = useRef(MouseOverFromType.Other); // 记录鼠标移动的组件方向
  const [isFold, setIsFold] = useState(false); // 是否收起
  const [isHover, setIsHover] = useState(false); // 是否聚焦到侧边栏
  const [width, setWidth] = useState(240);

  // const splitMove = useCallback(() => {

  // }, []);
  useEffect(() => {
    const defaultLayoutConfig = storage.getItem('layout_state', DEFAULT_STATE);
    if (defaultLayoutConfig.sidebarWidth) {
      const sidebarWidth = `${defaultLayoutConfig.sidebarWidth}px`;
      sidebarRef.current.style.setProperty('--sideWidth', sidebarWidth);
      sidebarRef.current.style.setProperty('--flyoutWidth', sidebarWidth);
    }
  }, []);

  // 每次鼠标从侧边栏移入收缩图标/收缩图标移入侧边栏，记录移入的方向
  const signMouseFrom = (id: string) => {
    mouseOverFrom.current = id === SIDEBAR_CONTROL ? MouseOverFromType.Control : MouseOverFromType.Sidebar;
    setTimeout(() => {
      mouseOverFrom.current = MouseOverFromType.Other;
    }, 300);
  };

  const changeWidth = useCallback((clientX: number) => {
    if (!dragging.current) return;
    const offsetX = clientX - previousClientX.current;
    previousClientX.current = clientX;

    const sideWidth = sidebarRef.current.style.getPropertyValue('--sideWidth');
    if (sideWidth) {
      const sideNumber = pixelToNumber(sideWidth);
      console.log('*******', sideNumber, offsetX, `${sideNumber + offsetX}px`);
      // dd.current.style.width = `${sideNumber + offsetX}px`;
      sidebarRef.current.style.setProperty('--sideWidth', `${sideNumber + offsetX}px`);
      sidebarRef.current.style.setProperty('--flyoutWidth', `${sideNumber + offsetX}px`);
    }
  }, []);

  const splitMoveHandler = useCallback(
    (event: MouseEvent) => {
      // if (!dragging.current) return;
      // setWidth(currentWidth => {
      //   const change = event.clientX - previousClientX.current;
      //   previousClientX.current = event.clientX;
      //   console.log(334455, currentWidth + change);
      //   return currentWidth + change;
      // });
      // changeWidth(event.clientX);
      if (scheduledAnimationFrame.current) {
        return;
      }

      scheduledAnimationFrame.current = true;
      window.requestAnimationFrame(() => {
        scheduledAnimationFrame.current = false;
        changeWidth(event.clientX);
      });
    },
    [changeWidth],
  );

  const onDocumentMouseUp = useCallback(() => {
    console.log(123, 'upupup');
    dragging.current = false;
    document.removeEventListener('mousemove', splitMoveHandler);
    document.removeEventListener('mouseup', onDocumentMouseUp);
  }, [splitMoveHandler]);

  const onDocumentMouseDown = useCallback(
    (event: MouseEvent) => {
      dragging.current = true;
      previousClientX.current = event.clientX;

      document.addEventListener('mousemove', splitMoveHandler);
      document.addEventListener('mouseup', onDocumentMouseUp);
      return () => {
        document.removeEventListener('mousemove', splitMoveHandler);
        document.removeEventListener('mouseup', onDocumentMouseUp);
      };
    },
    [onDocumentMouseUp, splitMoveHandler],
  );

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
        const flyoutWidth = sidebarRef.current.style.getPropertyValue('--flyoutWidth');
        sidebarRef.current.style.setProperty('--sideWidth', flyoutWidth);
        sidebarRef.current.style.setProperty('--controlWidth', '24px');
      } else {
        setIsHover(false);
        sidebarRef.current.style.setProperty('--sideWidth', '20px');
        sidebarRef.current.style.setProperty('--controlWidth', '0');
      }
      setIsFold(!isFold);
    }
  }, [sidebarRef, isFold]);

  return (
    <div id="sidebar" className={style('sidebar', { fold: isFold, hover: isHover })} ref={sidebarRef}>
      <div className={style('sidebar-nav')}>
        <div className={style('sidebar-container')}>
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

function pixelToNumber(pixel: string, defaults?: number) {
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
