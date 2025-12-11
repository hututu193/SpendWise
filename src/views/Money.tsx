import Layout from "../components/Layout"
import React from "react"
import styled from "styled-components";
import { useState } from "react";

import { useRecords } from "hooks/useRecords";
import { TagsSection } from './Money/TagsSection';
import { CategorySection } from './Money/CategorySection';
import { NoteSection } from './Money/NoteSection';
import { NumberPadSection } from './Money/NumberPadSection'
import { DateSection } from './Money/DateSection'


// Money.tsx 的样式部分修改
const MyLayout = styled(Layout)<MyLayoutProps>`
  display: flex;
  flex-direction: column;
  height: 100vh; /* 占满全屏 */
  background: #fff;
`;

const defaultFormData = {
    tagIds: [] as number[],
    note: '',
    category: '-' as Category,
    amount: 0,
    date: new Date().toISOString().split('T')[0] // 改为字符串格式，默认今天
};

// const CategoryWrapper = styled.div`
//     background: #c4c4c4;
// `;

type MyLayoutProps = {
    scrollTop?: number;
    children: React.ReactNode;
}

type Category = '-' | '+'

type RecordToAdd = {
    tagIds: number[]
    note: string
    category: '+' | '-'
    amount: number
    date: string // YYYY-MM-DD 格式
}

function Money() {
    const [selected, setSelected] = useState(defaultFormData)
    const { addRecord } = useRecords();

    const onChange = (obj: Partial<typeof selected>) => {
        setSelected({
            ...selected,
            ...obj
        })
    }
    //点击OK按钮
    const submit = () => {
        const recordToAdd: RecordToAdd = {
            tagIds: selected.tagIds,
            note: selected.note,
            category: selected.category,
            amount: selected.amount,
            date: selected.date
        }
        if (addRecord(recordToAdd)) {
            
            setSelected(defaultFormData);
        } 
    };
    return(

        <MyLayout scrollTop={9999}>
      
        {/* 1. 顶部：分类切换 */}
        {/* 直接放 CategorySection，因为它自带了 wrapper 样式 */}
        <CategorySection
          value={selected.category}
          onChange={(category) => onChange({ category })}
        />
  
        {/* 2. 中间：标签选择 (让它 flex-grow: 1 占据中间空位) */}
        <TagsSection
          value={selected.tagIds}
          onChange={(tagIds) => onChange({ tagIds })}
        />
  
        {/* 3. 底部信息区：日期 + 备注 */}
        <div style={{ background: '#fff' }}>
          <DateSection
            value={selected.date}
            onChange={(date) => onChange({ date })}
          />
          <NoteSection
            value={selected.note}
            onChange={(note) => onChange({ note })}
          />
        </div>
  
        {/* 4. 最底部：数字键盘 */}
        <NumberPadSection
          value={selected.amount}
          onChange={(amount) => onChange({ amount })}
          onOK={submit}
        />
        
      </MyLayout>
    );
  }


export default Money