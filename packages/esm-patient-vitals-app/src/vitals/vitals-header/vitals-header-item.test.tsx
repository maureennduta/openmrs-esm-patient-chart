import React from 'react';
import { render, screen } from '@testing-library/react';
import VitalsHeaderItem from './vitals-header-item.component';

const testProps = { unitName: 'Temp', value: '36.5', unitSymbol: '°C' };

describe('VitalsHeaderItem: ', () => {
  it('renders a vital sign in the vitals header', () => {
    renderVitalsHeaderItem();

    expect(screen.getByText('Temp')).toBeInTheDocument();
    expect(screen.getByText('°C')).toBeInTheDocument();
    expect(screen.getByText('36.5')).toBeInTheDocument();
  });
});

function renderVitalsHeaderItem() {
  render(<VitalsHeaderItem {...testProps} />);
}
