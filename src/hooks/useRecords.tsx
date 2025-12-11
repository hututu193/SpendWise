import { useEffect, useState } from 'react';
import { useUpdate } from './useUpdate';
import day from 'dayjs'
import { toast } from '../components/Toast';
import { log } from 'console';

export type RecordItem = {
    id?: string
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
                const parsedRecords = JSON.parse(storedRecords) as (RecordItem & { id?: string })[];
                // 为旧数据添加 ID（如果缺失）
                const recordsWithId = parsedRecords.map(record => {
                    if (!record.id) {
                        return {
                            ...record,
                            id: generateUniqueId()
                        }
                    }
                    return record
                })
                setRecords(recordsWithId)

            }else{
                //演示注入数据
                const today = day().format('YYYY-MM-DD');
                const yesterday = day().subtract(1, 'day').format('YYYY-MM-DD');
                const twoDaysAgo = day().subtract(2, 'day').format('YYYY-MM-DD');


                const demoRecords: RecordItem[] = [
                    // 支出 - 餐饮 (ID: 1)
                    { id: 'demo1', tagIds: [1], note: '午饭 - 麦当劳', category: '-', amount: 39, date: today },
                    { id: 'demo2', tagIds: [1], note: '晚饭 - 火锅', category: '-', amount: 200, date: yesterday },
                    { id: 'demo3', tagIds: [1], note: '奶茶', category: '-', amount: 25, date: twoDaysAgo },
                    
                    // 支出 - 交通 (ID: 4)
                    { id: 'demo4', tagIds: [4], note: '打车回家', category: '-', amount: 45, date: today },
                    { id: 'demo5', tagIds: [4], note: '地铁充值', category: '-', amount: 100, date: twoDaysAgo },

                    // 支出 - 居住 (ID: 2)
                    { id: 'demo6', tagIds: [2], note: '买生活用品', category: '-', amount: 88, date: yesterday },

                    // 收入 - 工资 (ID: 5)
                    { id: 'demo7', tagIds: [5], note: '发工资啦', category: '+', amount: 8000, date: twoDaysAgo },
                ];
                setRecords(demoRecords);
                // 顺便存入 localStorage，防止刷新后没了
                window.localStorage.setItem('records', JSON.stringify(demoRecords));

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
           toast('请输入金额');
            return false;
        }
        if (newRecord.tagIds.length === 0) {
            toast('请选择标签');
            return false;
        }

        if (newRecord.note.length > 20) { // 比如加个备注长度限制
            toast('备注太长啦');
            return false;
       }
        if (!isValidDate(newRecord.date)) {
            toast('日期格式不正确');
            return false;
        }

        const record: RecordItem = {
            ...newRecord,
            id: generateUniqueId()
        }

        setRecords([...records, record]);

        //保存成功提示
        toast('记账成功 🎉');
        return true;
    };

    // 验证日期格式 (YYYY-MM-DD)
    const isValidDate = (dateString: string): boolean => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;

        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    };


    // 生成唯一 ID 的函数
    const generateUniqueId = (): string => {
        return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    };


    return { records, addRecord };
};
