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
  color: #ccc; 
`;

const TagList = styled.div` // 改成 div 方便控制背景
  background: white;
  padding-left: 16px; /* 左边留白，像 iOS 那样 */
  
  > a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 16px 16px 0; /* 上下加高，方便点击 */
    border-bottom: 1px solid #f5f5f5; /* 极细的分割线 */
    font-size: 16px;
    color: #333;
    text-decoration: none;

    /* 最后一个元素去掉分割线 */
    &:last-child {
      border-bottom: none;
    }
  }
`;

// 给按钮一个独立的容器，不要用 Space 堆了
const ButtonWrapper = styled.div`
  padding: 32px;
  display: flex;
  justify-content: center;
`;

const Tags: React.FC = () => {
  const { tags, addTag } = useTags();
  const [visible, setVisible] = useState(false);

  const submitTag = (name: string) => {
    addTag(name);
    setVisible(false);
  };

  return (
    <Layout>
      <TagList>
        {tags.map((tag) => (
          // 直接用 Link 包裹，扩大点击区域
          <Link key={tag.id} to={"/tag/" + tag.id}>
            <span className="oneLine">{tag.name}</span>
            <SmallIcon name="right" />
          </Link>
        ))}
      </TagList>

      <ButtonWrapper>
        <Button onClick={() => setVisible(true)}>+ 新建标签</Button>
      </ButtonWrapper>

      <CenterModal 
        visible={visible}
        title="新增标签"
        onCancel={() => setVisible(false)}
        onConfirm={submitTag}
      />
    </Layout>
  );
};

export default Tags;