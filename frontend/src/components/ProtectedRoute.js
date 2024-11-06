import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated, children, ...rest }) {
  return (
    <Route
      {...rest}
      render={() =>
        isAuthenticated ? children : <Redirect to="/login" />
      }
    />
  );
}

export default ProtectedRoute;
