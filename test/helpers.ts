export const sleep = (delay: number) => {
  const second = 1000;
  return new Promise((resolve) => setTimeout(resolve, delay * second));
};
