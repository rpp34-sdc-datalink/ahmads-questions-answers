import React from 'react';
import styled from 'styled-components';

const Content = styled.div`
    background-color: #fefefe;
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const Photos = styled.div`
    display: flex;
    flex: direction: row;
`

const ImageContainer = styled.div`
    max-width: 18%;
    position: relative;
`

const StyledImg = styled.img`
    padding: 5px;
    width: -webkit-fill-available;
`

const Remove = styled.div`
    top: 0;
    left: 85%;
    background: beige;
    border-radius: 50%;
    border: 1px solid gray; 
    position: absolute;
    width: 18px;
    height: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`

const initState = {
    photos: []
}
export class UploadPhotos extends React.Component {
    constructor(props) {
        super(props);
        this.uploadThumbnail = this.uploadThumbnail.bind(this);
    }

    uploadThumbnail(e) {
        const photos = [...this.props.photos];

        if (photos.length >= this.props.limit) {
            return;
        }

        photos.push(e.target.files[0]);

        this.props.updatePhotos(photos);

        // this is to be able to re-upload the same file
        // https://stackoverflow.com/questions/19643265/second-use-of-input-file-doesnt-trigger-onchange-anymore
        e.target.value = '';
    }

    remove(i) {
        const photos = [...this.props.photos];

        photos.splice(i, 1);

        this.props.updatePhotos(photos);
    }

    render() {
        return (
            <Content >
                You can upload {this.props.limit - this.props.photos.length} more pictures
                <input type='file' onChange={this.uploadThumbnail} />
                <Photos>
                    {this.props.photos.map((file, i) => 
                        <ImageContainer key={JSON.stringify(file)}>
                            <StyledImg src={ URL.createObjectURL(file)} />
                            <Remove onClick={() => this.remove(i)}>&times;</Remove>
                        </ImageContainer>)}
                </Photos>
            </Content>
        )
    }
}