import React from 'react';
import Login from './Login';
import Home from './Home';
import { Route, Switch } from 'react-router-dom';

const Routes = () => (
  	<Switch>
	    <Route path='/login' component={Login}/>
	    <Route path='/home' component={Home}/>
  	</Switch>
)

export default Routes;