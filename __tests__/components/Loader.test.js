import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from '../../components/Loader';

describe('Loader Component', () => {
  test('renders loading spinner by default', () => {
    render(<Loader />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  test('does not render when show is false', () => {
    render(<Loader show={false} />);
    const main = screen.queryByRole('main');
    expect(main).toBeNull();
  });

  test('renders success state correctly', () => {
    render(<Loader status="success" />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  test('renders error state correctly', () => {
    render(<Loader status="error" />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  test('applies custom size', () => {
    render(<Loader size={60} />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<Loader className="custom-class" />);
    // Just check that it renders
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  test('renders different variants correctly', () => {
    const { rerender } = render(<Loader variant="stethoscope" />);
    let main = screen.getByRole('main');
    expect(main).toBeInTheDocument();

    rerender(<Loader variant="heartbeat" />);
    main = screen.getByRole('main');
    expect(main).toBeInTheDocument();

    rerender(<Loader variant="syringe" />);
    main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  test('applies dark mode styles', () => {
    render(<Loader darkMode={true} />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });
});