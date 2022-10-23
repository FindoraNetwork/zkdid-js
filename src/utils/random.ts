export const randomNumber = (from = 0, to = 100) => {
  return Math.floor(Math.random() * (to - from) + from);
}
