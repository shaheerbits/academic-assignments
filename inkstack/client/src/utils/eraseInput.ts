const eraseInput = (...fields: Array<(value: string) => void>) => {
  fields.forEach((field) => field(""));
};

export default eraseInput;