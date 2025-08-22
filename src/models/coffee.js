class Coffee {
  constructor({
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

