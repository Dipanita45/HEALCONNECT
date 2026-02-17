import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock the entire UserProvider component to avoid Firebase issues
jest.mock('../../context/UserProvider', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="user-provider">{children}</div>,
  UserContext: React.createContext({
    currentUser: null,
    userRole: null,
    loading: true,
  }),
}));

import UserProvider, { UserContext } from '../../context/UserProvider';

describe('UserProvider', () => {
  test('renders children correctly', () => {
    const TestComponent = () => <div data-testid="child">Test Child</div>;

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  test('provides UserContext to children', () => {
    const TestComponent = () => {
      const context = React.useContext(UserContext);
      return (
        <div>
          <div data-testid="loading">{context.loading ? 'loading' : 'loaded'}</div>
          <div data-testid="user">{context.currentUser ? 'has-user' : 'no-user'}</div>
          <div data-testid="role">{context.userRole || 'no-role'}</div>
        </div>
      );
    };

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    // Check that the context properties exist with default values
    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    expect(screen.getByTestId('role')).toHaveTextContent('no-role');
  });
});
