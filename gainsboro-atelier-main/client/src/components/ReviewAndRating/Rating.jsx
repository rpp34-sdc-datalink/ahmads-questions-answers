import React from 'react';
import StarRating from './StarRating.jsx';
import RatingFilter from './RatingFilter.jsx';
import RatingFilterList from './RatingFilterList.jsx';
import Characters from './Characters.jsx';
import styled from 'styled-components';

const Container = styled.div`
  padding-top: 30px;
`;


const Recommend = styled.p`
  margin: 30px 0;
`;


export default function Rating({meta, ratingFilterList, handleStarRatingClick, handleRemoveStarRatingClick, handleRemoveAllFiltersClick}) {
  const {characteristics, ratings, recommended} = meta;
  const recommendTrue = recommended.true || 0;
  const recommendFalse = recommended.false || 0;
  const aveRecommend = Number(recommendTrue) / (Number(recommendTrue) + Number(recommendFalse));
  const aveRePct = Math.round(aveRecommend * 100);
  return (
    <Container>
      <StarRating ratings={ratings} showAve={true}/>
      <Recommend>{aveRePct}% of reviews recommend this product</Recommend>
      <RatingFilter ratings={ratings} handleStarRatingClick={handleStarRatingClick}/>
      {!ratingFilterList.length ? '' :
        <RatingFilterList
          ratingFilterList={ratingFilterList}
          handleRemoveStarRatingClick={handleRemoveStarRatingClick}
          handleRemoveAllFiltersClick={handleRemoveAllFiltersClick}/>
      }
      <Characters characteristics={characteristics}/>
    </Container>
  )
}