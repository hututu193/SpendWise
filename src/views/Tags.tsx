import React, { useState } from "react";
import styled from "styled-components";
import Layout from "../components/Layout";
import { useTags } from "hooks/useTags";
import Icon from "../components/Icon";
import { Link } from "react-router-dom";
import { Button } from "components/Button";
import CenterModal from "components/CenterModal";

// 箭头颜色淡一点
const SmallIcon = styled(Icon)`
  width: 16px;
  height: 16px;
  color: #c4c4c4; 
`;

// 🌟 核心容器：使用 Flex 布局，把底部按钮顶到底下
const FlexLayout = styled(Layout)`
  display: flex;
  flex-direction: column;
`;

// 🌟 改造列表：iOS 孤岛风格 (Inset Grouped)
const TagList = styled.div`
  flex-grow: 1; /* 占据中间所有空位 */
  overflow-y: auto; /* 列表内容多时自己滚动 */
  padding: 16px; /* 给外围留白 */

  /* 列表的卡片容器 */
  .list-card {
    background: white;
    border-radius: 16px; /* 大圆角 */
    overflow: hidden; /* 保证子元素不溢出圆角 */
    box-shadow: 0 2px 8px rgba(0,0,0,0.02); /* 极淡的阴影 */
  }

  /* 列表项 */
  a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px; 
    border-bottom: 1px solid #f5f5f5; 
    font-size: 16px;
    color: #333;
    background: white;
    transition: background 0.2s;

    /* 点击反馈 */
    &:active {
      background: #f9f9f9;
    }

    /* 最后一个去边框 */
    &:last-child {
      border-bottom: none;
    }
  }
`;

// 🌟 底部固定操作栏
const Footer = styled.div`
  padding: 20px 16px;
  background: transparent; /* 或者做成半透明模糊 background: rgba(247,249,252, 0.9); */
  display: flex;
  justify-content: center;
  /* 适配 iPhone 底部安全区 */
  padding-bottom: calc(20px + constant(safe-area-inset-bottom));
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
`;

const Tags: React.FC = () => {
  const { tags, addTag } = useTags();
  const [visible, setVisible] = useState(false);

  const submitTag = (name: string) => {
    addTag(name);
    setVisible(false);
  };

  return (
    <FlexLayout>
      <TagList>
        <div className="list-card">
          {tags.map((tag) => (
            <Link key={tag.id} to={"/tag/" + tag.id}>
              <span className="oneLine">
                 {/* 这里预留 Emoji 的位置，比如 tag.icon */}
                 {tag.name}
              </span>
              <SmallIcon name="right" />
            </Link>
          ))}
        </div>
      </TagList>

      <Footer>
        <Button onClick={() => setVisible(true)}>+ 新建标签</Button>
      </Footer>

      <CenterModal 
        visible={visible}
        title="新增标签"
        onCancel={() => setVisible(false)}
        onConfirm={submitTag}
      />
    </FlexLayout>
  );
};

export default Tags;