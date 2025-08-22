import Coffee from './coffee';
import RoastedCoffee from './roastedCoffee';

const coffeeData = [
  new Coffee({
    name: 'Guatemala Huehuetenango',
    origins: ['Guatemala'],
    providerId: 'provider1',
    producer: 'Juan Perez',
    farm: 'Finca La Esperanza',
    region: 'Huehuetenango',
    process: 'Washed',
    varietal: 'Bourbon',
    altitude: '1800m',
    tastingNotes: 'Chocolate, Citrus',
    purchasePrice: '5.00',
  }),
  new RoastedCoffee({
    name: 'Ethiopia Yirgacheffe',
    origins: ['Ethiopia'],
    providerId: 'provider2',
    producer: 'Abebe',
    farm: 'Heirloom Farm',
    region: 'Yirgacheffe',
    process: 'Natural',
    varietal: 'Heirloom',
    altitude: '2000m',
    tastingNotes: 'Floral, Berry',
    roastLevel: 'Light',
    loss: '12',
    purchasePrice: '15.00',
  }),
];

export default coffeeData;
