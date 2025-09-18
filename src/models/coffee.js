const generateId = () => Math.random().toString(36).substring(2, 11);

class Coffee {
  constructor({
    id = generateId(),
    name = '',
    origins = [],
    providerId = '',
    producer = '',
    farm = '',
    region = '',
    process = '',
    varietal = '',
    altitude = '',
    tastingNotes = '',
    isRoasted = false,
    purchasePrice = '',
  } = {}) {
    Object.assign(this, {
      id,
      name,
      origins,
      providerId,
      producer,
      farm,
      region,
      process,
      varietal,
      altitude,
      tastingNotes,
      isRoasted,
      purchasePrice,
    });
  }
}

export default Coffee;

