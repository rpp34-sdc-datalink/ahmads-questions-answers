import React from 'react';
import styled from 'styled-components';


const Modal = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 100px;
`;

  const FeatureCard = styled.div`
  width: 450px;
  max-height: 400px;
  overflow: scroll;
  border: 1px solid #b4b4b4;
  background-color: #FAFAFA;
  margin: auto;
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px;
`;

const Names = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CurrValue = styled.small`
  flex-grow: 1;
  flex-basis: 0;
  text-align: left;
`;

const FeatureName = styled.p`
  flex-grow: 1;
  flex-basis: 0;
  text-align: center;
  margin: 10px 0;
`;

const SelectedValue = styled.small`
  flex-grow: 1;
  flex-basis: 0;
  text-align: right;
`;

export default class FeatureModal extends React.Component{

  getFeatureValue(targetFeature, featureArr) {
    var value = featureArr.reduce((value, obj) => value = obj.feature === targetFeature ? value + obj.value : value, '');
    // console.log(value);
    return value;
  }

  render() {
    const {selectedName, selectedFeature, currFeature, currName, handleCloseModalClick} = this.props;
    const allFeatures = [...selectedFeature, ...currFeature].map(obj => obj.feature);
    const uniqueFeatures = [...new Set(allFeatures)];

    return(
      <Modal onClick={handleCloseModalClick}>
        <FeatureCard>
          <small>COMPARING</small>
          <Names>
            <h5>{currName}</h5>
            <h5>{selectedName}</h5>
          </Names>
          {uniqueFeatures.map(targetFeature =>
            <Item key={targetFeature}>
              <CurrValue>
                {this.getFeatureValue(targetFeature, currFeature)}
              </CurrValue>
              <FeatureName>{targetFeature}</FeatureName>
              <SelectedValue>
                {this.getFeatureValue(targetFeature, selectedFeature)}
              </SelectedValue>
            </Item>
          )}
        </FeatureCard>
      </Modal>
    )
  }
}