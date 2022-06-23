import React from 'react';
import styled from 'styled-components';


// https://www.w3schools.com/howto/howto_css_modals.asp
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
}

export class ModalQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {...initState};
        this.saveQuestion = this.saveQuestion.bind(this);
        this.updateQuestion = this.updateField.bind(this);
    }

    updateField(value, field) {
        this.setState({
            [field]: value
        })
    }

    saveQuestion() {
        fetch('/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...this.state,
                product_id: this.props.productId
            })
        })
        .then(() => {
            this.setState({...initState});
            this.props.close();
        })
    }

    render() {
        return (
            <ModalBody style={{ display: this.props.isOpen ? 'block' : 'none' }}>
                <Content >
                    <Close onClick={this.props.close}>&times;</Close>
                    <h4>Ask Your Question</h4>
                    <h4>About the {this.props.overview.name}</h4>
                    <label>Your Question *</label>
                    <input
                        value={this.state.body}
                        onChange={(e) => this.updateField(e.target.value, 'body')}
                        placeholder='Why did you like the product or not?'
                    />
                    <label>Your email *</label>
                    <input
                        type='email'
                        value={this.state.email}
                        onChange={(e) => this.updateField(e.target.value, 'email')}
                        placeholder='Example: jack@email.com'
                    />
                    <label>For authentication reasons, you will not be emailed</label>
                    <label>What is your nickname *</label>
                    <input value={this.state.name} onChange={(e) => this.updateField(e.target.value, 'name')}
                    placeholder='Example: jackson11!'/>
                    <button onClick={this.saveQuestion}>Submit question</button>
                </Content>

            </ModalBody>
        )
    }
}