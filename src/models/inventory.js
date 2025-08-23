class Inventory {
  constructor({ green = {}, roasted = {}, consumables = {} } = {}) {
    this.green = green; // {coffeeId: quantityKg}
    this.roasted = roasted; // {coffeeId: quantityKg}
    this.consumables = consumables; // {itemId: quantity}
  }
}

export default new Inventory();
