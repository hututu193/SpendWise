import { useEffect, useState } from 'react';
import { useUpdate } from './useUpdate';

export type RecordItem = {
    tagIds: number[]
    note: string
    category: '+' | '-'
    amount: number
    date: string // YYYY-MM-DD 格式
}

export const useRecords = () => {
    const [records, setRecords] = useState<RecordItem[]>([]);

    useEffect(() => {
        try {
            const storedRecords = window.localStorage.getItem('records');
            if (storedRecords) {
                const parsedRecords = JSON.parse(storedRecords);
                // 基本数据验证
                if (Array.isArray(parsedRecords)) {
                    setRecords(parsedRecords);
                }
            }
        } catch (error) {
            console.error('读取本地存储记录失败:', error);
            // 可以选择设置空数组或保持默认
            setRecords([]);
        }
    }, []);

    useUpdate(() => {
        try {
            window.localStorage.setItem('records', JSON.stringify(records));
        } catch (error) {
            console.error('保存记录到本地存储失败:', error);
        }
    }, records);

    const addRecord = (newRecord: RecordItem) => {
        // 数据验证
        if (newRecord.amount <= 0) {
            alert('请输入金额');
            return false;
        }
        if (newRecord.tagIds.length === 0) {
            alert('请选择标签');
            return false;
        }
        if (!isValidDate(newRecord.date)) {
            alert('日期格式不正确');
            return false;
        }

        setRecords([...records, newRecord]);
        return true;
    };

    // 验证日期格式 (YYYY-MM-DD)
    const isValidDate = (dateString: string): boolean => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;

        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    };

    return { records, addRecord };
};