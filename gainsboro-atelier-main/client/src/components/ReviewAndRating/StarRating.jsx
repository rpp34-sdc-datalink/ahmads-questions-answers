import React from 'react';
import styled from 'styled-components';

const Container = styled.span`
  display: flex;
  align-items: flex-start;
`;

const AveRating = styled.span`
  font-size: 60px;
  margin-right: 20px;

`;

const StarOuter = styled.span`
  & {
    position: relative;
    display: inline-block;
  }

  &:before {
    content: "★★★★★";
    color: #ebebeb;
  }
`;

const StarInner = styled.span`
  & {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    width: ${props => props.starWidth}%;
  }

  &:before {
    content: "★★★★★";
    color: #ffc107;
  }
`;

export default class StarRating extends React.Component {
  constructor(props) {
    super(props);
  }

  //get average rating in percentage (rounded to the first decimal)
  calAveRating(obj) {
    if (obj === undefined || Object.keys(obj).length === 0) {
      return 0;
    }
    var keys = Object.keys(obj);
    var values = Object.values(obj);
    var ratingCounts = values.reduce((sum, rating) => sum + Number(rating), 0);
    var totalRating = values.reduce((sum, rating, index) => sum + Number(rating) * Number(keys[index]), 0);
    return Math.round((totalRating / ratingCounts) * 10) / 10;
  }

  render() {
    if (typeof this.props.ratings === 'number') {
      var aveRating = this.props.ratings;
    } else {
      var aveRating = this.calAveRating(this.props.ratings);
    }
    var starPct = Math.round((aveRating / 5) * 100);
    return (
      <Container>
        {this.props.showAve && <AveRating>{aveRating}</AveRating>}
        <StarOuter>
          <StarInner starWidth={starPct}></StarInner>
        </StarOuter>
      </Container>
    )
  }
}
