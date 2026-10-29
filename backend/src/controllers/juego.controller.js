// Controlador del Ejercicio 1: "Adivina el Número".

// Genera un número entero aleatorio entre 1 y 100.
const generarNumero = () => Math.floor(Math.random() * 100) + 1;

// Número secreto guardado en el servidor (se genera al iniciar).
let numeroSecreto = generarNumero();

// POST /api/juego/guess  → body { numero }
export const adivinar = (req, res) => {
  const numero = Number((req.body ?? {}).numero);

  // Validación: debe ser un entero entre 1 y 100.
  if (!Number.isInteger(numero) || numero < 1 || numero > 100) {
    return res.status(400).json({ mensaje: 'Debes enviar un número entero entre 1 y 100' });
  }

  if (numero === numeroSecreto) {
    return res.json({ resultado: 'correcto', mensaje: `¡Correcto! El número era ${numeroSecreto}.` });
  }

  // "mayor" significa que el número oculto es MAYOR al intentado.
  if (numeroSecreto > numero) {
    return res.json({ resultado: 'mayor', mensaje: `El número secreto es mayor que ${numero}.` });
  }

  return res.json({ resultado: 'menor', mensaje: `El número secreto es menor que ${numero}.` });
};

// POST /api/juego/reset  → genera un nuevo número secreto.
export const reiniciar = (req, res) => {
  numeroSecreto = generarNumero();
  res.json({ mensaje: 'Nuevo juego iniciado. Adivina un número entre 1 y 100.' });
};
