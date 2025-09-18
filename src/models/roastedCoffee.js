import Coffee from './coffee';

class RoastedCoffee extends Coffee {
  constructor({ id, roastLevel = '', loss = '', purchasePrice = '', ...rest } = {}) {
    super({ id, ...rest, isRoasted: true, purchasePrice });
    this.roastLevel = roastLevel;
    this.loss = loss;
  }
}

export default RoastedCoffee;

