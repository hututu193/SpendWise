import React from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Wrapper = styled.section`
  background: #FFFFFF;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  min-height: 60px;
`;

const DateDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
`;

const CustomDateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  width: 150px;
  
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
    const handleChange = (date: Date | null) => {
        if (date) {
            const dateString = date.toISOString().split('T')[0];
            props.onChange(dateString);
        }
    };


    const selectedDate = props.value ? new Date(props.value) : new Date();

    return (
        <Wrapper>
            <DateDisplay>
                <span>📅</span>
                <span>选择日期：</span>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleChange}
                    dateFormat="yyyy-MM-dd"
                    customInput={<CustomDateInput />}
                    popperPlacement="bottom-start"
                // 移除了有问题的 popperModifiers 配置
                />
            </DateDisplay>

        </Wrapper>
    );
};

export { DateSection };