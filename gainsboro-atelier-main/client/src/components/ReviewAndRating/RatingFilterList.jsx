import React from 'react';
import styled from 'styled-components';
import {GrFormClose} from 'react-icons/gr';

const FilterList = styled.div`
  margin-top: 30px;
`;

const FilterContainer = styled.div`
  display: flex;
  max-width: 310px;
  flex-wrap: wrap;
`;

const RatingBtn = styled.button`
  padding: 5px 10px;
  margin-right: 5px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
`

export default function RatingFilterList({ratingFilterList, handleRemoveStarRatingClick, handleRemoveAllFiltersClick}) {
  return(
    <FilterList>
      <p>Filter reviews by ratings</p>
      <FilterContainer>
      {ratingFilterList.map(rating =>
        <RatingBtn type="button" key={rating}>
          <small>{rating} stars</small>
          <GrFormClose onClick={() => handleRemoveStarRatingClick(rating)}/>
        </RatingBtn>
      )}
      <RatingBtn type="button">
          <small>Remove all filters</small>
          <GrFormClose onClick={handleRemoveAllFiltersClick}/>
      </RatingBtn>
      </FilterContainer>
    </FilterList>
  )
}