let count = 1;
export const getRandomAddress = () => `0x${[Date.now(), ++count, Math.random()].map((v) => v.toString(16)).join('')}`.replace(/0\./, '');
