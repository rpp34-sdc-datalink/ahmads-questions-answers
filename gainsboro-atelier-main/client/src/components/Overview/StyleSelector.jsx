import React, { useState } from 'react';

import styled from 'styled-components';
import { MdCheck, MdOutlineHideImage } from "react-icons/md";

const Styles = styled.div`
  display: flex;
  flex-wrap: wrap;
  position:  relative;
  width: 350px;
`;

const StyleWrapper = styled.div`
  &{
    width: 64px;
    height: 64px;
    margin-right: 16px;
    margin-bottom: 16px;
    margin-top: 0px;
    position: relative;
  }

  &:focus {
    border-radius: 50%;
    outline: 4px solid var(--color-brand-200);
  }
`;

const ThumbnailEmpty = styled.div`
  border-radius: 50%;
  width: 64px;
  height: 64px;
  margin-right: 16px;
  margin-bottom: 16px;
  font-size: 24px;
  color: var(--color-grey-300);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0px;
  background-color: var(--color-grey-050);
`;

const Thumbnail = styled.div`
  & {
    border-radius: 50%;
    width: 64px;
    height: 64px;
    overflow: hidden;
    background-image: url(${props => props.url});
    background-repeat: no-repeat;
    background-size: cover;
  }

  &:hover {
    opacity: ${props => props.selected ? '1' : '0.7'};
    cursor: ${props => props.selected ? 'default' : 'pointer'}
  }

  &:active {
    outline: 4px solid var(--color-brand-200);
  }
`;

const Img = styled.img`
  width: ${props => (props.landscapeOrientation ? 'auto': '64px')};
  height: ${props => (props.landscapeOrientation ? '64px' : 'auto')};
  overflow: hidden;
`;

const Selected = styled.div`
  border-radius: 50%;
  background-color: white;
  width: 16px;
  height: 16px;
  position: absolute;
  display: inline;
  top: 0px;
  right: 0px
`;

export default function StyleSelector ({changeStyle, changeStylePrice, currentStyle, styles}) {
  const [landscapeOrientations, setLandscapeOrientation] = useState([]);

  const styleOptions = styles.map((style, index)=> (
    <StyleWrapper
      aria-label={"style option"}
      role={"style-option"}
      aria-selected={index === currentStyle ? true : false}
      key={style.style_id}
      tabIndex={index === currentStyle ? null : "0"}
      onKeyPress={(event)=>{
        if (event.key === 'Enter') {
          changeStyle(index);
          changeStylePrice(index);
        }
      }}
      onClick={()=>{changeStyle(index); changeStylePrice(index);}}
    >
      {style['photos'][0]['thumbnail_url'] ? (
        <Thumbnail
          selected={index === currentStyle ? true : false}
          alt={`product style ${index}`}
          url={style['photos'][0]['thumbnail_url']}
        >
        </Thumbnail>
      ):(
        <ThumbnailEmpty>
          <MdOutlineHideImage/>
        </ThumbnailEmpty>
      )
      }
      {index === currentStyle && <Selected aria-label='selected style' role='selected-style'><MdCheck/></Selected>}
    </StyleWrapper>
  ));

  return (
    <div>
      <h6><strong>Style: </strong>{styles[currentStyle]['name']}</h6>
      <Styles>
        {styleOptions}
      </Styles>
    </div>
  )
}