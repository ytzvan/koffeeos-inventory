import Coffee from './coffee';

class RoastedCoffee extends Coffee {
  constructor({ roastLevel = '', loss = '', purchasePrice = '', ...rest } = {}) {
    super({ ...rest, isRoasted: true, purchasePrice });
    this.roastLevel = roastLevel;
    this.loss = loss;
  }
}

export default RoastedCoffee;

