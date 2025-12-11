import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as echarts from 'echarts';
import { useRecords } from 'hooks/useRecords';
import { useTags } from 'hooks/useTags'; // 🌟 需要引入 tag 钩子来获取标签名
import day from 'dayjs';
import styled from 'styled-components';
// import Icon from './Icon'; // 假设你有 Icon 组件，或者用文字代替

const ChartWrapper = styled.div`
  background: #fff;
  border-radius: 16px;
  margin: 10px 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  border: 1px solid #f5f5f5;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const TitleBlock = styled.div`
    display: flex;
    flex-direction: column;
    h3 { font-size: 14px; color: #999; margin: 0 0 4px 0; font-weight: normal; }
    .total { font-size: 24px; font-weight: bold; color: #333; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
`;

const Controls = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const MonthSelect = styled.select`
  border: none;
  background: #f5f5f5;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  font-weight: bold;
  outline: none;
`;

// 图表切换按钮
const TypeSwitch = styled.div`
    background: #f5f5f5;
    border-radius: 8px;
    padding: 2px;
    display: flex;
    
    button {
        border: none;
        background: transparent;
        padding: 4px 8px;
        font-size: 12px;
        border-radius: 6px;
        color: #999;
        transition: all 0.3s;
        
        &.active {
            background: #fff;
            color: #333;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            font-weight: bold;
        }
    }
`;


type Props = {
  category: '-' | '+';
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export function ChartPage({ category, selectedMonth, onMonthChange }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const myChartRef = useRef<echarts.ECharts | null>(null);
  const { records } = useRecords();
  const { getName } = useTags(); // 获取标签名
  
  // 🌟 新增：控制图表类型 'line' | 'pie'
  const [chartType, setChartType] = useState<'line' | 'pie'>('line');

  const monthOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i + 1).map(m => ({
      value: m.toString().padStart(2, '0'),
      label: `${m}月`
    }));
  }, []);

  // --- 数据准备逻辑 ---

  // 1. 过滤出当前月、当前分类的所有记录
  const currentRecords = useMemo(() => {
      return records.filter(r => {
          return r.category === category && day(r.date).format('MM') === selectedMonth;
      });
  }, [records, category, selectedMonth]);

  // 2. 计算总金额
  const totalAmount = useMemo(() => {
      return currentRecords.reduce((sum, r) => sum + r.amount, 0);
  }, [currentRecords]);

  // 3. 准备折线图数据 (按天聚合)
  const lineData = useMemo(() => {
    const daysInMonth = day().month(parseInt(selectedMonth)-1).daysInMonth();
    const data = new Array(daysInMonth).fill(0);
    
    currentRecords.forEach(r => {
        const dayIndex = day(r.date).date() - 1;
        data[dayIndex] += r.amount;
    });
    
    return {
        x: Array.from({length: daysInMonth}, (_, i) => i + 1),
        y: data
    };
  }, [currentRecords, selectedMonth]);

  // 4. 🌟 新增：准备饼图数据 (按标签聚合)
  const pieData = useMemo(() => {
      const map = new Map<number, number>();
      currentRecords.forEach(r => {
          r.tagIds.forEach(tagId => {
              // 注意：这里简单处理，如果一笔记录有多个标签，金额会重复计算在不同标签下
              // 或者你可以平分金额，这里暂且按全额归类
              map.set(tagId, (map.get(tagId) || 0) + r.amount);
          });
      });
      
      return Array.from(map).map(([tagId, value]) => ({
          name: getName(tagId), // 通过 tagId 换取 tagName
          value
      }));
  }, [currentRecords, getName]);


  // --- ECharts 渲染逻辑 ---
  useEffect(() => {
    if (!chartRef.current) return;
    if (!myChartRef.current) myChartRef.current = echarts.init(chartRef.current);

    const themeColor = category === '-' ? '#ffda47' : '#56d69f';

    // 基础配置
    const baseOption: echarts.EChartsOption = {
        grid: { top: 20, right: 0, bottom: 20, left: 0 },
        tooltip: { trigger: 'item' }, // 饼图需要 item trigger
    };

    let specificOption: echarts.EChartsOption = {};

    if (chartType === 'line') {
        // --- 折线图配置 ---
        specificOption = {
            tooltip: { 
                trigger: 'axis', 
                confine: true,
                formatter: '{b}日: ¥{c}'
            },
            xAxis: {
                type: 'category',
                data: lineData.x,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { interval: 4, fontSize: 10, color: '#ccc' }
            },
            yAxis: { show: false },
            series: [{
                data: lineData.y,
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: { width: 2, color: themeColor },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: category === '-' ? 'rgba(255, 218, 71, 0.4)' : 'rgba(86, 214, 159, 0.4)' },
                        { offset: 1, color: 'rgba(255, 255, 255, 0)' }
                    ])
                },
            }]
        };
    } else {
        // --- 🌟 饼图配置 ---
        specificOption = {
            series: [{
                type: 'pie',
                radius: ['35%', '60%'], // 环形图
                center: ['50%', '50%'],
                itemStyle: {
                    borderRadius: 5,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b} {d}%', // 显示 名称 + 百分比
                    color: '#666',
                    fontSize: 10
                },
                labelLine: { show: true, length: 5, length2: 5 },
                data: pieData.length > 0 ? pieData : [{name: '无数据', value: 0}],
                color: [
                    '#ffda47', '#ff8f47', '#ff4757', '#56d69f', 
                    '#47b8ff', '#9f47ff', '#ff47a9'
                ] // 自定义一套好看的色盘
            }]
        };
    }

    // 先清空，防止切换时残留
    myChartRef.current.clear();
    myChartRef.current.setOption({ ...baseOption, ...specificOption });

  }, [chartType, lineData, pieData, category]);

  // 监听窗口大小
  useEffect(() => {
      const resize = () => myChartRef.current?.resize();
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <ChartWrapper>
      <Header>
        <TitleBlock>
            <h3>{category === '-' ? '总支出' : '总收入'}</h3>
            <div className="total">¥ {totalAmount}</div>
        </TitleBlock>
        
        <Controls>
             {/* 🌟 切换按钮 */}
            <TypeSwitch>
                <button 
                    className={chartType === 'line' ? 'active' : ''} 
                    onClick={() => setChartType('line')}
                >
                    趋势
                </button>
                <button 
                    className={chartType === 'pie' ? 'active' : ''} 
                    onClick={() => setChartType('pie')}
                >
                    分布
                </button>
            </TypeSwitch>

            <MonthSelect 
                value={selectedMonth} 
                onChange={(e) => onMonthChange(e.target.value)}
            >
                {monthOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </MonthSelect>
        </Controls>
      </Header>
      
      {/* 🌟 图表高度稍微加高一点，给饼图留空间 */}
      <div ref={chartRef} style={{ width: '100%', height: '180px' }} />
    </ChartWrapper>
  );
}