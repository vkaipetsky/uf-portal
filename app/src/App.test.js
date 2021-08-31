import { render, screen } from '@testing-library/react';
import Private from './Private';

test('renders learn react link', () => {
  render(<Private />);
  const linkElement = screen.getByText(/Restricted Access/i);
  expect(linkElement).toBeInTheDocument();
});
