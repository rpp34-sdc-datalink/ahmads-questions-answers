import React from 'react';
// import Overview from '../client/src/components/Overview/Overview.jsx';
import AddToCart from '../client/src/components/Overview/AddToCart.jsx';
// import StyleSelector from '../client/src/components/Overview/StyleSelector.jsx';
import {render, fireEvent, userEvent, waitFor, screen, cleanup} from '@testing-library/react';
import {jsdom} from '@testing-library/jest-dom';
import { sampleOverview } from '../client/src/components/fixtures/overview';

describe('Add to cart', () => {

  beforeEach(() => {
    render(<AddToCart skus={sampleOverview.styleData[0]['skus']}/>);
  });

  test('Should render a size and quantity input', () => {
    expect(screen.getAllByRole('combobox')).toHaveLength(2);
  });

});