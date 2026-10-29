// Muestra el mensaje de error del backend en una alerta que el usuario puede cerrar.
import { UncontrolledAlert } from 'reactstrap';

function ErrorAlert({ mensaje }) {
  // Si no hay mensaje no se dibuja nada.
  if (!mensaje) return null;

  return (
    <UncontrolledAlert color="warning" role="alert">
      <strong>Atención:</strong> {mensaje}
    </UncontrolledAlert>
  );
}

export default ErrorAlert;
