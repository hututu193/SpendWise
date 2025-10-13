import React from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate // 新增：导入 Navigate 组件用于重定向
} from 'react-router-dom';

import Money from './views/Money';
import Tags from './views/Tags';
import Statistics from './views/Statistics';
import NoMatch from './views/NoMatch';
import styled from 'styled-components';
import { Tag } from 'views/Tag';

const AppWrapper = styled.div`
  color: #333;
`

const App = () => {
  return (
    <AppWrapper>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/tags" replace />} />
          <Route path="/tags" element={<Tags />} />
          <Route path='/tag/:id' element={<Tag />}></Route>
          <Route path="/money" element={<Money />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </Router>
    </AppWrapper>

  );
};


export default App;