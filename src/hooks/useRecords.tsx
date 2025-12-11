import { useEffect, useState } from 'react';
import { useUpdate } from './useUpdate';
import day from 'dayjs';
import { toast } from 'components/Toast';

export type RecordItem = {
    id?: string
    tagIds: number[]
    note: string
    category: '+' | '-'
    amount: number
    date: string // YYYY-MM-DD
}

// 📦 1. 定义演示数据生成函数 (生成今天、昨天、前天的数据)
const generateDemoData = (): RecordItem[] => {
    const today = day().format('YYYY-MM-DD');
    const yesterday = day().subtract(1, 'day').format('YYYY-MM-DD');
    const twoDaysAgo = day().subtract(2, 'day').format('YYYY-MM-DD');
    const generateUniqueId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

    return [
        { id: generateUniqueId(), tagIds: [1], note: '演示数据-午饭', category: '-', amount: 58, date: today },
        { id: generateUniqueId(), tagIds: [1], note: '演示数据-晚餐火锅', category: '-', amount: 260, date: yesterday },
        { id: generateUniqueId(), tagIds: [4], note: '演示数据-打车', category: '-', amount: 35, date: today },
        { id: generateUniqueId(), tagIds: [2], note: '演示数据-房租', category: '-', amount: 2500, date: twoDaysAgo },
        { id: generateUniqueId(), tagIds: [3], note: '演示数据-看电影', category: '-', amount: 90, date: yesterday },
        { id: generateUniqueId(), tagIds: [5], note: '演示数据-工资收入', category: '+', amount: 12000, date: twoDaysAgo },
    ];
};

export const useRecords = () => {
    const [records, setRecords] = useState<RecordItem[]>([]);

    const generateUniqueId = (): string => {
        return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    };

    // 📦 2. 初始化数据 (核心修改)
    useEffect(() => {
        let initialRecords: RecordItem[] = [];
        try {
            const storedRecords = window.localStorage.getItem('records');
            if (storedRecords) {
                initialRecords = JSON.parse(storedRecords);
            }
        } catch (error) {
            console.error('读取出错，重置为空', error);
            initialRecords = [];
        }

        // 🌟🌟🌟 关键判断：如果最终结果是空数组，就注入演示数据 🌟🌟🌟
        if (initialRecords.length === 0) {
            console.log('检测到没有数据，正在注入演示数据...');
            initialRecords = generateDemoData();
            // 顺便保存到本地，下次刷新就不用再生成了
            window.localStorage.setItem('records', JSON.stringify(initialRecords));
        }

        // 修复旧数据没有 ID 的问题 (兼容性处理)
        const normalizedRecords = initialRecords.map(r => ({
            ...r,
            id: r.id || generateUniqueId()
        }));

        setRecords(normalizedRecords);
    }, []);

    useUpdate(() => {
        window.localStorage.setItem('records', JSON.stringify(records));
    }, records);

    const addRecord = (newRecord: RecordItem) => {
        if (newRecord.amount <= 0) { toast('请输入金额 💰'); return false; }
        if (newRecord.tagIds.length === 0) { toast('请选择标签 🏷️'); return false; }
        
        const record = { ...newRecord, id: generateUniqueId() };
        setRecords([...records, record]);
        toast('记账成功 🎉');
        return true;
    };

    return { records, addRecord };
};