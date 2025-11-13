import React, { useState, useEffect, useMemo } from 'react';
import * as echarts from 'echarts';
import { useRecords } from 'hooks/useRecords';
import { useMonth } from 'hooks/useMonth';
import day from 'dayjs'
import styled from 'styled-components';

const MonthChooseWrapper = styled.div`
    font-size: 18px;
    padding: 6px;
    > select {
        font-size: 16px;
        padding: 1px 2px;
    }
`;

interface MonthlyData {
    [month: string]: number[];
}

type Props = {
    category: '-' | '+';
    onChange: (month: string) => void;
}

export function ChartPage({ category, onChange }: Props) {
    const { selectedMonth, handleMonthChange, monthOptions } = useMonth();

    const chartRef = React.useRef<HTMLDivElement>(null);
    const myChartRef = React.useRef<echarts.ECharts | null>(null);

    const titleMap = {
        '-': '本月总支出',
        '+': '本月总收入'
    };

    const { records } = useRecords();

    // 初始化 monthlyData
    const initializeMonthlyData = (): MonthlyData => {
        const data: MonthlyData = {};
        for (let month = 1; month <= 12; month++) {
            data[String(month)] = new Array(31).fill(0);
        }
        return data;
    };

    const [monthlyData, setMonthlyData] = useState<MonthlyData>(initializeMonthlyData);

    // 计算总金额 - 完全避免数字转换问题
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
        // console.log('hash' + JSON.stringify(hash));
        const array = Object.entries(hash).sort((a, b) => {
            if (a[0] === b[0]) return 0;
            return a[0] > b[0] ? 1 : -1;
        });

        const newMonthlyData = initializeMonthlyData();
        // console.log(newMonthlyData);

        array.forEach(([date, records]) => {
            // console.log(date);
            const [month, day] = date.split('-');
            // console.log(day);
            const dayIndex = parseInt(day, 10) - 1;
            // console.log(dayIndex);
            const total = records.reduce((sum: number, item: any) => sum + item.amount, 0);

            if (newMonthlyData[month] && dayIndex >= 0 && dayIndex < 31) {
                newMonthlyData[month][dayIndex] = total;
            }
        });
        setMonthlyData(newMonthlyData);
    }, [records, category]);

    // 处理月份变化的包装函数
    const handleMonthChangeWrapper = (month: string) => {
        const formattedMonth = handleMonthChange(month);
        onChange(formattedMonth);
    };

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
            <h2 className="text-lg font-bold mb-4">
                {titleMap[category]}: {currentMonthTotal} 元
            </h2>
            <MonthChooseWrapper className="mb-4">
                <label className="mr-2">选择月份：</label>
                <select
                    value={selectedMonth}
                    onChange={(e) => handleMonthChangeWrapper(e.target.value)}
                    className="border rounded p-1"
                >
                    {monthOptions.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
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