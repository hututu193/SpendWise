import Layout from '../components/Layout';
import { ReactNode, useState, useMemo } from 'react';
import { CategorySection } from './Money/CategorySection';
import styled from 'styled-components';
import { RecordItem, useRecords } from '../hooks/useRecords';
import { useTags } from '../hooks/useTags';
import day from 'dayjs';
import { ChartPage } from 'components/ChartPage';

const Wrapper = styled.div`
  background: #f7f9fc; /* 整体浅灰背景 */
  min-height: 100%;
`;

const CategoryWrapper = styled.div`
  background: white;
  padding: 0; /* 不需要 padding，CategorySection 自带了 */
`;

// 📅 日期标题
const DayHeader = styled.h3`
  font-size: 14px;
  color: #999;
  padding: 16px 16px 8px;
  font-weight: normal;
  display: flex;
  justify-content: space-between;
`;

// 📝 记账条目
const RecordItemWrapper = styled.div`
  background: white;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f9f9f9;

  .meta {
    display: flex;
    flex-direction: column;
    .tags { font-size: 16px; color: #333; font-weight: 500; }
    .note { font-size: 12px; color: #999; margin-top: 4px; }
  }
  .amount { font-size: 16px; font-weight: bold; color: #333; }
`;

// 🏆 排行榜样式
const RankingWrapper = styled.div`
  background: white;
  margin: 10px 16px;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);

  h4 { font-size: 14px; color: #999; margin-bottom: 12px; font-weight: normal;}
`;

const RankItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  
  .icon { margin-right: 10px; color: #666;}
  .name { width: 4em; color: #666; margin-right: 10px;}
  .bar-wrapper { 
    flex: 1; 
    height: 8px; 
    background: #f0f0f0; 
    border-radius: 4px; 
    margin-right: 10px; 
    overflow: hidden;
  }
  .bar { height: 100%; border-radius: 4px; transition: width 0.5s; }
  .percent { width: 3em; text-align: right; color: #999; font-size: 12px;}
`;


function Statistics() {
  const [category, setCategory] = useState<'-' | '+'>('-');
  const { records } = useRecords();
  const { getName } = useTags();

  const [selectedMonth, setSelectedMonth] = useState(() => {
    return (new Date().getMonth() + 1).toString().padStart(2, '0');
  });

  // 1. 过滤当前月、当前类型的数据
  const selectedRecords = useMemo(() => {
    return records.filter(r => {
      const isSameCategory = r.category === category;
      const isSameMonth = day(r.date).format('MM') === selectedMonth;
      return isSameCategory && isSameMonth;
    });
  }, [records, category, selectedMonth]);

  // 2. 构造分组数据 (按日期)
  const hash: { [K: string]: RecordItem[] } = {};
  selectedRecords.forEach(r => {
    
    const key = day(r.date).format('YYYY-MM-DD');
    if (!(key in hash)) hash[key] = [];
    hash[key].push(r);
  });

  const array = Object.entries(hash).sort((a, b) => a[0] > b[0] ? -1 : 1);

  // 3. ✨ 新增功能：计算 Top 3 排行榜
  const rankingList = useMemo(() => {
    if (selectedRecords.length === 0) return [];
    
    const tagStats: { [id: number]: number } = {};
    let total = 0;

    selectedRecords.forEach(r => {
        r.tagIds.forEach(id => {
            tagStats[id] = (tagStats[id] || 0) + r.amount;
            total += r.amount;
        });
    });

    return Object.entries(tagStats)
        .map(([id, amount]) => ({
            id: parseInt(id),
            amount,
            percent: (amount / total * 100).toFixed(0)
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3); // 只取前三名
  }, [selectedRecords]);


  return (
    <Layout>
      <Wrapper>
        <CategoryWrapper>
          <CategorySection value={category} onChange={setCategory} />
        </CategoryWrapper>

        {/* 图表组件 */}
        <ChartPage
          category={category}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        {/* 🏆 排行榜组件 (有数据时才显示) */}
        {rankingList.length > 0 && (
            <RankingWrapper>
                <h4>{category === '-' ? '支出排行榜' : '收入来源'}</h4>
                {rankingList.map(item => (
                    <RankItem key={item.id}>
                        {/* 这里你可以加个奖杯图标 🏆 */}
                        <span className="name">{getName(item.id)}</span>
                        <div className="bar-wrapper">
                            <div 
                                className="bar" 
                                style={{ 
                                    width: `${item.percent}%`,
                                    background: category === '-' ? '#ffda47' : '#56d69f'
                                }}
                            ></div>
                        </div>
                        <span className="percent">{item.percent}%</span>
                        <span style={{marginLeft: 5, fontSize: 12}}>¥{item.amount}</span>
                    </RankItem>
                ))}
            </RankingWrapper>
        )}

        {/* 详细列表 */}
        <div style={{ paddingBottom: 20 }}>
          {array.map(([date, records]) => (
            <div key={date}>
              <DayHeader>
                  <span>{day(date).format('M月D日')}</span>
                  {/* 可选：显示当天的总额 */}
                  <span style={{fontSize: 12}}>¥{records.reduce((sum, r)=>sum+r.amount, 0)}</span>
              </DayHeader>
              <div>
                {records.map(r => (
                  <RecordItemWrapper key={r.id}>
                    <div className="meta">
                      <div className="tags">
                        {r.tagIds.map(id => getName(id)).join(', ')}
                      </div>
                      {r.note && <div className="note">{r.note}</div>}
                    </div>
                    <div className="amount">￥{r.amount}</div>
                  </RecordItemWrapper>
                ))}
              </div>
            </div>
          ))}
          
          {array.length === 0 && (
             <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>
                 🍃 这个月还没有记录哦
             </div>
          )}
        </div>
      </Wrapper>
    </Layout>
  );
}

export default Statistics;