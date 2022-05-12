import React from 'react';
import styled from 'styled-components';
import StarRating from '../ReviewAndRating/StarRating.jsx';
import FeatureModal from './FeatureModal.jsx';
import ThumbnailCarousel from './ThumbnailCarousel.jsx';
import {MdOutlineHideImage, MdOutlineStar, MdArrowForwardIos, MdOutlineArrowBackIosNew} from 'react-icons/md';
import { Link } from "react-router-dom";

export const Container = styled.div`
  display: flex;
  position: relative;
  // margin-bottom: 64px;
`;

export const Carousel = styled.div`
  width: 1160px;
  height: 480px;
  overflow: hidden;
  position: relative;
`
export const Content = styled.div`
  display: flex;
  gap: 20px;
  position: absolute;
  top: 0;
  left: ${props => props.absoluteLeft}px;
  transition: all 1s linear;
`;

export const Card = styled.div`
  &{
    border: 1px solid #b4b4b4;
    border-radius: 8px;
    width: 250px;
    height: 450px;
    position: relative;
  }
  &:hover{
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  }
`;

export const BackArrow = styled.div`
  width: 50px;
  padding-top: 200px;
`;

export const BackArrowIcon = styled(MdOutlineArrowBackIosNew)`
  &{
    width: 20px;
    height: 20px;
    transition: all 0.5s ease;
    visibility: ${props => props.visibility}
  }
  &:hover {
    cursor: pointer;
    width: 30px;
    height: 30px;
  }
`

export const ForwardArrow = styled.div`
  width: 50px;
  padding-top: 200px;
`;

export const ForwardArrowIcon = styled(MdArrowForwardIos)`
  &{
    width: 20px;
    height: 20px;
    transition: all 0.5s ease;
    visibility: ${props => props.visibility}
  }
  &:hover {
    cursor: pointer;
    width: 30px;
    height: 30px;
  }
`

export const NoImage = styled.div`
  width: 100%;
  height: 300px;
  background-color: #ebebeb;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

export const Image = styled.div`
  width: 100%;
  height: 300px;
  background-image: url(${props => props.url});
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
`;

export const TextBox = styled.div`
  padding: 10px;
`;

export const Heading5 = styled.h5`
  margin: 5px 0;
`;

const Star = styled(MdOutlineStar)`
  &{
    color: ${props => props.color};
    width: 25px;
    height: 25px;
    position: absolute;
    top: 5px;
    right: 10px;
    transition: all 0.5s ease;
  }
  &:hover {
    width: 30px;
    height: 30px;
    cursor: pointer;
    opacity: 1;
  }
`;

export const Price = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

export const SalePrice = styled.small`
  color: #FF0000;
`;

export const OriginalPrice = styled.small`
  text-decoration-line: ${props => props.lineThrough};
`;

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: inherit;
`;

export default class RelatedProducts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clickedStar: false,
      showModal: false,
      previewImages: {},
      selectedPreviewImageIndex: 0,
      firstProductIndex: 0,
      absoluteLeft: 0,
      showThumbnailCarousel: '',
    }
    this.handleCompareStarClick = this.handleCompareStarClick.bind(this);
    this.handleCloseModalClick = this.handleCloseModalClick.bind(this);
    this.handleForwardArrowClick = this.handleForwardArrowClick.bind(this);
    this.handleBackArrowClick = this.handleBackArrowClick.bind(this);
    this.handleMouseEnterImageClick = this.handleMouseEnterImageClick.bind(this);
    this.handleMouseLeaveImageClick = this.handleMouseLeaveImageClick.bind(this);
    this.handleChangePreviewImageClick = this.handleChangePreviewImageClick.bind(this);
  }

  handleCompareStarClick(obj, star) {
    this.setState({
      showModal: obj,
      clickedStar: star
    })
  }

  handleCloseModalClick() {
    this.setState({showModal: false, clickedStar: false})
  }

  handleForwardArrowClick() {
    this.setState(preState => ({
      firstProductIndex: preState.firstProductIndex + 1,
      absoluteLeft: preState.absoluteLeft - 270
    }))
  }

  handleBackArrowClick() {
    this.setState(preState => ({
      firstProductIndex: preState.firstProductIndex - 1,
      absoluteLeft: preState.absoluteLeft + 270
    }))
  }

  handleMouseEnterImageClick(str) {
    this.setState({showThumbnailCarousel: str})
  }

  handleMouseLeaveImageClick() {
    this.setState({showThumbnailCarousel: ''})
  }

  handleChangePreviewImageClick(id, index) {
    this.setState(preState => ({
      previewImages: {...preState.previewImages, [id]: index},
      selectedPreviewImageIndex: index
    }))
  }

  render() {
    const {relatedProducts, currFeature, currName} = this.props;
    return(
      <Container>
        <BackArrow>
          <BackArrowIcon visibility={this.state.firstProductIndex > 0 ? 'visible' : 'hidden'} onClick={this.handleBackArrowClick}/>
        </BackArrow>
        <Carousel>
          <Content absoluteLeft={this.state.absoluteLeft}>
            {relatedProducts.map((product, index) => {
              const {id, ratings, name, features, defaultStyle, category} = product;
              const {original_price, sale_price, photos} = defaultStyle;
              return (
                <Card>
                  {!photos || !photos[0].thumbnail_url ?
                    <NoImage>
                      <MdOutlineHideImage/>
                    </NoImage> :
                    <Image
                      url={this.state.previewImages[id] !== undefined ? photos[this.state.previewImages[id]].thumbnail_url : photos[0].thumbnail_url}
                      onMouseEnter={() => this.handleMouseEnterImageClick(`${id}thumbnailCarousel`)}
                      onMouseLeave={this.handleMouseLeaveImageClick}
                    >
                      {this.state.showThumbnailCarousel === `${id}thumbnailCarousel` &&
                        <ThumbnailCarousel
                          id={id}
                          photos={photos}
                          selectedPreviewImageIndex={this.state.selectedPreviewImageIndex}
                          handleChangePreviewImageClick={this.handleChangePreviewImageClick}
                        />
                      }
                    </Image>
                  }
                  <Star color={this.state.clickedStar === `${id}star`? '#378f1e' : '#ffc107'} onClick={() => this.handleCompareStarClick({name, features}, `${id}star`)}/>
                  <StyledLink to={`/${id}`} key={index}>
                    <TextBox>
                      <small>{category}</small>
                      <Heading5>{name}</Heading5>
                      <Price>
                        {sale_price && <SalePrice>{sale_price}</SalePrice>}
                        <OriginalPrice lineThrough={sale_price ? 'line-through' : 'none'}>{original_price}</OriginalPrice>
                      </Price>
                      <StarRating ratings={ratings} showAve={false}/>
                    </TextBox>
                  </StyledLink>
                </Card>
              )
            })}
          </Content>
        </Carousel>
        <ForwardArrow>
          <ForwardArrowIcon visibility={this.state.firstProductIndex + 4 < relatedProducts.length ? 'visible' : 'hidden'} onClick={this.handleForwardArrowClick}/>
        </ForwardArrow>
        {this.state.showModal !== false &&
          <FeatureModal
            selectedName={this.state.showModal.name}
            selectedFeature={this.state.showModal.features}
            currFeature={currFeature}
            currName={currName}
            handleCloseModalClick={this.handleCloseModalClick}
          />
        }
      </Container>
    )
  }
}

