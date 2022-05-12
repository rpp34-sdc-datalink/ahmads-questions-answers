import React from 'react';
import styled from 'styled-components';
import {MdArrowForwardIos, MdOutlineArrowBackIosNew} from 'react-icons/md';


const Modal = styled.div`
  position: absolute;
  z-index: 1;
  top: 300px;
  left: 0;
  width: 248px;
  height: 120px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 5px;
`;

const Carousel = styled.div`
  width: 210px;
  height: 60px;
  overflow: hidden;
  position: relative;
`
const Content = styled.div`
  display: flex;
  gap: 10px;
  position: absolute;
  top: 0;
  left: ${props => props.absoluteLeft}px;
  transition: all 1s ease;
`;

const Thumbnail = styled.img`
  &{
    width: 45px;
    height: 45px;
    border-radius: 4px;
    background-image: url(${props => props.url});
    background-repeat: no-repeat;
    background-size: cover;
  }
  &:hover {
    opacity: 0.7;
  }
`;

const SelectedImage = styled.div`
  height: 4px;
  background: var(--color-brand-300);
  border-radius: 2px;
`;

const BackArrow = styled.div`
  width: 15px;
`;

const BackArrowIcon = styled(MdOutlineArrowBackIosNew)`
  &{
    width: 15px;
    height: 15px;
    transition: all 0.5s ease;
    color: #b4b4b4;
  }
  &:hover {
    cursor: pointer;
    color: #535353;
  }
`

const ForwardArrow = styled.div`
  width: 15px;
`;

const ForwardArrowIcon = styled(MdArrowForwardIos)`
  &{
    width: 15px;
    height: 15px;
    transition: all 0.5s ease;
    color: #b4b4b4;
  }
  &:hover {
    cursor: pointer;
    color: #535353;
  }
`;


export default class ThumbnailCarousel extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      firstImageIndex: 0,
      absoluteLeft: 0,
    }
    this.handleForwardArrowClick = this.handleForwardArrowClick.bind(this);
    this.handleBackArrowClick = this.handleBackArrowClick.bind(this);
  }

  handleForwardArrowClick() {
    this.setState(preState => ({
      firstImageIndex: preState.firstImageIndex + 1,
      absoluteLeft: preState.absoluteLeft - 55
    }))
  }

  handleBackArrowClick() {
    this.setState(preState => ({
      firstImageIndex: preState.firstImageIndex - 1,
      absoluteLeft: preState.absoluteLeft + 55
    }))
  }

  render() {
    const {id, photos, selectedPreviewImageIndex, handleChangePreviewImageClick} = this.props;

    return(
      <Modal>
        {this.state.firstImageIndex > 0 &&
          <BackArrow>
            <BackArrowIcon onClick={this.handleBackArrowClick}/>
          </BackArrow>
        }
        <Carousel>
          <Content absoluteLeft={this.state.absoluteLeft}>
            {photos.map((photo, index) =>
            <div key={index}>
              <Thumbnail  url={photo.thumbnail_url} onClick={() => handleChangePreviewImageClick(id, index)}></Thumbnail>
              {selectedPreviewImageIndex === index && <SelectedImage/>}
            </div>
            )}
          </Content>
        </Carousel>
        {photos[this.state.firstImageIndex + 4] &&
          <ForwardArrow>
            <ForwardArrowIcon onClick={this.handleForwardArrowClick}/>
          </ForwardArrow>
        }
      </Modal>
    )
  }
}