import styled from "styled-components";
import { useState } from "react";

const Wrapper = styled.section`
  background: #f5f5f5; /* 整体背景淡灰 */
  padding: 12px 16px;
  
  > ul {
    display: flex;
    background: #e0e0e0; /* 槽位背景深一点 */
    padding: 4px;
    border-radius: 16px; /* 大圆角胶囊 */
    
    > li {
      width: 50%;
      text-align: center;
      padding: 12px 0;
      border-radius: 12px; /* 内部滑块圆角 */
      font-size: 16px;
      font-weight: bold;
      color: #999;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      
      /* 选中状态：变成白色卡片，浮起来 */
      &.selected {
        background: #fff;
        color: #333;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      /* 收入/支出的特殊色（可选，如果你想要选中变色） */
      /* &.selected-expense { color: #ffda47; } */
      /* &.selected-income { color: #56d69f; } */
    }
  }
`;

type Props = {
  value: "-" | "+";
  onChange: (value: "-" | "+") => void;
};

const CategorySection: React.FC<Props> = (props) => {
  const categoryMap = { "-": "支出", "+": "收入" };
  const [categoryList] = useState<("-" | "+")[]>(["-", "+"]);
  const category = props.value;
  
  return (
    <Wrapper>
      <ul>
        {categoryList.map((c) => (
          <li
            key={c}
            className={category === c ? "selected" : ""}
            onClick={() => props.onChange(c)}
          >
            {categoryMap[c]}
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};

export { CategorySection };