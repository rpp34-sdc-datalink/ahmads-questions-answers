import React from 'react';
import styled from 'styled-components';
import {Title, ErrMessage, Input} from './AddReview.jsx';
import {Image} from './Review.jsx';
import {MdErrorOutline} from "react-icons/md";
import {AiOutlineCloseCircle} from "react-icons/ai";

const ThumbNails = styled.div`
  margin-top: 20px;
`;

const Photo = styled(Image)`
  width: 100px;
  height: 70px;
  position: relative;
`

const CloseCircle = styled(AiOutlineCloseCircle)`
  position: absolute;
  top: -5px;
  right: -10px;
  color: gray;
  background: beige;
  border-radius: 50%;
`;

export default class ImageUpload extends React.Component {

  handlePhotosClick(e) {
    e.target.value = '';
  }

  render() {
    const {photos, handlePhotosChange, handlePhotoDeleteClick} = this.props;
    const urls = photos.map(photo => URL.createObjectURL(photo));
    return (
      <>
        <Title>Upload your photos</Title>
        <div>
          <Input
            type="file"
            name="photos"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handlePhotosChange}
            onClick={this.handlePhotosClick}
            disabled={photos.length === 5 ? "disabled" : ""}
          />
          {photos.length === 5 && <ErrMessage><MdErrorOutline />Maximum reached</ErrMessage>}
          <ThumbNails>
            {urls.map((url, index) =>
              <Photo key={url} url={url}><CloseCircle onClick={() => handlePhotoDeleteClick(index)}/></Photo>
            )}
          </ThumbNails>
        </div>
      </>
    )
  }
}