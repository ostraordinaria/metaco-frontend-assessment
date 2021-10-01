import React, { lazy, Suspense, Fragment } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import WithSubnavigation from 'components/layouts';

const routesConfig = [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/leaderboard" />,
  },
  {
    path: '/',
    layout: WithSubnavigation,
    routes: [
      {
        path: '/leaderboard',
        exact: true,
        component: lazy(() => import('views/Leaderboard')),
      },
      {
        path: '/explorer',
        exact: true,
        component: lazy(() => import('views/Explorer')),
      },
    ],
  },
  {
    path: '*',
    component: () => <Redirect to="/errors/error-404" />,
  },
];

function renderRoutes(routes, user) {
  return routes ? (
    <Suspense
      fallback={
        <div style={{ width: '100%', textAlign: 'center', marginTop: 64 }}>
          {/* <CircularProgress /> */}asd
        </div>
      }
    >
      <Switch>
        {routes.map((route, index) => {
          const Layout = route.layout || Fragment;
          const Component = route.component;

          return (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              render={props => {
                return (
                  <Layout>
                    {route.routes ? (
                      renderRoutes(route.routes, user)
                    ) : (
                      <Component {...props} />
                    )}
                  </Layout>
                );
              }}
            />
          );
        })}
      </Switch>
    </Suspense>
  ) : null;
}

const Routes = () => {
  return renderRoutes(routesConfig);
};

export default Routes;
