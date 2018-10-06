import React from 'react';
import Login from './Login';
import Home from './Home';
import Loggedin from './Loggedin';
import NewTransaction from './NewTransaction';
import { Route, Switch, Redirect } from 'react-router-dom';

const Routes = () => (
  	<Switch>
	    <Route path='/login' component={Login}/>
	    <Route path='/home' component={Home}/>
		<Route path='/loggedin' component={Loggedin}/>
		<Route path='/new_transaction' component={NewTransaction}/>
  	</Switch>
)

export default Routes;