let monedas = 0;

export const addCoins = (cantidad) => {
  monedas += cantidad;
  console.log(`Se añadieron ${cantidad} monedas. Total: ${monedas}`);
};

export const getCoins = () => monedas;
