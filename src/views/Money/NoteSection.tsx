import styled from "styled-components";
import React, { ChangeEventHandler } from "react";
import { Input } from "components/Input";

const Wrapper = styled.section`
  background: #fff;
  padding: 0 16px;
  
  /* 直接覆盖 Input 组件的样式，使其与日期栏风格统一 */
  label {
    padding: 16px 0;
    border-bottom: 1px solid #f5f5f5;
    
    span {
      color: #999;
      font-size: 14px;
      margin-right: 12px;
    }
    
    input {
      background: transparent;
      border: none;
      font-size: 14px;
      color: #333;
      &::placeholder {
        color: #ccc;
      }
    }
  }
`;

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const NoteSection: React.FC<Props> = (props) => {
  const note = props.value;
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    props.onChange(e.target.value);
  };
  return (
    <Wrapper>
      <Input
        label="📝 备注"
        type="text"
        value={note}
        onChange={onChange}
        placeholder="写点什么..."
      />
    </Wrapper>
  );
};

export { NoteSection };