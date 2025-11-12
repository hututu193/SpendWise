import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  background: #FFFFFF;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #f5f5f5;
  min-height: 60px; // 确保有足够的高度
`;

const DateDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  
  
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

type Props = {
  value: string;
  onChange: (date: string) => void
}

const DateSection: React.FC<Props> = (props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.value)

    console.log('选择的日期' + e.target.value);
  }



  return (
    <Wrapper>
      <DateDisplay>
        <span>📅</span>
        <span>选择日期：</span>
        <DateInput
          type="date"
          value={props.value}
          onChange={handleChange}
        />
      </DateDisplay>

    </Wrapper>
  )
}

export { DateSection }