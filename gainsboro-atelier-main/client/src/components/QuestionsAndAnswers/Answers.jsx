import React from 'react';
import styled from 'styled-components';
import {MdCheckCircle, MdOutlineClose} from 'react-icons/md'


const VoteLink = styled.a`
  & {
    display: inline-block;
    width: 25px;
    margin-left: 5px;
    cursor: pointer;
    text-decoration: underline;
    color: #378f1e;
  }

  &:hover {
    font-weight: 900;
  }
`;

const Count = styled.span`
  margin: 0 6px;
`;

const CheckCircle = styled(MdCheckCircle)`
  color: #378f1e;
`;

const Message = styled.span`
  margin-left: 5px;
`;

const ColoredMessage = styled(Message)`
    color: #378f1e;
`;


const Button = styled.button`
  background: transparent;
  border: 2px solid #d4d4d4;
  color: #525252;
  padding: 15px 30px;
  margin-right: 40px;
`;

const Image = styled.div`
  & {
    display: inline-block;
    margin-right: 20px;
    width: 130px;
    height: 100px;
    background-image: url(${props => props.url});
    background-size: cover;
    background-position: center;
    border: 1px solid #b4b4b4;
    margin-top: 10px;
  }

 &:hover {
   opacity: 0.8;
   cursor: pointer;
 }
`;

class Answer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            helpfulVoted: false,
            reported: this.props.reported || false,
            showImage: false
        }
        this.saveHelpful = this.saveHelpful.bind(this);
        this.handleImageClick = this.handleImageClick.bind(this);
    }
    
    saveHelpful() {
        fetch(`/qa/answers/${this.props.id}/helpful`, {
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
            this.setState({
                helpfulVoted: true,
            })
        })
    }

    handleImageClick(url) {
        this.setState({
            showImage: url
        })
    }

    report() {
        fetch(`/qa/answers/${this.props.id}/report`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...this.state,
                product_id: this.props.productId
            })
        })
        .then(() => {
            this.setState({
                reported: true,
            })
        })
    }
    
    render() {
        var formatedDate = new Date(this.props.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return (
        <>
            <div key={this.props.body} >
                <span style={{ fontWeight: 600 }}>A:</span> {this.props.body}
            </div>
            {this.props.photos.length > 0 
                && this.props.photos.map(
                    photo => <Image 
                            key={photo}
                            style={{backgroundImage: `url(${photo})`}}
                            onclick={() => {this.handleImageClick(photo)}}>
                    </Image>)
            }
            <p>
                <small>
                    by {this.props.answerer_name}, {formatedDate} | Helpful? 
                    {this.state.helpfulVoted ? 
                        <>
                            <Count>({this.props.helpfulness + 1})</Count>
                            <CheckCircle />
                            <ColoredMessage>Thank you for your feedback.</ColoredMessage>
                        </> :
                        <>
                            <VoteLink onClick={() => this.saveHelpful()}>Yes</VoteLink>
                            <Count>({this.props.helpfulness})</Count>
                        </> 
                    }
                <span>| </span>
                {this.state.reported ? 
                        <>
                            <Message>Reported</Message>
                        </> :
                        <>
                            <VoteLink onClick={() => this.report()}>Report</VoteLink>
                        </> 
                }
                </small>       
             </p>
        </>
        )
    }
}

export class AnswersGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        }
        this.flipExpanded = this.flipExpanded.bind(this);
    }

    flipExpanded() {
        this.setState({
            expanded: !this.state.expanded
        })
    }
    // Up to two answers should display for each question.
    render() {
        const answersToRender = this.state.expanded ? this.props.answers : this.props.answers.slice(0, 2);

        return (
        <div>
            {answersToRender.map((ans) => <Answer key={ans.body} {...ans} />)}
            <button onClick={this.flipExpanded}>
                {this.state.expanded ? 'Show less answers' : 'Load more answers'}
            </button>
        </div>)
    }
}


