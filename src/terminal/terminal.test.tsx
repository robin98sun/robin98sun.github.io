import React from 'react';
import { render, screen } from '@testing-library/react';
import Terminal from './terminal';

test('renders learn react link', () => {
  render(<Terminal />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
