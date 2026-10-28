// Panel superior fijo: saldo disponible, total de la reserva y tiempo restante.
import { Alert, Badge, Container } from 'reactstrap';

// Convierte segundos a formato mm:ss (ej. 125 → "02:05").
const formatearTiempo = (segundos) => {
  const minutos = String(Math.floor(segundos / 60)).padStart(2, '0');
  const resto = String(segundos % 60).padStart(2, '0');
  return `${minutos}:${resto}`;
};

function SaldoPanel({ saldo, total, segundosRestantes }) {
  const hayTemporizador = segundosRestantes !== null;
  const pocoTiempo = hayTemporizador && segundosRestantes <= 60;

  return (
    <Alert color="info" className="panel-saldo rounded-0 mb-0 border-0 border-bottom shadow-sm">
      <Container className="d-flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="fw-semibold">Tu saldo actual: ${saldo.toFixed(2)}</span>

        <Badge color="dark" pill className="fs-6">
          Total de tu Reserva: ${total.toFixed(2)}
        </Badge>

        <span aria-live="polite">
          {hayTemporizador ? (
            <>
              Tiempo restante:{' '}
              <Badge color={pocoTiempo ? 'danger' : 'primary'} className="temporizador fs-6">
                {formatearTiempo(segundosRestantes)}
              </Badge>
            </>
          ) : (
            <small className="text-body-secondary">El tiempo (5 min) inicia al añadir tu primer plato</small>
          )}
        </span>
      </Container>
    </Alert>
  );
}

export default SaldoPanel;
