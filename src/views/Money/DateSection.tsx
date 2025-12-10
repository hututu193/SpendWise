import React from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Wrapper = styled.section`
  background: #fff; /* 纯白背景 */
  padding: 0 16px;
  
  > div {
    display: flex;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #f5f5f5; /* 极细分割线 */
    
    > span {
      font-size: 14px;
      color: #999;
      margin-right: 12px;
      display: flex;
      align-items: center;
    }
  }
`;

/* 定制 DatePicker 样式，去掉丑陋的默认 input 边框 */
const CustomInputWrapper = styled.div`
  flex: 1;
  .react-datepicker-wrapper {
    width: 100%;
  }
  input {
    width: 100%;
    border: none;
    background: #f9f9f9; /* 淡淡的灰底，表示可输入 */
    padding: 8px 12px;
    border-radius: 8px;
    color: #333;
    font-size: 14px;
    outline: none;
    &:focus {
      background: #f0f0f0;
    }
  }
`;

type Props = {
  value: string;
  onChange: (date: string) => void;
};

const DateSection: React.FC<Props> = (props) => {
  const handleChange = (date: Date | null) => {
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      props.onChange(dateString);
    }
  };
  const selectedDate = props.value ? new Date(props.value) : new Date();

  return (
    <Wrapper>
      <div>
        <span>📅 日期</span>
        <CustomInputWrapper>
          <DatePicker
            selected={selectedDate}
            onChange={handleChange}
            dateFormat="yyyy-MM-dd"
          />
        </CustomInputWrapper>
      </div>
    </Wrapper>
  );
};

export { DateSection };