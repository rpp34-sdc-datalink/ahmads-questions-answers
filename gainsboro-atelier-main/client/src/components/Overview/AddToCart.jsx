import React, {createRef} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {MdStarOutline, MdStar} from "react-icons/md";

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
  margin-bottom: 16px;
  height: 32px;
`;

const Select = styled.select`
  width: ${props => props.width}%;
  font-size: 1rem;
  padding: 10px 24px 10px 10px;
  margin-right: 12px;
  margin-bottom: 12px;
  border-radius: 4px;
  -webkit-appearance: none;
  appearance: none;
  color: ${props => (props.value === 'Select a size' ? (`var(--color-grey-200)`) : (`var(--color-grey-400)`))}
`;

const SelectWrapper = styled.div`
  &{
    display: inline-block;
    position: relative;
  }

  &:after {
    content: "▾";
    font-size: 1rem;
    margin-top: 4px;
    top: 6px;
    right: 20px;
    position: absolute;
    color: black;
  }
`;

const InputButton = styled.input`
  &{
    background-color: white;
    border-radius: 4px;
    border: 2px solid var(--color-grey-100);
    color: var(--color-grey-200);
    padding: 10px 16px;
    width: 100%;
    font-weight: 500;
    font-size: 1rem;
    margin-bottom: 0px;
  }

  &:hover{
    color: var(--color-brand-300);
    border: 2px solid var(--color-brand-300);
    font-weight: 500px;
  }

  &:active{

    background-color: var(--color-brand-100);
  }
`;

const IconButton = styled.div`
  &{
    border-radius: 4px;
    min-width: 42px;
    height: 42px;
    background: rgba(255, 255, 255);
    border: var(--color-grey-100) solid 2px;];
    color: ${props => (props.addedOutfit ? `var(--color-yellow-100)` : `var(--color-grey-100)`)};
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &:hover {
    cursor: pointer;
    border-color: var(--color-grey-300);
    color: ${props => (props.addedOutfit ? `var(--color-yellow-100)` : `var(--color-grey-300)`)};
  }
`;

const StarOutline = styled(MdStarOutline)`
    height: 22px;
    width: 22px;
`;

const StarFill= styled(MdStar)`
    height: 22px;
    width: 22px;
    color: var(--color-yellow-100);
`;

export default class AddToCart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addedOutfit: false,
      firstSku: 0,
      maxQuantity: null,
      selectedSku: null,
      selectedSize: null,
      selectedQuantity: 1
    }
    this.selectSize = this.selectSize.bind(this);
    this.selectQuantity = this.selectQuantity.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    this.setState({
      addedOutfit: this.props.addedOutfit
    })
  }

  componentDidUpdate(){
    //handle a style change by updating the sku to reflect the same size
    if (this.state.selectedSize && this.state.firstSku !== Object.keys(this.props.skus)[0]) {
      let newSku;
      for (var key in this.props.skus) {
        if (this.props.skus[key]['size'] === this.state.selectedSize) {
          newSku = key;
        }
      }

      let maxQuantity = Math.min(15, this.props.skus[newSku].quantity);
      let selectedQuantity = this.state.selectedQuantity > maxQuantity ? 1 : this.state.selectedQuantity;

      this.setState({
        addedOutfit: this.props.addedOutfit,
        selectedQuantity: selectedQuantity,
        selectedSku: newSku,
        maxQuantity: maxQuantity,
        firstSku: Object.keys(this.props.skus)[0]
      });
    }
  }


  handleSubmit(){
    event.preventDefault();
    axios.post(`/cart`, {"sku_id": this.state.selectedSku})
    .then((data)=>{
      //receive cart data
    })
    .catch((err)=>{
      // console.log('unable to add to bag', err);
    })
  }


  selectSize(event){
    let selectedSku  = event.target.selectedOptions[0].getAttribute('sku');
    let maxQuantity = Math.min(15, this.props.skus[selectedSku].quantity);

    this.setState({
      selectedSize: event.target.value,
      selectedSku : selectedSku,
      maxQuantity: maxQuantity,
    })
  }


  selectQuantity(e){
    this.setState({
      selectedQuantity: e.target.value
    })
  }


  render() {
    const {addOutfit, productId, removeOutfit, skus} = this.props;

    let sizes = Object.keys(skus).map(sku =>
      (<option key={sku} value={skus[sku].size} sku={sku} >
        {skus[sku].size}
      </option>)
    );

    sizes.unshift(
      <option value='Select a size' key={'select a size'}>
        Select a size
      </option>)

    let addToCart, size, quantity;

    if (Object.keys(skus).length === 0 || skus['null']){
      size= <Select name="sizes" disabled>
      <option>OUT OF STOCK</option>
    </Select>;
    } else {
      size =
      <SelectWrapper>
        <Select
          data-testid="select-size"
          name="size"
          onChange={this.selectSize}
          ref={this.sizeRef}
          value={this.state.selectedSize ? this.state.selectedSize : 'Select a size'}>
          {sizes}
        </Select>
      </SelectWrapper>
    }

    if (this.state.selectedSku === null) {
      quantity =
        <Select name="quantity" onChange={this.selectQuantity} disabled>
          <option value='—'>—</option>
        </Select>;
    } else {
      let options = [];
      for (var i = 1; i <= this.state.maxQuantity; i++) {
        options.push(<option value={i} key={i}>{i}</option>)
      };
      quantity =
      <SelectWrapper>
        <Select data-testid="select-quantity" name="quantity" onChange={this.selectQuantity}>
          {options}
        </Select>
      </SelectWrapper>;
    }

    let addOutfitButton = this.state.addedOutfit ? (
      <IconButton
        addedOutfit={this.state.addedOutfit}
        onClick={()=>{this.setState({addedOutfit: false}, ()=>{removeOutfit(JSON.parse(productId));});}}
        onKeyPress={()=>{if(event.key==="Enter") {this.setState({addedOutfit: false}, ()=>{removeOutfit(JSON.parse(productId));});}}}
        tabIndex="0"
      >
        <MdStar/>
      </IconButton>
    ) : (
      <IconButton
        addedOutfit={this.state.addedOutfit}
        onClick={()=>{this.setState({addedOutfit: true}, ()=>{addOutfit();});}}
        onKeyPress={()=>{if(event.key==="Enter") {this.setState({addedOutfit: true}, ()=>{addOutfit();});}}}
        tabIndex="0"
      >
        <MdStarOutline/>
      </IconButton>
    )
    return (
      <form onSubmit={this.handleSubmit}>
        {size}
        {quantity}
        {addToCart}
        <FlexRow>
          {Object.keys(skus).length > 0 && !skus['null'] && <InputButton type="submit" value="ADD TO BAG" />}
          {addOutfitButton}
        </FlexRow>
      </form>
    );
  }
}