import Nav from './Nav';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  /* 🌟 核心修复在这里 */
  height: 100vh;       /* 兼容旧浏览器 */
  height: 100dvh;      /* 适配移动端：自动减去地址栏高度 */
  
  display: flex;
  flex-direction: column;
  overflow: hidden;    /* 防止整个页面出现滚动条，只让 Main 滚 */
  background-color: #f7f9fc; 
`;

const Main = styled.div`
  flex-grow: 1;
  overflow-y: auto;    /* 只有中间这块区域能滚动 */
  
  /* 隐藏滚动条样式保持不变 */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

type Props = {
  className?: string;
  scrollTop?: number;
  children: React.ReactNode;
}

const Layout: React.FC<Props> = (props) => {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 这里保留你原来的逻辑，延迟设置滚动位置
    setTimeout(() => {
      if (mainRef.current && props.scrollTop !== undefined) {
        mainRef.current.scrollTop = props.scrollTop
      }
    }, 100)
  }, [props.scrollTop])

  return (
    <Wrapper>
      <Main ref={mainRef} className={props.className}>
        {props.children}
      </Main>
      <Nav />
    </Wrapper>
  );
};

export default Layout;