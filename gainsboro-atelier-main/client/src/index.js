import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes, useParams} from 'react-router-dom';
import App from './components/App.jsx';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}/>
      <Route path=":productId" element={<App />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('app')
);