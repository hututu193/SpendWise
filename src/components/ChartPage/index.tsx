// components/ChartPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import * as echarts from 'echarts';
import { useRecords } from 'hooks/useRecords';
import day from 'dayjs'
import styled from 'styled-components';

const MonthChooseWrapper = styled.div`
    font-size: 18px;
    padding: 2px 6px 6px 12px;
    > select {
        font-size: 16px;
        padding: 1px 4px;
    }
`;

const CalTotal = styled.h2`
  padding: 8px 6px 0 12px !important;
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 6px;
  color: rgb(67, 64, 64);
`;


interface MonthlyData {
    [month: string]: number[];
}

type Props = {
    category: '-' | '+';
    selectedMonth: string; // 新增：接收选中的月份
    onMonthChange: (month: string) => void; // 新增：月份变化回调
}

export function ChartPage({ category, selectedMonth, onMonthChange }: Props) {
    const chartRef = React.useRef<HTMLDivElement>(null);
    const myChartRef = React.useRef<echarts.ECharts | null>(null);

    const titleMap = {
        '-': '本月总支出',
        '+': '本月总收入'
    };

    const { records } = useRecords();

    // 月份选项
    const monthOptions = useMemo(() => {
        return Array.from({ length: 12 }, (_, i) => i + 1).map(m => ({
            value: m.toString().padStart(2, '0'),
            label: `${m}月`
        }));
    }, []);

    // 处理月份变化
    const handleMonthChange = (month: string) => {
        const formattedMonth = month.padStart(2, '0');
        onMonthChange(formattedMonth);

    };

    // 初始化 monthlyData
    const initializeMonthlyData = (): MonthlyData => {
        const data: MonthlyData = {};
        for (let month = 1; month <= 12; month++) {
            data[month.toString()] = new Array(31).fill(0);
        }
        return data;
    };

    const [monthlyData, setMonthlyData] = useState<MonthlyData>(initializeMonthlyData);

    // 计算总金额
    const currentMonthTotal = useMemo(() => {
        const monthData = monthlyData[selectedMonth];
        if (!monthData) return 0;

        let total = 0;
        for (let i = 0; i < monthData.length; i++) {
            total += monthData[i];
        }
        return total;
    }, [monthlyData, selectedMonth]);

    // 获取 monthlyData
    useEffect(() => {
        if (records.length === 0) return;

        const hash: { [key: string]: any[] } = {};
        const selectedRecords = records.filter(r => r.category === category);

        selectedRecords.forEach((r) => {
            const dateObj = day(r.date)
            const key = dateObj.format('M-D');
            if (!(key in hash)) {
                hash[key] = [];
            }
            hash[key].push(r);
        });

        const array = Object.entries(hash).sort((a, b) => {
            if (a[0] === b[0]) return 0;
            return a[0] > b[0] ? 1 : -1;
        });

        const newMonthlyData = initializeMonthlyData();

        array.forEach(([date, records]) => {
            const [month, day] = date.split('-');
            const dayIndex = parseInt(day, 10) - 1;
            const total = records.reduce((sum: number, item: any) => sum + item.amount, 0);

            if (newMonthlyData[month] && dayIndex >= 0 && dayIndex < 31) {
                newMonthlyData[month][dayIndex] = total;
            }
        });
        setMonthlyData(newMonthlyData);
    }, [records, category]);

    // 当月份变化时更新图表
    useEffect(() => {
        if (!chartRef.current) return;

        if (!myChartRef.current) {
            myChartRef.current = echarts.init(chartRef.current);
        }

        const getDaysInMonth = (month: string) => {
            const monthNum = parseInt(month, 10);
            const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            return daysInMonth[monthNum - 1] || 30;
        };

        const daysInSelectedMonth = getDaysInMonth(selectedMonth);
        const rawData = monthlyData[selectedMonth] || Array(daysInSelectedMonth).fill(0);
        const data = rawData.slice(0, daysInSelectedMonth);
        const days = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);

        const option: echarts.EChartsOption = {
            title: {
                text: `${selectedMonth}月每日${category === '-' ? '支出' : '收入'}趋势 (共${daysInSelectedMonth}天)`,
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    const value = params[0].value;
                    const day = params[0].name;
                    return `${day}<br/>金额: ￥${value}`;
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: days.map((d) => `${d}日`),
            },
            yAxis: {
                type: 'value',
                name: '金额 (¥)',
                show: false
            },
            series: [
                {
                    data,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    lineStyle: { width: 3 },
                    areaStyle: { opacity: 0.1 },
                },
            ],
        };

        myChartRef.current.setOption(option);

        const handleResize = () => {
            myChartRef.current?.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [selectedMonth, monthlyData, category]);

    return (
        <div className="p-4">
            <CalTotal>
                {titleMap[category]}: {currentMonthTotal} 元
            </CalTotal>

            <MonthChooseWrapper className="mb-4">
                <label className="mr-2">选择月份：</label>
                <select
                    value={selectedMonth}
                    onChange={(e) => handleMonthChange(e.target.value)}
                    className="border rounded p-1"
                >
                    {monthOptions.map(({ value, label }) => (
                        <option key={value} value={value}
                            style={{ padding: '0' }}>{label}</option>
                    ))}
                </select>
            </MonthChooseWrapper>

            <div style={{
                width: '100%',
                overflowX: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: '4px'
            }}>
                <div
                    ref={chartRef}
                    style={{
                        width: '320%',
                        height: '30vh',
                        minWidth: '100%',
                        minHeight: '200px'
                    }}
                />
            </div>
        </div>
    );
}