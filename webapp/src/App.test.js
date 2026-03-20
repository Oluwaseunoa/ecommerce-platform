import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue([]),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders app heading', async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText(/e-commerce platform/i)).toBeInTheDocument();
  });
});