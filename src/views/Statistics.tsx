// views/Statistics.tsx
import Layout from '../components/Layout';
import { ReactNode, useState, useEffect } from 'react';
import { CategorySection } from './Money/CategorySection';
import styled from 'styled-components';
import { RecordItem, useRecords } from '../hooks/useRecords';
import { useTags } from '../hooks/useTags';
import day from 'dayjs';
import { ChartPage } from 'components/ChartPage';

const CategoryWrapper = styled.div`
  background: white;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  background: white;
  font-size: 18px;
  line-height: 20px;
  padding: 10px 16px;
  > .note {
    margin-right: auto;
    margin-left: 16px;
    color: #999;
  }
`;

const Header = styled.h3`
  font-size: 18px;
  line-height: 20px;
  padding: 10px 16px;
`;

function Statistics() {
  const [category, setCategory] = useState<'-' | '+'>('-');
  const { records } = useRecords();
  const { getName } = useTags();

  // 月份状态现在由 Statistics 管理
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth.toString().padStart(2, '0');
  });

  const hash: { [K: string]: RecordItem[] } = {};
  const selectedRecords = records.filter(r => r.category === category);

  // 构建 hash 数据
  selectedRecords.forEach(r => {
    const dateObj = day(r.date);
    const key = dateObj.format('YYYY年MM月DD日');
    if (!(key in hash)) {
      hash[key] = [];
    }
    hash[key].push(r);
  });

  const array = Object.entries(hash).sort((a, b) => {
    if (a[0] === b[0]) return 0;
    if (a[0] > b[0]) return -1;
    if (a[0] < b[0]) return 1;
    return 0;
  });

  // 根据选择的月份过滤数据
  const filteredArray = array.filter(([date]) => {
    const monthPart = date.split('年')[1];
    if (!monthPart) return false;
    const month = monthPart.split('月')[0];
    return month === selectedMonth;
  });

  return (
    <Layout>
      <CategoryWrapper>
        <CategorySection
          value={category}
          onChange={value => setCategory(value)}
        />
      </CategoryWrapper>

      {/* ChartPage 现在接收月份状态和回调 */}
      <ChartPage
        category={category}

        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      <div style={{ padding: '10px 16px', fontSize: '16px', fontWeight: 'bold' }}>
        当前显示: {selectedMonth}月
      </div>

      <div>
        {filteredArray.length > 0 ? (
          filteredArray.map(([date, records]) => (
            <div key={date}>
              <Header>{date}</Header>
              <div>
                {records.map(r => (
                  <Item key={r.id}>
                    <div className="tags oneLine">
                      {r.tagIds
                        .map(tagId => <span key={tagId}>{getName(tagId)}</span>)
                        .reduce((result, span, index, array) =>
                          result.concat(index < array.length - 1 ? [span, ', '] : [span]), [] as ReactNode[])
                      }
                    </div>
                    {r.note && <div className="note">{r.note}</div>}
                    <div className="amount">￥{r.amount}</div>
                  </Item>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '110px', textAlign: 'center', color: '#999' }}>
            {filteredArray.length === 0 ? `没有找到${selectedMonth}月的数据，快去计一笔吧` : null}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Statistics;