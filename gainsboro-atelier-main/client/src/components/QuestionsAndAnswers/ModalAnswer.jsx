import React from 'react';
import styled from 'styled-components';

import { UploadPhotos } from './UploadPhotos.jsx';
import { cloudName, uploadPreset } from '../../../../config';

const ModalBody = styled.div`
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background: rgb(0,0,0); /* Fallback color */
`;

const Content = styled.div`
    background-color: #fefefe;
    margin: 15% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 80%; /* Could be more or less, depending on screen size */
    display: flex;
    flex-direction: column;
    width: 40%;
    justify-content: space-between;
`;

const Close = styled.span`
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;

    &:hover {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
`
const initState = {
    body: '',
    name: '',
    email: '',
    photos: [],
}

export class ModalAnswer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {...initState};
        this.saveAnswer = this.saveAnswer.bind(this);
    }

    uploadToCloudinary(image) {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", uploadPreset);
        data.append("cloud_name", cloudName);
        return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method:"post",
                body: data
            })
            .then(resp => resp.json())
            .then(data => data.url)
            .catch(err => console.log(err))
    }

    saveAnswer() {
        Promise.all(this.state.photos.map(
            (pic) => this.uploadToCloudinary(pic))
        ).then((picUrls) => {
            fetch(`/qa/questions/${this.props.questionId}/answers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...this.state,
                    product_id: this.props.productId,
                    photos: picUrls,
                })
            })
            .then(() => {
                this.setState({...initState});
                this.props.close();
            })
        })

    }

    render() {
        return (
            <ModalBody style={{ display: this.props.isOpen ? 'block' : 'none' }}>
                <Content >
                    <Close onClick={this.props.close}>&times;</Close>
                    <h5>Submit your Answer</h5>
                    <h6>{this.props.overview.name}: {this.props.question}</h6>
                    <label>Your Answer *</label>
                    <input
                        onChange={(e) => this.setState({
                            body: e.target.value,
                        })}
                     />
                    <label>What is your nickname *</label>
                    <input
                        onChange={(e) => this.setState({ name: e.target.value})}
                        placeholder='Example: jack543!'
                    />
                    <label>
                        For privacy reasons, do not use your full name or email address
                    </label>
                    <label>
                        Your email *
                    </label>
                    <input
                        type='email'
                        onChange={(e) => this.setState({ email: e.target.value })}
                        placeholder='Example: jack@email.com'
                    />
                    <label>For authentication reasons, you will not be emailed</label>
                    <UploadPhotos
                        limit={5}
                        photos={this.state.photos}
                        updatePhotos={(photos) => this.setState({ photos })}
                    />
                    <button onClick={this.saveAnswer}>
                        Submit answer
                    </button>
                </Content>

            </ModalBody>
        )
    }
}