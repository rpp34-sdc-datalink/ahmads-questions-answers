import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  & {
    padding: 8px 0;
    cursor: pointer;
  }
  &:hover {
    background-color: #D4D4D4;
    border-radius: 3px;
    padding-left: 10px;
  }
`;

const BarBtm = styled.div`
  display: inline-block;
  position: relative;
  margin: 0 5px 0 20px;
  height: 10px;
  width: 200px;
  background-color: #ebebeb;
`;

const BarTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  width: ${props => props.barWidth}%;
  height: 10px;
  background-color: #ffc107;
`;

const StarCount = styled.span`
  font-size: 12px;
  margin-right: 8px;
`;

export default function RatingFilter({ratings, handleStarRatingClick}) {
  var ratingCounts = Object.values(ratings).reduce((sum, rating) => sum + Number(rating), 0);
  return (
    <div>
      {[5, 4, 3, 2, 1].map(num =>
        <Wrapper key={num} onClick={() => handleStarRatingClick(num)}>
          <small>{num} stars</small>
          <BarBtm>
            <BarTop barWidth={Math.round((Number(ratings[num]) / ratingCounts) * 100)}></BarTop>
          </BarBtm>
          <StarCount>({ratings[num] === undefined ? 0 : ratings[num]})</StarCount>
        </Wrapper>
        )}
    </div>
  )
}