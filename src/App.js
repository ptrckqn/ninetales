import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastContainer, Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { AuthProvider } from './context/authContext';
import { NavProvider } from './context/navContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Upload from './pages/Upload';
import Username from './pages/Username';
import Welcome from './pages/Welcome';

import Container from './components/Container';

const App = () => {
  return (
    <AuthProvider>
      <NavProvider>
        <Router>
          <div className="min-h-screen bg-gray-800 relative font-sans">
            <Switch>
              {/* No Auth Routes */}
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/welcome" component={Welcome} />

              <Route>
                <Container>
                  <Switch>
                    <Route exact path="/search" component={Search} />
                    <Route exact path="/upload" component={Upload} />
                    <Route exact path="/:username" component={Username} />
                    <Route exact path="/" component={Home} />
                  </Switch>
                </Container>
              </Route>
              {/* Auth Routes */}
            </Switch>
          </div>
        </Router>

        <ToastContainer limit={1} transition={Slide} position={toast.POSITION.TOP_CENTER} />
      </NavProvider>
    </AuthProvider>
  );
};

export default App;
