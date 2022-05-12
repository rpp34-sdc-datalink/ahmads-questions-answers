import React from 'react';
import styled from 'styled-components';
import Review from './Review.jsx';
import SortMenu from './SortMenu.jsx';
import AddReview from './AddReview.jsx';

const SortBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const SearchBox = styled.div`
  display: flex;
  width: 370px;
  flex-direction: column;
`;

const Search = styled.input`
  width: 370px;
  height: 45px;
  border: 2px solid #ebebeb;
`;

const SearchError = styled.small`
  color: #ff0000;
  font-size: 12px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 40px;
`;

const ReviewList = styled.div`
  width: 700px;
  max-height: 800px;
  overflow: scroll;
  border: 2px solid #ebebeb;
  border-radius: 6px;
  margin-bottom: 40px;
  padding: 40px;
`

var debounce = (fn, delay) => {
  var timeId;
  return function(...args) {
    clearTimeout(timeId);
    timeId = setTimeout(() => {fn(...args)}, delay)
  }
}

export default class Reviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currReviewIndex: 2,
      addReviewModal: false,
      search:'',
      searchError: false
    }
    this.handleMoreReviewBtnClick = this.handleMoreReviewBtnClick.bind(this);
    this.handleAddRviewBtn = this.handleAddRviewBtn.bind(this);
    this.handleCloseModalClick = this.handleCloseModalClick.bind(this);
    this.debounceSearch = debounce(this.handleSearchChange.bind(this), 500);
  }


  handleMoreReviewBtnClick() {
    this.setState(preState => ({currReviewIndex: preState.currReviewIndex + 2}))

  }

  handleAddRviewBtn() {
    this.setState({addReviewModal: true})
  }

  handleCloseModalClick() {
    this.setState({addReviewModal: false})
  }

  handleSearchChange(e) {
    var search = e.target.value;
    this.setState({
      search,
      searchError: search.length >=3 || search.length === 0 ? false : true
    })
  }


  render() {
    const {product_id, productName, reviews, characteristics, ratingFilter, handleSortOptionChange, voteForReview, fetchDataAfterSubmittingNewReview} = this.props;

    var filteredReivew = !ratingFilter.length && this.state.search.length < 3 ? reviews :
      reviews.filter(review => {
        if(ratingFilter.length && this.state.search.length >= 3) {
          return ratingFilter.includes(Number(review.rating)) && review.body.includes(this.state.search);
        }
        if(ratingFilter.length && this.state.search.length < 3) {
          return ratingFilter.includes(Number(review.rating))
        }
        if(!ratingFilter.length && this.state.search.length >= 3) {
          return review.body.includes(this.state.search)
        }
      })

    var renderList = filteredReivew.slice(0, this.state.currReviewIndex);
    var restList = filteredReivew.slice(this.state.currReviewIndex);

    return (
      <div>
        <SortBar>
          {!reviews.length ?
            <h4>0 review</h4> :
            <h4>{reviews.length} reviews, sorted by <SortMenu handleSortOptionChange={handleSortOptionChange}/> </h4>
          }
          {reviews.length > 0 &&
          <SearchBox>
            <Search
              type="text"
              placeholder="Please enter at least 3 characters to search..."
              onChange={this.debounceSearch}
            />
            {this.state.searchError && <SearchError>Please enter at least 3 characters to search</SearchError>}
          </SearchBox>}
        </SortBar>
        <ReviewList>
          {filteredReivew.length ?
            renderList.map((review, index) => <Review review={review} key={index} voteForReview={voteForReview} search={this.state.search}/> ) :
            <p>There is no review under current filters!</p>
          }
        </ReviewList>
        <ButtonGroup>
          {restList.length > 0 && <button type="button" onClick={this.handleMoreReviewBtnClick}>MORE REVIEWS</button>}
          <button type="button" onClick={this.handleAddRviewBtn}>ADD A REVIEW +</button>
        </ButtonGroup>
        {this.state.addReviewModal &&
          <AddReview
            product_id={product_id}
            productName={productName}
            characteristics={characteristics}
            handleCloseModalClick={this.handleCloseModalClick}
            fetchDataAfterSubmittingNewReview={fetchDataAfterSubmittingNewReview}
          />}
      </div>
    );
  }
}