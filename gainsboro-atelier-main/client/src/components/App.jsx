import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import GlobalStyle from '../globalStyles.js'
import Overview from './Overview/Overview.jsx';
import RelatedAndOutfits from './RelatedAndOutfits/RelatedAndOutfits.jsx';
import QuestionAnswer from './QuestionsAndAnswers/QuestionAnswer.jsx';
import ReviewAndRating from './ReviewAndRating/ReviewAndRating.jsx';

//HOC to pass down router params
function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      addedOutfit: false,
      currentStyle: 0,
      overview: {},
      overviewStyle: {},
      reviews: [],
      relatedProducts: [],
      sort: 'relevant',
      meta: {},
      product_id: 64620,
      outfitList: [],
    }

    this.fetchDataFromAPI = this.fetchDataFromAPI.bind(this);
    this.changeStyle = this.changeStyle.bind(this);
    this.handleSortOptionChange = this.handleSortOptionChange.bind(this);
    this.voteForReview = this.voteForReview.bind(this);
    this.handleAddToOutfitClick = this.handleAddToOutfitClick.bind(this);
    this.handleRemoveOutfitFromListClick = this.handleRemoveOutfitFromListClick.bind(this);
    this.fetchDataAfterSubmittingNewReview = this.fetchDataAfterSubmittingNewReview.bind(this);
  }

  componentDidUpdate(prevProps) {
    if(this.props.params.productId !== prevProps.params.productId) {
      const addedOutfit = this.state.outfitList.reduce((result, outfit) => result = outfit.id === this.state['product_id'] ? true : result, false);
      this.setState({
        addedOutfit: addedOutfit,
        product_id: this.props.params.productId
      }, this.fetchDataFromAPI);
    }
  }

  componentDidMount() {
    const id = this.props.params.productId || this.state['product_id'];
    this.setState({
      product_id: id
    }, this.fetchDataFromAPI);
  }

  fetchDataFromAPI() {
    axios(`/overview/${this.state.product_id}`)
    .then(({data})=>{

      let defaultIndex;
      for (var i = 0; i < data.styleData.length; i++){
        if (data.styleData[i]['default?']){
          defaultIndex = i;
          break;
        }
      }
      defaultIndex = defaultIndex || 0;
      this.setState({
        currentStyle: defaultIndex,
        overview: data
      })
    });

    axios.get(`/products/${this.state.product_id}/related`)
    .then(({data}) => {
      this.setState({relatedProducts: data})
    });

    axios.get(`/reviews?product_id=${this.state.product_id}&sort=${this.state.sort}&count=500`)
    .then(data => {
      var reviews = data.data;
      this.setState(preState => ({
      reviews,
      moreReviewBtn: reviews.length <= 2 ? false : true
      }))
    });

    axios.get(`/reviews/meta/${this.state.product_id}`)
    .then(data => {
      var meta = data.data;
      this.setState({meta})
    });

    this.setState({outfitList: localStorage.getItem("outfit") === null ? [] : JSON.parse(localStorage.getItem("outfit"))})
  }

  changeStyle(index){
    console.log('index is: ', index);
    this.setState({
      currentStyle: index,
    })
  }

  handleSortOptionChange(e) {
    this.setState({sort: e.target.value}, () => {
      axios(`/reviews?product_id=${this.state.product_id}&sort=${this.state.sort}&count=500`)
      .then(data => {
        var reviews = data.data;
        this.setState({reviews,})
      })
    })
  }

  voteForReview(review_id, helpfulness) {
    axios.put(`/reviews/${review_id}/helpful`, {helpfulness})
    .then(data => {
      if (data.status === 204) {
        this.setState(preState => ({
          reviews: preState.reviews.map(review => review.review_id === review_id ? {...review, helpfulness: review.helpfulness + 1} : review)
        }))
      }
    })
  }

  handleAddToOutfitClick() {
    var newOutfit = {
      id: this.state.overview.id,
      name: this.state.overview.name,
      category: this.state.overview.category,
      currentStylePhotos: this.state.overview.styleData[this.state.currentStyle].photos,
      currentStylePrice: this.state.overview.styleData[this.state.currentStyle].original_price,
      currentStyleSalePrice: this.state.overview.styleData[this.state.currentStyle].sale_price,
      ratings: this.state.meta.ratings
    }
    var updatedOutfitList = [...this.state.outfitList, newOutfit];
    localStorage.setItem("outfit", JSON.stringify(updatedOutfitList));
    this.setState({
      outfitList: updatedOutfitList
    })
  }

  handleRemoveOutfitFromListClick(id) {
    var updatedOutfitList = this.state.outfitList.filter(outfit => outfit.id !== id);
    localStorage.setItem("outfit", JSON.stringify(updatedOutfitList));
    this.setState({
      outfitList: updatedOutfitList
    })
  }

  fetchDataAfterSubmittingNewReview() {
    axios.get(`/reviews?product_id=${this.state.product_id}&sort=${this.state.sort}&count=500`)
    .then(({data}) => this.setState({reviews: data}));

    axios.get(`/reviews/meta/${this.state.product_id}`)
    .then(({data}) => this.setState({meta: data}));
  }

  render() {
    return (
      <>
        <GlobalStyle />
        {Object.keys(this.state.overview).length > 0 &&
          <Overview
          addOutfit={this.handleAddToOutfitClick}
          changeStyle={this.changeStyle}
          currentStyle={this.state.currentStyle}
          data={this.state.overview}
          productId={this.state.product_id}
          ratings={this.state.meta.ratings}
          removeOutfit={this.handleRemoveOutfitFromListClick}
          addedOutfit={this.state.addedOutfit}
          />
        }
        <RelatedAndOutfits
          relatedProducts={this.state.relatedProducts}
          currProduct={this.state.overview}
          outfitList={this.state.outfitList}
          handleAddToOutfitClick={this.handleAddToOutfitClick}
          handleRemoveOutfitFromListClick={this.handleRemoveOutfitFromListClick}
        />
        {this.state.product_id !== 0 ? <QuestionAnswer
          productId={this.state.product_id}
          overview={this.state.overview}
        /> : null}
        <ReviewAndRating
          product_id={this.state.product_id}
          productName={this.state.overview.name}
          meta={this.state.meta}
          reviews={this.state.reviews}
          handleSortOptionChange={this.handleSortOptionChange}
          voteForReview={this.voteForReview}
          fetchDataAfterSubmittingNewReview={this.fetchDataAfterSubmittingNewReview}
        />
      </>
    );
  }
}

export default withParams(App);