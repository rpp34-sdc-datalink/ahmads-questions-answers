

import React from 'react';
import styled from 'styled-components';
import {MdCheckCircle, MdOutlineClose} from 'react-icons/md'

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    margin-bottom: 20px;
`;


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
  color: #378f1e;s
`

const Message = styled.span`
  color: #378f1e;
  margin-left: 5px;
`;

const QuestionAction = styled.span`
    text-decoration: underline;
    cursor: pointer;
`;

const StyledRightQuestion = styled.div`
  display: flex;

`

export class Question extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            helpfulVoted: false,

        }
        this.saveHelpful = this.saveHelpful.bind(this);
    }

    saveHelpful() {
        fetch(`/qa/questions/${this.props.qa.question_id}/helpful`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id: this.props.productId
            })
        })
        .then(() => {
            this.setState({
                helpfulVoted: true,
            })
        })

    }

    render() {
        const { qa } = this.props;

        return (
            <Container>
                <div>
                    Q: {qa.question_body}
                </div>
                <StyledRightQuestion>
                    <div> Helpful?
                        {this.state.helpfulVoted ?
                            <>
                                <Count>({qa.question_helpfulness + 1})</Count>
                                <CheckCircle />
                                <Message>Thank you for your feedback.</Message>
                            </> :
                            <>
                                <VoteLink onClick={() => this.saveHelpful()}>Yes</VoteLink>
                                <Count>({qa.question_helpfulness})</Count>
                            </>
                        }
                    </div>

                    {this.props.children}
                </StyledRightQuestion>
            </Container>
        )
    }
}
