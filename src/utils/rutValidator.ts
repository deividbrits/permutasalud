export const validateRut = (rut: string): boolean => {
  if (!/^[0-9]+-[0-9kK]{1}$/.test(rut)) return false;
  
  let [numero, dv] = rut.split('-');
  let M = 0, S = 1;
  let num = parseInt(numero, 10);
  for (; num; num = Math.floor(num / 10)) {
    S = (S + (num % 10) * (9 - (M++ % 6))) % 11;
  }
  const dvCalculado = S ? (S - 1).toString() : 'k';
  return dv.toLowerCase() === dvCalculado.toLowerCase();
};

export const formatRut = (rut: string): string => {
  let value = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (value.length > 1) {
    value = `${value.slice(0, -1)}-${value.slice(-1)}`;
  }
  return value;
};
