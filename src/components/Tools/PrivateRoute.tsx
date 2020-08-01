import React, { useContext, createElement } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { AuthContext } from "./Auth";

const PrivateRoute = ({ component, ...rest }: RouteProps) => {
  const {currentUser} = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={routeProps =>
        (!!currentUser && component) ?
          createElement(component, routeProps) :
          <Redirect to={'/'} />
      }
    />
  );
}

export default PrivateRoute;
