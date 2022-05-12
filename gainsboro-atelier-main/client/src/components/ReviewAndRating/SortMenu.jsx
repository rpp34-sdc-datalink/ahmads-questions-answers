import React from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: inline-block;
  `;

const Select = styled.select`
  border: 0;
  font-size: 1.25rem;
  font-weight: 500;
  text-decoration: underline;
`;

export default function SortMenu({handleSortOptionChange}) {
  return(
    <Form>
      <Select onChange={handleSortOptionChange}>
        <option value="relevant">Relevant</option>
        <option value="newest">Newest</option>
        <option value="helpful">Helpful</option>
      </Select>
    </Form>
  )
}