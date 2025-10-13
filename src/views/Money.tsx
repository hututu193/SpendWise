import Layout from "../components/Layout"
import React from "react"
import styled from "styled-components";
import { useState } from "react";

import { useRecords } from "hooks/useRecords";
import { TagsSection } from './Money/TagSection';
import { CategorySection } from './Money/CategorySection';
import { NoteSection } from './Money/NoteSection';
import { NumberPadSection } from './Money/NumberPadSection'



const MyLayout = styled(Layout) <MyLayoutProps>`
    display: flex;
    flex-direction: column;
`
const defaultFormData = {
    tagIds: [] as number[],
    note: '',
    category: '-' as Category,
    amount: 0
};

const CategoryWrapper = styled.div`
    background:#c4c4c4;
`;


type MyLayoutProps = {
    scrollTop?: number;
    children: React.ReactNode;
}

type Category = '-' | '+'

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
        if (addRecord(selected)) {
            alert('保存成功');
            setSelected(defaultFormData);
        }
    };
    return (
        <MyLayout scrollTop={9999}>
            {/* {selected.note} */}

            {/* {selected.amount} */}

            <TagsSection
                value={selected.tagIds}
                onChange={(tagIds) => onChange({ tagIds })} />

            {/* 备注 */}
            <NoteSection
                value={selected.note}
                onChange={note => onChange({ note })}
            />

            {/* 收入支出 */}
            <CategoryWrapper>
                <CategorySection value={selected.category}
                    onChange={category => onChange({ category })} />
            </CategoryWrapper>

            {/* 数字键盘 */}
            <NumberPadSection
                value={selected.amount}
                onChange={(amount) => onChange({ amount })}
                onOK={submit}
            />

        </MyLayout>
    )
}

export default Money