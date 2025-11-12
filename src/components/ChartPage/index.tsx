import React, { useState, useEffect, useMemo } from 'react';
import * as echarts from 'echarts';
import { useRecords } from 'hooks/useRecords';
import day from 'dayjs'
import styled from 'styled-components';

const MonthChooseWrapper = styled.div`
    font-size: 18px;
    >select{
        font-size: 14px;
    }
`


interface MonthlyData {
    [month: string]: number[];
}
type Props = {
    category: '-' | '+';
    onChange: (month: string) => void // 修改：接收月份参数
}
type TotalCost = { month: string, total: number }[]
export function ChartPage({ category, onChange }: Props) {

    // console.log('加还是减少' + category);
    //选择月份，默认十月
    const [selectedMonth, setSelectedMonth] = useState('10');
    // 处理月份变化
    const handleMonthChange = (month: string) => {
        setSelectedMonth(month);
        onChange(month); // 调用父组件的回调函数
    };

    const chartRef = React.useRef<HTMLDivElement>(null);
    const myChartRef = React.useRef<echarts.ECharts | null>(null);

    const titleMap = {
        '-': '本月总支出',
        '+': '本月总收入'
    };


    const { records } = useRecords();

    // console.log(records);

    // 初始化 monthlyData
    const initializeMonthlyData = (): MonthlyData => {
        const data: MonthlyData = {};
        for (let month = 1; month <= 12; month++) {
            data[month.toString()] = new Array(31).fill(0); // 每月最多31天
        }
        return data;
    };

    const [monthlyData, setMonthlyData] = useState<MonthlyData>(initializeMonthlyData);
    //获取monthlyData
    useEffect(() => {
        if (records.length === 0) return;

        let hash: { [key: string]: any[] } = {};
        const selectedRecords = records.filter(r => r.category === category);

        // 按日期分组
        selectedRecords.forEach((r) => {
            const dateObj = day(r.date)
            const key = dateObj.format('M-D'); // 如 '10-14'
            if (!(key in hash)) {
                hash[key] = [];
            }
            hash[key].push(r);
        });

        // 转换为数组并排序
        const array = Object.entries(hash).sort((a, b) => {
            if (a[0] === b[0]) return 0;
            return a[0] > b[0] ? 1 : -1;
        });

        // console.log('分组数据:', array);

        // 处理数据填充
        const newMonthlyData = initializeMonthlyData();

        array.forEach(([date, records]) => {
            const [month, day] = date.split('-');
            const dayIndex = parseInt(day) - 1; // 0-based 索引
            const total = records.reduce((sum: number, item: any) => sum + item.amount, 0);

            if (newMonthlyData[month] && dayIndex >= 0 && dayIndex < 31) {
                newMonthlyData[month][dayIndex] = total;
            }
        });
        setMonthlyData(newMonthlyData);

        // console.log('最终 monthlyData:', newMonthlyData);


    }, [records, category]);

    //计算总收入/总支出
    const totalCost = useMemo(() => {
        const arr: TotalCost = [];
        for (let i = 1; i <= 12; i++) {
            const monthKey = i.toString();
            const sumWithInitial = monthlyData[monthKey].reduce(
                (accumulator, currentValue) => accumulator + currentValue, 0
            );
            arr.push({ month: monthKey, total: sumWithInitial });
        }
        return arr;
    }, [monthlyData]);

    // 当月份变化时更新图表
    useEffect(() => {
        if (!chartRef.current) return;

        // 初始化图表实例
        if (!myChartRef.current) {
            myChartRef.current = echarts.init(chartRef.current);
        }

        const getDaysInMonth = (month: string) => {
            const monthNum = parseInt(month);
            // 简单判断，实际应该考虑闰年
            const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            return daysInMonth[monthNum - 1] || 30;
        };

        const daysInSelectedMonth = getDaysInMonth(selectedMonth);
        const rawData = monthlyData[selectedMonth] || Array(daysInSelectedMonth).fill(0);
        const data = rawData.slice(0, daysInSelectedMonth); // 只取实际天数的数据
        const days = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);

        // console.log(`月份: ${selectedMonth}, 天数: ${daysInSelectedMonth}, 数据:`, data);

        const option: echarts.EChartsOption = {
            title: {
                text: `${selectedMonth}月每日支出趋势 (共${daysInSelectedMonth}天)`,
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
                left: '3%',   // 调整左边距，为y轴标签留出空间
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

        // 关键：设置图表选项
        myChartRef.current.setOption(option);

        // 添加窗口大小变化监听
        const handleResize = () => {
            myChartRef.current?.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            // 注意：这里不要dispose，否则切换月份时会销毁图表
            // myChartRef.current?.dispose();
            // myChartRef.current = null;
        };
    }, [selectedMonth, monthlyData]);

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">
                {titleMap[category]}: {
                    totalCost && totalCost[Number(selectedMonth) - 1]
                        ? totalCost[Number(selectedMonth) - 1].total
                        : 0
                } 元
            </h2>
            <MonthChooseWrapper className="mb-4">
                <label className="mr-2">选择月份：</label>
                <select
                    value={selectedMonth}
                    onChange={(e) => handleMonthChange(e.target.value)}
                    className="border rounded p-1"
                >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m.toString()}>{m}月</option>
                    ))}
                </select>
            </MonthChooseWrapper>

            {/* 添加滚动容器 */}
            <div style={{
                width: '100%',
                overflowX: 'auto',
                border: '1px solid #e0e0e0', // 可选：添加边框以便看清滚动区域
                borderRadius: '4px' // 可选：圆角
            }}>
                {/* 设置图表容器宽度为320% */}
                <div
                    ref={chartRef}
                    style={{
                        width: '320%',
                        height: '400px',
                        minWidth: '100%' // 确保最小宽度为100%
                    }}
                />
            </div>
        </div>
    );
}