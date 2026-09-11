import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './screens/Home/Home.jsx';
import CropDetail from './screens/CropDetail/CropDetail.jsx';
import Capture from './screens/Capture/Capture.jsx';
import SchemeMatcher from './screens/SchemeMatcher/SchemeMatcher.jsx';
import SeasonReview from './screens/SeasonReview/SeasonReview.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/crop/:cropId" element={<CropDetail />} />
      <Route path="/capture" element={<Capture />} />
      <Route path="/schemes" element={<SchemeMatcher />} />
      <Route path="/season-review" element={<SeasonReview />} />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
