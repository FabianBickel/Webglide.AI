export default function checkForUndefined(...args) {
  args.forEach(arg => {
    if (arg === undefined) {
      throw new Error("Undefined argument");
    }
  });
}