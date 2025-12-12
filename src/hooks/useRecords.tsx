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
    date: string
}

// 生成演示数据的函数 (固定ID，确保图表好看)
const generateDemoData = (): RecordItem[] => {
    const today = day().format('YYYY-MM-DD');
    const yesterday = day().subtract(1, 'day').format('YYYY-MM-DD');
    const twoDaysAgo = day().subtract(2, 'day').format('YYYY-MM-DD');
    const id = () => Math.random().toString(36).slice(2, 9);

    return [
        { id: id(), tagIds: [1], note: '演示-午饭', category: '-', amount: 39, date: today },
        { id: id(), tagIds: [1], note: '演示-请客', category: '-', amount: 260, date: yesterday },
        { id: id(), tagIds: [4], note: '演示-打车', category: '-', amount: 35, date: today },
        { id: id(), tagIds: [2], note: '演示-房租', category: '-', amount: 2500, date: twoDaysAgo },
        { id: id(), tagIds: [3], note: '演示-电影', category: '-', amount: 90, date: yesterday },
        { id: id(), tagIds: [5], note: '演示-工资', category: '+', amount: 12000, date: twoDaysAgo },
    ];
};

export const useRecords = () => {
    const [records, setRecords] = useState<RecordItem[]>([]);

    useEffect(() => {
        const storedRecords = window.localStorage.getItem('records');
        let initialRecords: RecordItem[] = [];

        // 1. 尝试读取
        if (storedRecords) {
            try {
                initialRecords = JSON.parse(storedRecords);
            } catch (e) {
                console.error('解析失败', e);
            }
        }

        // 2. 🌟 核心修改：如果没数据，或者数据是空的数组，强制注入！
        if (!initialRecords || initialRecords.length === 0) {
            console.log('检测到空数据，正在注入演示数据...'); // 你可以在控制台看到这句话
            const demoData = generateDemoData();
            setRecords(demoData);
            window.localStorage.setItem('records', JSON.stringify(demoData));
        } else {
            // 正常加载
            setRecords(initialRecords);
        }
    }, []);

    useUpdate(() => {
        window.localStorage.setItem('records', JSON.stringify(records));
    }, records);

    const addRecord = (newRecord: RecordItem) => {
        if (newRecord.amount <= 0) { toast('请输入金额 💰'); return false; }
        if (newRecord.tagIds.length === 0) { toast('请选择标签 🏷️'); return false; }
        
        const record = { ...newRecord, id: Math.random().toString(36).slice(2, 9) };
        setRecords([...records, record]);
        toast('记账成功 🎉');
        return true;
    };

    // 🌟 3. 暴露一个重置方法给 UI 使用
    const resetData = () => {
        const demo = generateDemoData();
        setRecords(demo);
        window.localStorage.setItem('records', JSON.stringify(demo));
        toast('已恢复演示数据 🔄');
        setTimeout(() => window.location.reload(), 1000); // 1秒后刷新页面确保图表更新
    };

    return { records, addRecord, resetData };
};