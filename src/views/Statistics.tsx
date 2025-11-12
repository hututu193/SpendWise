import Layout from '../components/Layout';
import { ReactNode, useState, useEffect } from 'react';
import { CategorySection } from './Money/CategorySection';
import styled from 'styled-components';
import { RecordItem, useRecords } from '../hooks/useRecords';
import { useTags } from '../hooks/useTags';
import day from 'dayjs';
import utc from 'dayjs/plugin/utc';


import { ChartPage } from 'components/ChartPage';

day.extend(utc);

const CategoryWrapper = styled.div`
  background:white;
`;

const Item = styled.div`
  display:flex;
  justify-content: space-between;
  background: white;
  font-size: 18px;
  line-height: 20px;
  padding: 10px 16px;
  > .note{
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
  const [selectedMonth, setSelectedMonth] = useState<string>('10'); // 默认10月，与ChartPage一致



  const hash: { [K: string]: RecordItem[] } = {};

  const selectedRecords = records.filter(r => r.category === category);

  // 处理月份变化的函数
  const handleMonthChange = (month: string) => {
    // console.log('子组件选择的月份:', month);
    // 确保月份是两位数格式
    const formattedMonth = month.padStart(2, '0');
    setSelectedMonth(formattedMonth);
  };


  // 构建hash数据
  selectedRecords.forEach(r => {

    console.log('creaar' + r.date);


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

  // console.log('原始数据 array:', array);

  // 根据选择的月份过滤数据
  const filteredArray = array.filter(([date]) => {
    // 安全地提取月份
    const monthPart = date.split('年')[1];
    if (!monthPart) return false;

    const month = monthPart.split('月')[0];
    // console.log(`日期: ${date}, 提取的月份: ${month}, 选中的月份: ${selectedMonth}`);

    return month === selectedMonth;
  });

  // console.log('过滤后的数据 filteredArray:', filteredArray);

  // 添加调试信息
  useEffect(() => {
    // console.log('selectedMonth 变化:', selectedMonth);
    // console.log('filteredArray 长度:', filteredArray.length);
  }, [selectedMonth, filteredArray]);

  useEffect(() => {
    console.log(category + '传过来的是啥');
  }, [category])

  return (
    <Layout>
      <CategoryWrapper>
        <CategorySection value={category}
          onChange={value => setCategory(value)} />
      </CategoryWrapper>

      <ChartPage category={category} onChange={handleMonthChange} />

      {/* 显示当前选中的月份 */}
      <div style={{ padding: '10px 16px', fontSize: '16px', fontWeight: 'bold' }}>
        当前显示: {selectedMonth}月
      </div>

      <div>
        {filteredArray.length > 0 ? (
          filteredArray.map(([date, records]) =>
            <div key={date}>
              <Header>
                {date}
              </Header>
              <div>
                {records.map(r => {
                  return <Item key={r.date}>
                    <div className="tags oneLine">
                      {r.tagIds
                        .map(tagId => <span key={tagId}>{getName(tagId)}</span>)
                        .reduce((result, span, index, array) =>
                          result.concat(index < array.length - 1 ? [span, ', '] : [span]), [] as ReactNode[])
                      }
                    </div>
                    {r.note && <div className="note">
                      {r.note}
                    </div>}
                    <div className="amount">
                      ￥{r.amount}
                    </div>
                  </Item>;
                })}
              </div>
            </div>
          )
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
            {filteredArray.length === 0 ? `没有找到${selectedMonth}月的数据，快去计一笔吧` : null}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Statistics;