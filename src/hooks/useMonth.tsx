import { useState, useMemo } from 'react';

export const useMonth = (defaultMonth?: string) => {
    // 安全地获取当前月份，避免任何数字操作
    const getCurrentMonth = (): string => {
        const now = new Date();
        const month = now.getMonth() + 1;
        // 直接返回字符串，不使用任何数字方法
        return month < 10 ? `0${month}` : `${month}`;
    };

    // 安全的状态初始化
    const [selectedMonth, setSelectedMonth] = useState<string>(() => {
        if (defaultMonth && /^\d{1,2}$/.test(defaultMonth)) {
            const monthNum = parseInt(defaultMonth, 10);
            if (monthNum >= 1 && monthNum <= 12) {
                return monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
            }
        }
        return getCurrentMonth();
    });

    // 安全的月份变化处理
    const handleMonthChange = (month: string) => {
        // 验证输入
        if (!month || !/^\d{1,2}$/.test(month)) {
            console.warn('无效的月份输入:', month);
            return selectedMonth;
        }

        const monthNum = parseInt(month, 10);
        if (monthNum < 1 || monthNum > 12) {
            console.warn('月份超出范围:', monthNum);
            return selectedMonth;
        }

        const formattedMonth = monthNum < 10 ? `0${monthNum}` : `${month}`;
        setSelectedMonth(formattedMonth);
        return formattedMonth;
    };

    // 月份选项 - 完全避免数字操作
    const monthOptions = useMemo(() => {
        const options = [];
        for (let i = 1; i <= 12; i++) {
            options.push({
                value: i < 10 ? `0${i}` : `${i}`,
                label: `${i}月`
            });
        }
        return options;
    }, []);

    return {
        selectedMonth,
        setSelectedMonth,
        handleMonthChange,
        monthOptions,
        getCurrentMonth
    };
};