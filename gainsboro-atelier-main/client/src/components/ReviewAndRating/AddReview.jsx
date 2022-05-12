import React from 'react';
import axios from 'axios';
import {CloseImage} from './Review.jsx';
import CharactersRating from './CharactersRating.jsx';
import ImageUpload from './ImageUpload.jsx';
import styled from 'styled-components';
import {MdStar} from 'react-icons/md';
import {FcCheckmark} from "react-icons/fc";
import {MdErrorOutline, MdArrowRight} from "react-icons/md";
import {CgAsterisk} from "react-icons/cg";

const NewReviewModal = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.9);
  padding-top: 70px;
`;

const NewReviewForm = styled.div`
  margin: auto;
  width: 1000px;
  height: 700px;
  background-color: #FAFAFA;
  padding: 30px;
`;

const Header = styled.h3`
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 900px;
  max-height: 500px;
  overflow: scroll;
  border: 2px solid #ebebeb;
  padding: 30px;
  margin-bottom: 20px;
`;


const Section = styled.div`
  margin-bottom: 40px;
  display: flex;
  align-items: flex-start;
`;

export const Title = styled.span`
  display: inline-block;
  width: 270px;
`;

const RatingInput = styled.input`
  display: none;
`;

const StarResultDiv = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const Star = styled(MdStar)`
  display: inline-block;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const StarResult = styled.small`
  color: #378f1e;
`;

export const ErrMessage = styled.p`
  font-size: 12px;
  color: #F20000;
`;

const SuccessMessage = styled.p`
  font-size: 12px;
  color: #378f1e;
`;

const RemindMessage = styled.p`
  font-size: 12px;
  color: #969696;
`;

const TextArea = styled.textarea`
  display: block;
`;

export const Input = styled.input`
  width: 535px;
`;


const SubmitBtn = styled.input`
  &{
    border-radius: 4px;
    border: 2px solid var(--color-grey-100);
    color: var(--color-grey-200);
    padding: 10px 16px;
    font-weight: 500;
    font-size: 1rem;
    background: transparent;
  }
  &:hover{
    color: #1B50BA;
    border: 2px solid var(--color-brand-300);
    font-weight: 500px;
  }
  &:active {
    background-color: var(--color-brand-100);
  }
`;

const CloseModal = styled(CloseImage)`
  right: 30px;
`;

export const Asterisk = styled(CgAsterisk)`
  color: #F20000;
`

const CreatedSuccess = styled.div`
  // color: #378f1e;
  font-size: 24px;
  text-align: center;
  margin-top: 150px;
`;

export default class AddReview extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      starRating: 0,
      hovorStarRating: 0,
      starRatingErrMsg: false,
      recommend: '',
      characteristics: {},
      summary: '',
      body: '',
      photos: [],
      nickname: '',
      email: '',
      createdReview: false
    }
    this.handleStarRatingChange = this.handleStarRatingChange.bind(this);
    this.handleHoverStarRating = this.handleHoverStarRating.bind(this);
    this.handleRecommendChange = this.handleRecommendChange.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleCharacterChange = this.handleCharacterChange.bind(this);
    this.handlePhotosChange = this.handlePhotosChange.bind(this);
    this.handlePhotoDeleteClick = this.handlePhotoDeleteClick.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  handleStarRatingChange(e) {
    var starRating = Number(e.target.value);
    this.setState({starRating, hoverStarRating: e.target.value, starRatingErrMsg: false})
  }

  handleHoverStarRating(num) {
    this.setState({hoverStarRating: num})
  }

  handleRecommendChange(e) {
    this.setState({
      recommend: e.target.value === 'Yes' ? true : false,
      starRatingErrMsg: this.state.starRating? false : true
    })
  }

  handleFormChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  handleCharacterChange(e) {
    this.setState(preState => ({
      characteristics: {...preState.characteristics, [e.target.name]: Number(e.target.value)}
    }))
  }

  handlePhotosChange(e) {
    this.setState(preState => {
      // console.log('e.target.files', e.target.files);
      // console.log('e.target.files[0]', e.target.files[0]);
      return ({photos: [...preState.photos, e.target.files[0]]})
    })
  }

  handlePhotoDeleteClick(deletedIndex) {
    this.setState(preState => ({photos: preState.photos.filter((photo, index) => index !== deletedIndex)}))
  }

  handleFormSubmit(e) {
    e.preventDefault();
    if (this.state.starRating) {
      var formData = new FormData();
      formData.append("product_id", JSON.stringify(Number(this.props.product_id)));
      formData.append("rating", JSON.stringify(this.state.starRating));
      formData.append("summary", this.state.summary);
      formData.append("body", this.state.body);
      formData.append("recommend", JSON.stringify(this.state.recommend));
      formData.append("name", this.state.nickname);
      formData.append("email", this.state.email);
      for(let i=0; i<this.state.photos.length; i++) {
        formData.append(`images`, this.state.photos[i])
      }
      formData.append("characteristics", JSON.stringify(this.state.characteristics));

      axios({
        url: '/reviews',
        method: 'POST',
        data: formData,
        headers: {'content-type': 'multipart/form-data'}
      })
      .then(({data}) => {
        if (data === 'Created') {
          this.setState({createdReview: true})
          this.props.fetchDataAfterSubmittingNewReview();
        }
      })
      .catch(err => console.log(err))

    } else {
      this.setState({starRatingErrMsg: true})
    }
  }

  closeModal() {
    this.props.handleCloseModalClick();
    this.setState({createdReview: true})
  }

  render() {
    const starRatingMapping = {
      1: 'Poor',
      2: 'Fair',
      3: 'Average',
      4: 'Good',
      5: 'Great'
    }

    return (
      <NewReviewModal>
        <CloseModal onClick={this.closeModal}/>
        <NewReviewForm>
          {this.state.createdReview ? <CreatedSuccess>Thanks so much for your feedback!</CreatedSuccess> :
          <>
          <Header>Write Your Review About the {this.props.productName}</Header>
          <Form onSubmit={this.handleFormSubmit}>
            <Container>
              <Section>
                <Title>Overall rating:<Asterisk/></Title>
                <StarResultDiv>
                  <div>
                    {[1, 2, 3, 4, 5].map(num =>
                      <label key={num}>
                        <RatingInput
                          type="radio"
                          name="rating"
                          value={num}
                          onChange={this.handleStarRatingChange}
                          />
                        <Star color={num <= (this.state.starRating || this.state.hoverStarRating) ? '#ffc107' : '#ebebeb'}
                          onMouseEnter={() => this.handleHoverStarRating(num)}
                          onMouseLeave={() => this.handleHoverStarRating(0)}
                        />
                      </label>
                    )}
                    {this.state.starRatingErrMsg ? <ErrMessage><MdErrorOutline />Please give a rating to this product.</ErrMessage> : ''}
                  </div>
                  <StarResult>{starRatingMapping[this.state.starRating] ? starRatingMapping[this.state.starRating] : ''}</StarResult>
                </StarResultDiv>
              </Section>
              <Section>
                <Title>Do you recommend this product?<Asterisk/></Title>
                <div>
                  {['Yes', 'No'].map(value =>
                    <label key={value} style={{marginRight: '40px'}}>
                      <input
                        type="radio"
                        name="recommend"
                        value={value}
                        onChange={this.handleRecommendChange}
                        required
                      />
                      {value}
                    </label>
                  )}
                </div>
              </Section>
              <Section>
                <CharactersRating
                  characteristics={this.props.characteristics}
                  handleCharacterChange={this.handleCharacterChange}
                />
              </Section>
              <Section>
                <Title>Review summary</Title>
                <div>
                  <TextArea
                    rows="2"
                    cols="60"
                    maxLength="60"
                    name="summary"
                    value={this.state.summary}
                    placeholder='Example: Best purchase ever!'
                    onChange={this.handleFormChange}
                  />
                  {this.state.summary.length >= 60 && <ErrMessage><MdErrorOutline />Maximum reached</ErrMessage>}
                </div>
              </Section>
              <Section>
                <Title>Review<Asterisk/></Title>
                <div>
                  <TextArea
                    rows="10"
                    cols="60"
                    minLength="50"
                    maxLength="1000"
                    name="body"
                    value={this.state.body}
                    placeholder='Why did you like the product or not?'
                    onChange={this.handleFormChange}
                    required
                  />
                  {this.state.body.length < 50 ?
                    <ErrMessage><MdErrorOutline />Minimum required characters left: {50 - this.state.body.length}</ErrMessage> :
                    <SuccessMessage><FcCheckmark />Minimum reached</SuccessMessage>
                  }
                  {this.state.body.length === 1000 && <ErrMessage><MdErrorOutline />Maximum reached</ErrMessage>}
                </div>
              </Section>
              <Section>
                <ImageUpload
                  photos={this.state.photos}
                  handlePhotosChange={this.handlePhotosChange}
                  handlePhotoDeleteClick={this.handlePhotoDeleteClick}
                />
              </Section>
              <Section>
                <Title>Nickname<Asterisk/></Title>
                <div>
                  <TextArea
                    rows="2"
                    cols="60"
                    maxLength="60"
                    name="nickname"
                    value={this.state.nickname}
                    placeholder='Example: jackson11!'
                    onChange={this.handleFormChange}
                    required
                  />
                  <RemindMessage><MdArrowRight />For privacy reasons, do not use your full name or email address</RemindMessage>
                  {this.state.nickname.length >= 60 && <ErrMessage><MdErrorOutline />Maximum reached</ErrMessage>}
                </div>
              </Section>
              <Section>
                <Title>Email<Asterisk/></Title>
                <div>
                  <Input type="email" name="email" value={this.state.email} onChange={this.handleFormChange} required/>
                  <RemindMessage><MdArrowRight />For authentication reasons, you will not be emailed</RemindMessage>
                </div>
              </Section>
            </Container>
            <SubmitBtn type="submit" value="Submit" />
          </Form>
          </>
          }
        </NewReviewForm>
      </NewReviewModal>
    )
  }
}