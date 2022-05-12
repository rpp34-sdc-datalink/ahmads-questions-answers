import React from 'react';
import styled from 'styled-components';
import {Title, Asterisk} from './AddReview.jsx';


const Character = styled.div`
  display: flex;
`;

const CharacterTitle = styled.span`
  display: inline-block;
  width: 110px;
`;

const RadiosAndSelection = styled.div`
  width: 420px;
  margin-bottom: 30px;
  border-radius: 2px;
  background-color: #f2f2f2;
  padding: 10px
`;

const Selections = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #378f1e;
`;

const Selection = styled.div`
  visibility: ${props => props.show};
`;

const Radios = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const HighLowSelection = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #5f5f5f;
`;

export default class CharactersRating extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      selectedCharacters: {}
    }
    this.selectedCharacter = this.selectedCharacter.bind(this);
  }

  selectedCharacter(e, character, index) {
    this.props.handleCharacterChange(e);
    this.setState(preState => ({
      selectedCharacters: {...preState.selectedCharacters, [character]: index}
    }))
  }

  render() {
    const characteristics = this.props.characteristics;
    const charactersSelection = {
      Size: ["A size too small", "1⁄2 a size too small", 'Perfect', "1⁄2 a size too big", "A size too wide"],
      Width: ["Too narrow", "Slightly narrow", "Perfect", "Slightly wide", "Too wide"],
      Comfort: ["Uncomfortable", "Slightly uncomfortable", "Ok", "Comfortable", "Perfect"],
      Quality: ["Poor", "Below average", "What I expected", "Pretty great", "Perfect"],
      Length: ["Runs Short", "Runs slightly short", "Perfect", "Runs slightly long", "Runs long"],
      Fit: ["Runs tight", "Runs slightly tight", "Perfect", "Runs slightly long", "Runs long"]
    }
    return (
      <>
        <Title>Characteristics<Asterisk /></Title>
        <div>
          {Object.keys(characteristics).map(character =>
            <Character key={character}>
              <CharacterTitle>{character}</CharacterTitle>
              <RadiosAndSelection>
                <Selections>
                  {charactersSelection[character].map((selection, index) =>
                    <Selection
                      key={index}
                      show={this.state.selectedCharacters[character] === index ? 'visible' : 'hidden'}
                    >
                      {selection}
                    </Selection>
                  )}
                </Selections>
                <Radios>
                  {charactersSelection[character].map((selection, index) =>
                    <input
                      key={index}
                      type="radio"
                      name={characteristics[character].id}
                      value={index + 1}
                      onChange={(e) => this.selectedCharacter(e, character, index)}
                      required
                    />
                  )}
                </Radios>
                <HighLowSelection>
                  <span>{charactersSelection[character][0]}</span>
                  <span>{charactersSelection[character][4]}</span>
                </HighLowSelection>
              </RadiosAndSelection>
            </Character>
          )}
        </div>
      </>
    )
  }
}