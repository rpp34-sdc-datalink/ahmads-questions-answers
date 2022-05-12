import React from 'react';
import Overview from '../../Overview/Overview.jsx';
import AddToCart from '../../Overview/AddToCart.jsx';
import StyleSelector from '../../Overview/StyleSelector.jsx';
import {render, fireEvent, userEvent, waitFor, screen, cleanup} from '@testing-library/react';
import {jsdom} from '@testing-library/jest-dom';
import { sampleOverview } from '../../fixtures/overview';

describe('Style selector', () => {
  let mockCurrentStyleIndex;
  let mockStylePriceIndex;

  let mockChangeStyle = (index) => {
    mockCurrentStyleIndex = index;
  };
  let mockChangeStylePrice = (index) => {
    mockStylePriceIndex = index;
  };
  beforeEach(() => {
    render(
      <StyleSelector
        changeStylePrice={mockChangeStylePrice}
        changeStyle={mockChangeStyle}
        currentStyle={0}
        styles={sampleOverview.styleData}
      />
    );
  });

  test('Should render an image thumbnail and style option for each style', () => {
    expect(screen.getAllByRole('img')).toHaveLength(sampleOverview.styleData.length);
    expect(screen.getAllByRole('style-option')).toHaveLength(sampleOverview.styleData.length);
  });

  test('Should only have one selected style', () => {
    // screen.getByRole('');
    expect(screen.getAllByRole('selected-style')).toHaveLength(1);
  });

  test('Should pass index up to click handlers', () => {
    let styles = screen.getAllByRole('style-option');

    for (var i = 1; i < styles.length; i++) {
      fireEvent.click(styles[i]);
      styles = screen.getAllByRole('style-option');
      expect(mockCurrentStyleIndex).toEqual(i);
      expect(mockStylePriceIndex).toEqual(i);
    }
  });

  test('Should display unique style name', () => {
    expect(screen.getByRole('heading', { name: /Forest Green & Black/i })).toBeInTheDocument();
  });
});

describe('Add to cart', () => {

  beforeEach(() => {
    render(<AddToCart skus={sampleOverview.styleData[0]['skus']}/>);
  });

  test('Should render a size and quantity input', () => {
    expect(screen.getAllByRole('combobox')).toHaveLength(2);
  });

  test('Quantity should be disabled before a size is selected', () => {
    let quantity = screen.getAllByRole('combobox')[1]
    expect(quantity.getAttribute('disabled')).toEqual("");
  });

  test('Select inputs should have default values', () => {
    let inputs = screen.getAllByRole('combobox');
    expect(inputs[0].value).toEqual("Select a size");
    expect(inputs[1].value).toEqual("—");
  });

  test('Select inputs should have default values', () => {
    let inputs = screen.getAllByRole('combobox');
    expect(inputs[0].value).toEqual("Select a size");
    expect(inputs[1].value).toEqual("—");
  });

  test('Make quantity should be 15', () => {
  let sizeSelect = screen.getByTestId('select-size');
  fireEvent.change(sizeSelect, { target: { value: 'M' } });
  expect(screen.queryByText('15')).toBeTruthy();
  expect(screen.queryByText('16')).toBeNull();
  });

  test('Once a size has been selected, the dropdown should default to 1.', () => {
    let sizeSelect = screen.getByTestId('select-size');
    fireEvent.change(sizeSelect, { target: { value: 'M' } });
    let inputs = screen.getAllByRole('combobox');
    expect(inputs[1].value).toEqual("1");
    });

  test('Once a size has been selected, the dropdown should default to 1.', () => {
    render(<AddToCart skus={{}}/>);
    expect(screen.queryByText('OUT OF STOCK')).toBeTruthy();
    });
});