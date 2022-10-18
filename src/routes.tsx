import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import HomeIndex from './pages';

const Routes = () => {
  return (
    <Suspense fallback={'loading...'}>
      <Switch>
        <Route path="/" exact={true} component={HomeIndex} />
        <Route path="*" exact={true} component={HomeIndex} />
      </Switch>
    </Suspense>
  );
};

export default Routes;
