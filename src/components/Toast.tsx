import React from 'react';
import ReactDOM from 'react-dom/client';
import styled, { keyframes } from 'styled-components';

// 1. 定义动画
const fadeIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -60%); }
  to { opacity: 1; transform: translate(-50%, -50%); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translate(-50%, -50%); }
  to { opacity: 0; transform: translate(-50%, -60%); }
`;

// 2. 定义样式：半透明黑底，白字，圆角
const ToastWrapper = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  z-index: 9999;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: none; /* 防止遮挡点击 */
  
  /* 动画控制 */
  animation: ${props => props.visible ? fadeIn : fadeOut} 0.3s forwards;
`;

// 3. 渲染组件
const ToastComponent: React.FC<{ msg: string, visible: boolean }> = ({ msg, visible }) => {
  return <ToastWrapper visible={visible}>{msg}</ToastWrapper>;
};

// 4. 核心逻辑：创建一个单例来管理 Toast
let root: ReactDOM.Root | null = null;
let div: HTMLDivElement | null = null;
let timer: any = null;

export const toast = (msg: string) => {
  // 如果之前已经有 div 了，先清理掉（防抖）
  if (div) {
    if(root) root.unmount();
    document.body.removeChild(div);
    div = null;
    if(timer) clearTimeout(timer);
  }

  // 创建新的 div 挂载点
  div = document.createElement('div');
  document.body.appendChild(div);
  root = ReactDOM.createRoot(div);

  // 渲染显示
  root.render(<ToastComponent msg={msg} visible={true} />);

  // 2秒后消失
  timer = setTimeout(() => {
    if (root && div) {
      // 先渲染消失动画（这里简化处理，直接卸载，若要完美离场动画需要更复杂的状态管理）
      // 为了简单高效，我们直接卸载
      root.unmount();
      document.body.removeChild(div);
      div = null;
      root = null;
    }
  }, 2000);
};