import React, {useRef} from 'react';
import ExpandedView from './ExpandedView.jsx';
import styled from 'styled-components';
import {MdChevronLeft, MdChevronRight, MdOutlineExpandLess, MdOutlineExpandMore, MdOutlineHideImage} from "react-icons/md";

const Gallery = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 32px;
`;

const MainImageWrapper = styled.div`
  max-height: 50vw;
  max-width: 50vw;
  position: relative;
`;

const MainImage = styled.div`
  &{
    border-radius: 4px;
    height: min(50vw, 600px);
    width: min(50vw, 600px);
    overflow: hidden;
    background-image: url(${props => props.url});
    background-repeat: no-repeat;
    background-size: cover;
  }

  &:hover {
    cursor: zoom-in
  }

  &:focus-visible {
    outline: 4px solid var(--color-brand-200);
  }
`;

const MainImageEmpty = styled.div`
    border-radius: 4px;
    font-size: 48px;
    color: var(--color-grey-300);
    background-color: var(--color-grey-050);
    height: min(50vw, 600px);
    width: min(50vw, 600px);
    display: flex;
    align-items: center;
    justify-content: center
`;

const ImageButton = styled.div`
  &{
    border-radius: 4px;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255);
    border: var(--color-grey-100) solid 2px;];
    color: var(--color-grey-100);
    margin-top: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &:hover {
    cursor: pointer;
    border-color: var(--color-grey-300);
    color: var(--color-grey-300);
  }

  &:active {
    background-color: var(--color-brand-100);
    border-color: var(--color-brand-400);
    color: var(--color-brand-400);
  }
`;

const ButtonPlaceholder = styled.div`
    width: 40px;
    height: 40px;
    background: #FFF;
    margin-top: 8px;
    display: flex;
`;

const ViewArrow = styled.div`
  &{
    border-radius: 4px;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, .8);
    color: var(--color-grey-100);
    margin: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 1);
    border-color: var(--color-grey-300);
    color: var(--color-grey-300);
  }

  &:active {
    background-color: var(--color-brand-100);
    border-color: var(--color-brand-400);
    color: var(--color-brand-400);
  }
`;

const thumbnailHeight = 48;
const thumbnailBottom = 18;
const countVisibleThumbnails = 7
const thumbnailsHeight = countVisibleThumbnails * (thumbnailHeight + thumbnailBottom);

const ThumbnailsSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 16px;
  align-items: center;
`;


const ThumbnailsView = styled.div`
  max-height: ${`${thumbnailsHeight}px`};
  overflow-x: visible;
  overflow-y: hidden;
`;

const ThumbnailsWrapper = styled.div`
  margin-top: ${props => props.offset}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: visible;
  transition: all .3s ease-in-out 0s;
`;

const ThumbnailWrapper = styled.div`
  & {
    border-radius: 4px;
    width: 48px;
    height: 48px;
    margin-bottom: 2px;
    overflow: hidden;
    background-image: ${props => `url(${props.url})`};
    background-repeat: no-repeat;
    background-size: cover;
  }

  &:focus-visible {
    border: 6px solid var(--color-brand-400);
    outline: none;
  }
`;

const ThumbnailEmpty = styled.div`
  background-color: var(--color-grey-050);
  border-radius: 4px;
  font-size: 24px;
  color: var(--color-grey-300);
  width: 48px;
  height: 48px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  justify-content: center
`;

const ThumbnailSelected = styled.div`
  margin-bottom: 12px;
`;

const ThumbnailSelectedIndicator = styled.div`
  height: 4px;
  background: var(--color-brand-300);
  border-radius: 2px;
`;

const Thumbnail = styled.div`
  & {
    margin-bottom: 16px;
  }

  &:hover {
    opacity: 0.7;
    cursor: pointer
  }

  &:active {
    opacity: 0.5;
  }
`;

const UpArrow = styled(MdOutlineExpandLess)`
    height: 22px;
    width: 22px;
`;

const DownArrow = styled(MdOutlineExpandMore)`
    height: 22px;
    width: 22px;
`;

const LeftArrow = styled(MdChevronLeft)`
    height: 22px;
    width: 22px;
`;

const RightArrow = styled(MdChevronRight)`
    height: 22px;
    width: 22px;
`;

const ButtonArrowLeft = styled.div`
  position: absolute;
  top: min(calc(25vw - 28px), 276px);
`;

const ButtonArrowRight = styled.div`
  position: absolute;
  top: min(calc(25vw - 28px), 276px);
  right: 0px;
`;

export default class ImageGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      landscapeOrientations: [],
      modalIsOpen: false
    }

    this.changeImage = this.changeImage.bind(this);
    this.imageBack = this.imageBack.bind(this);
    this.imageForward = this.imageForward.bind(this);
    this.loadLandscapeOrientation = this.loadLandscapeOrientation.bind(this);
    this.toggleExpandedView = this.toggleExpandedView.bind(this);
  }

  changeImage(e){
    const currentIndex = parseInt(e.target.getAttribute('value')) || parseInt(e.currentTarget.getAttribute('value')) || 0;
    if (event.key === undefined || event.key === "Enter") {
      this.setState({
        currentIndex: currentIndex
      });
    }
  }

  loadLandscapeOrientation(e, index){
    let landscape = e.target.offsetWidth > e.target.offsetHeight ? true : false;
    let orientations = this.state.landscapeOrientations;
    orientations[index] = landscape;
    this.setState({
      landscapeOrientations: orientations
    })
  }

  imageBack(event, expandedView = false){
    event.stopPropagation();
    if (this.state.currentIndex > 0 && (event.key === undefined || event.key === "Enter" || expandedView)) {
      this.setState((prevState)=> ({
        currentIndex: prevState.currentIndex - 1
      }));
    }
  }

  imageForward(event, expandedView = false){
    event.stopPropagation();
    if (this.state.currentIndex < this.props.photos.length - 1 && (event.key === undefined || event.key === "Enter" || expandedView)) {
      this.setState((prevState)=> ({
        currentIndex: prevState.currentIndex + 1
      }));
    }
  }

  toggleExpandedView(){
    this.setState((prevState)=>({
      modalIsOpen: !prevState.modalIsOpen
    }))
  }

  render() {
    const {currentStyle, photos} = this.props;

    const thumbnails = photos.map((photo, index) => {
      return (
      index === this.state.currentIndex ? (
      <ThumbnailSelected key={index}>
        {photo.thumbnail_url ?
          (<ThumbnailWrapper url={photo.thumbnail_url} value={index} />) :
          (<ThumbnailEmpty selected={true} ><MdOutlineHideImage/></ThumbnailEmpty>)
        }
        <ThumbnailSelectedIndicator/>
      </ThumbnailSelected>
      ) : (
      <Thumbnail key={index} >
      {photo.thumbnail_url ?
        (<ThumbnailWrapper tabIndex="0" onKeyPress={this.changeImage} onClick={this.changeImage} url={photo.thumbnail_url} value={index} />) :
        (<ThumbnailEmpty selected={false} ><MdOutlineHideImage/></ThumbnailEmpty>)
      }
      </Thumbnail>
      )
    )});

    const thumbnailsOffset = this.state.currentIndex >= countVisibleThumbnails ? -(this.state.currentIndex - countVisibleThumbnails + 1) * (thumbnailHeight + thumbnailBottom) : 0;

    let nextImage, previousImage, nextThumbnail, previousThumbnail;

    return (
      <Gallery>
        <ThumbnailsSection>
          <ThumbnailsView>
            <ThumbnailsWrapper offset={thumbnailsOffset}>
              {thumbnails}
            </ThumbnailsWrapper>
          </ThumbnailsView>
          {this.state.currentIndex > 0 ?
          <ImageButton
            onClick={this.imageBack}
            onKeyPress={this.imageBack}
            tabIndex="0"
          >
            <UpArrow/>
          </ImageButton> :
          <ButtonPlaceholder></ButtonPlaceholder>}
          {this.state.currentIndex < photos.length -1 &&
          <ImageButton
            onClick={this.imageForward}
            onKeyPress={this.imageForward}
            tabIndex="0"
          >
            <DownArrow/>
          </ImageButton>}
        </ThumbnailsSection>
        <MainImageWrapper>
          {this.state.currentIndex > 0 &&
            <ButtonArrowLeft>
              <ViewArrow
                onClick={this.imageBack}
                onKeyPress={this.imageBack}
                tabIndex="0"
              >
                <LeftArrow/>
              </ViewArrow>
            </ButtonArrowLeft>
          }
          {this.state.currentIndex < photos.length -1 &&
          <ButtonArrowRight>
            <ViewArrow
              onClick={this.imageForward}
              onKeyPress={this.imageForward}
              tabIndex="0"
            >
              <RightArrow/>
            </ViewArrow>
          </ButtonArrowRight>
          }
          {photos[this.state.currentIndex]['url'] ?
          (<MainImage
            onClick={this.toggleExpandedView}
            onKeyPress={(event)=>{if(event.key ==="Enter") {this.toggleExpandedView()}}}
            tabIndex="0"
            url={photos[this.state.currentIndex]['url']}

          />) :
          (<MainImageEmpty><MdOutlineHideImage/></MainImageEmpty>)
          }
        </MainImageWrapper>
        {this.state.modalIsOpen &&
          <ExpandedView
            currentIndex={this.state.currentIndex}
            changeImage={this.changeImage}
            imageCount={photos.length}
            imageBack={this.imageBack}
            imageForward={this.imageForward}
            toggleExpandedView={this.toggleExpandedView}
            url={photos[this.state.currentIndex]['url']}>
          </ExpandedView>
        }
      </Gallery>
    );
  }
}