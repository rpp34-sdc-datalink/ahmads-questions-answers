import React from 'react';
import styled from 'styled-components';
import StarRating from '../ReviewAndRating/StarRating.jsx';
import {Container, Carousel, Content, Card, BackArrow, BackArrowIcon, ForwardArrow, ForwardArrowIcon, NoImage, Image, TextBox, Heading5, Price, SalePrice, OriginalPrice} from './RelatedProducts.jsx';
import {VscAdd} from 'react-icons/vsc';
import {IoMdCloseCircle, IoMdCheckmark} from 'react-icons/io';
import {MdOutlineHideImage} from 'react-icons/md';

const Wrapper = styled.div`
  display: flex;
  padding-left: 50px;
`;

const AddCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 450px;
  width: 240px;
`;

const AddIcon = styled(VscAdd)`
  & {
    width: 30px;
    height: 30px;
    transition: all 0.5s ease;
  }
  &:hover {
    width: 50px;
    height: 50px;
  }
`;

const AddedIcon = styled(IoMdCheckmark)`
  width: 30px;
  height: 30px;
  color: #378f1e;
`

const ThreeCarousel = styled(Carousel)`
  width: 790px;
`;

const BackArrowForOutfit = styled(BackArrow)`
  width: 30px;
`;

const CloseCircle = styled.div`
  &{
    font-size: 25px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-color: #ffffff;
    position: absolute;
    top: 5px;
    right: 10px;
    transition: all 0.5s ease;
  }
  &:hover {
    font-size: 30px;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
`;

export default class YourOutfit extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      firstProductIndex: 0,
      absoluteLeft: 0,
    }
    this.handleForwardArrowClick = this.handleForwardArrowClick.bind(this);
    this.handleBackArrowClick = this.handleBackArrowClick.bind(this);
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


  render() {
    const {currProductId, outfitList, handleRemoveOutfitFromListClick, handleAddToOutfitClick} = this.props;
    const addedCurrProductToList = outfitList.reduce((result, outfit) => result = outfit.id === currProductId ? true : result, false);
    // console.log('addedCurrProductToList', addedCurrProductToList);
    return(
      <Wrapper>
        {addedCurrProductToList ?
          <AddCard>
            <AddedIcon />
            <small>This product has been added</small>
          </AddCard> :
          <AddCard>
            <AddIcon onClick={handleAddToOutfitClick}/>
            <small>Add to Outfit</small>
          </AddCard>
        }
        <Container>
          <BackArrowForOutfit>
            <BackArrowIcon visibility={this.state.firstProductIndex > 0 ? 'visible' : 'hidden'} onClick={this.handleBackArrowClick}/>
          </BackArrowForOutfit>
          <ThreeCarousel>
            <Content absoluteLeft={this.state.absoluteLeft}>
              {outfitList.map((outfit, index) => {
                const {id, ratings, name, category, currentStylePhotos, currentStylePrice, currentStyleSalePrice} = outfit;
                return (
                  <Card key={index}>
                    {!currentStylePhotos[0].thumbnail_url ?
                      <NoImage>
                        <MdOutlineHideImage/>
                      </NoImage> :
                      <Image url={currentStylePhotos[0].thumbnail_url} />
                    }
                    <CloseCircle onClick={() => handleRemoveOutfitFromListClick(id)}><IoMdCloseCircle /></CloseCircle>
                    <TextBox>
                      <small>{category}</small>
                      <Heading5>{name}</Heading5>
                      <Price>
                        {currentStyleSalePrice && <SalePrice>{currentStyleSalePrice}</SalePrice>}
                        <OriginalPrice lineThrough={currentStyleSalePrice ? 'line-through' : 'none'}>{currentStylePrice}</OriginalPrice>
                      </Price>
                      <StarRating ratings={ratings} showAve={false}/>
                    </TextBox>
                  </Card>
                )
              })}
            </Content>
          </ThreeCarousel>
          <ForwardArrow>
            <ForwardArrowIcon visibility={this.state.firstProductIndex + 3 < outfitList.length ? 'visible' : 'hidden'} onClick={this.handleForwardArrowClick}/>
          </ForwardArrow>
        </Container>
      </Wrapper>
    )
  }
}