import Nav from './Nav';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100vh;
  display:flex;
  flex-direction: column;
`;
const Main = styled.div`
  flex-grow: 1;
  overflow: auto;
  /* 隐藏所有浏览器的滚动条 */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;      /* Firefox */
  
  /* Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
`;
// 完整的 Props 类型定义
type Props = {
  className?: string;
  scrollTop?: number;
  children: React.ReactNode; // 添加 children 类型
}
const Layout: React.FC<Props> = (props) => {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (mainRef.current && props.scrollTop !== undefined) {
        mainRef.current.scrollTop = props.scrollTop
      }
    }, 100)
  }, [props.scrollTop])

  return (
    <Wrapper>
      <Main ref={mainRef} className={props.className} data-x={'frank'}>
        {props.children}
      </Main>
      <Nav />
    </Wrapper>
  );
};



export default Layout;
