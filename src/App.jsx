import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import NavigationBar from './pages/navbar/navbar'; 
import Home from './pages/home'; 
import Parenting from './pages/parenting'; 
import GameTime from './pages/gameTime';
import Social from './pages/social'; 
import FunZone from './pages/funZone';
 
import Login from './pages/login';
import EditAccount from './pages/editAccount';

import RegisterUsers from './pages/registerUsers';
import RegisterPapas from './pages/admins/registerPapas';
import RegisterCoaches from './pages/admins/registerCoaches';
import ViewUsers from './pages/viewUsers';
import ViewPapas from './pages/admins/viewPapas';
import ViewCoaches from './pages/admins/viewCoaches';
import ViewChildren from './pages/admins/viewChildren';
import ViewAllReports from './pages/admins/viewAllReports';

import CoachView from './pages/coaches/coachesView';
import FullReport from './pages/coaches/fullReport';

import Simon from './pages/games/simon';
import Mole from './pages/games/mole';
import { AuthProvider } from './pages/authContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          
          <NavigationBar />
          
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/parenting" element={<Parenting />} /> 
            <Route path="/gameTime" element={<GameTime />} /> 
            <Route path="/social" element={<Social />} /> 
            <Route path="/funZone" element={<FunZone />} />
            <Route path="/coachesView" element={<CoachView />} />
            <Route path="/fullReport" element={<FullReport />} />

            <Route path="/login" element={<Login />} /> 
            <Route path="/editAccount" element={<EditAccount />} /> 

            <Route path="/registerUsers" element={<RegisterUsers />} />
            <Route path="/admins/registerPapas" element={<RegisterPapas />} />
            <Route path="/admins/registerCoaches" element={<RegisterCoaches />} />
            <Route path="/viewUsers" element={<ViewUsers />} />
            <Route path="/admins/viewPapas" element={<ViewPapas />} />
            <Route path="/admins/viewCoaches" element={<ViewCoaches />} />
            <Route path="/admins/viewChildren" element={<ViewChildren />} />
            <Route path="/viewAllReports" element={<ViewAllReports />} />

            <Route path="/games/simon" element={<Simon />} />
            <Route path="/games/mole" element={<Mole />} />
          </Routes>
        </div>
      </AuthProvider> 
    </Router>
  );
}

export default App;
