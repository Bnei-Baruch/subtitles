import { Container } from '@material-ui/core';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';

import Navbar from './components/Navbar/Navbar';
import Edit from './components/Edit/Edit';
import Home from './components/Home/Home';

const App = () => {
  return (
    <BrowserRouter>
      <Container maxWidth="lg">
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/edit" exact component={Edit} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default App;
