import styled from 'styled-components';
import React, { useState } from 'react';
import { useTags } from 'hooks/useTags';
import CenterModal from '../../components/CenterModal'; // 引入刚才写的弹窗

const Wrapper = styled.section`
  background: #FFFFFF;
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  box-shadow: 0 -5px 15px rgba(0,0,0,0.03); 
  
  > ol {
    margin: 0 -8px;
    display: flex;
    flex-wrap: wrap;
    
    > li {
      background: #f3f3f3;
      color: #666;
      border-radius: 20px;
      padding: 8px 18px;
      font-size: 14px;
      margin: 8px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;

      &.selected {
        background: #ffda47;
        color: #333;
        font-weight: bold;
        box-shadow: 0 4px 10px rgba(255, 218, 71, 0.3);
        transform: translateY(-1px);
      }
    }
  }
  
  > button {
    background: none;
    border: none;
    padding: 0;
    margin-top: 16px;
    color: #999;
    border-bottom: 1px solid #999;
    align-self: flex-start;
    margin-left: 8px;
    cursor: pointer;
  }
`;

type Props = {
  value: number[];
  onChange: (selected: number[]) => void;
};

const TagsSection: React.FC<Props> = (props) => {
  const { tags, addTag } = useTags();
  const selectedTagIds = props.value;
  
  // 🌟 新增：控制弹窗显示的 State
  const [dialogVisible, setDialogVisible] = useState(false);

  const onToggleTag = (tagId: number) => {
    const index = selectedTagIds.indexOf(tagId);
    if (index >= 0) {
      props.onChange(selectedTagIds.filter((t) => t !== tagId));
    } else {
      props.onChange([...selectedTagIds, tagId]);
    }
  };
  
  const getClass = (tagId: number) => (selectedTagIds.indexOf(tagId) >= 0 ? 'selected' : '');

  // 🌟 处理添加标签逻辑
  const handleAddTag = (name: string) => {
    if (name.trim()) {
      addTag(name); // 调用 hook 里的方法
      setDialogVisible(false); // 关闭弹窗
    }
  };

  return (
    <Wrapper>
      <ol>
        {tags.map((tag) => (
          <li
            key={tag.id}
            onClick={() => onToggleTag(tag.id)}
            className={getClass(tag.id)}
          >
            {tag.name}
          </li>
        ))}
      </ol>
      {/* 点击按钮，不再 prompt，而是打开弹窗 */}
      <button onClick={() => setDialogVisible(true)}>+ 新增标签</button>

      {/* 🌟 放置弹窗组件 */}
      <CenterModal 
        visible={dialogVisible}
        title="新增标签名称"
        onCancel={() => setDialogVisible(false)}
        onConfirm={handleAddTag}
      />
    </Wrapper>
  );
};

export { TagsSection };