export const _colors = ['#BEADFA', '#FDF0F0', '#BEFFF7', '#E5CFF7'];

// Generate random colors from array 
export const colors = () => {
  const num = Math.floor(Math.random() * 5);

  return _colors[num];
};