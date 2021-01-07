import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Upload from './pages/Upload';
import Username from './pages/Username';
import Welcome from './pages/Welcome';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-800 relative font-sans">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/upload" component={Upload} />
            <Route exact path="/welcome" component={Welcome} />
            <Route exact path="/:username" component={Username} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
