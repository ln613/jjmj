export const tap = (f, ...a) => e => {
  e.preventDefault();
  f.apply(null, a);
}
