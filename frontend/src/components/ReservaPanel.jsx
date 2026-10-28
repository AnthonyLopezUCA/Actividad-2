// "Tu Bandeja de Reserva": lista de platos reservados con botones -, + y Quitar.
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ListGroup,
  ListGroupItem,
  ButtonGroup,
  Button,
  Spinner,
  Alert,
} from 'reactstrap';

function ReservaPanel({ menu, reserva, cargando, exito, onCambiarCantidad, onQuitar, onConfirmar }) {
  // Une cada item de la reserva con su plato del menú para mostrar nombre y precio.
  const items = reserva.itemsReservados
    .map((item) => {
      const plato = menu.find((p) => p.id === item.id);
      return plato ? { ...item, nombre: plato.nombre, precio: plato.precio, stock: plato.stock } : null;
    })
    .filter((item) => item !== null);

  const bandejaVacia = items.length === 0; // boolean

  return (
    <Card className="bandeja-sticky mb-3 shadow-sm" tag="aside" aria-labelledby="titulo-bandeja">
      <CardHeader className="d-flex align-items-center justify-content-between">
        <h2 id="titulo-bandeja" className="h5 mb-0">
          Tu Bandeja de Reserva
        </h2>
        {cargando && <Spinner size="sm" color="primary" aria-label="Cargando..." />}
      </CardHeader>

      {exito && (
        <Alert color="success" className="m-3 mb-0">
          {exito}
        </Alert>
      )}

      {bandejaVacia ? (
        <CardBody className="text-body-secondary">Aún no has añadido platos.</CardBody>
      ) : (
        <ListGroup flush>
          {items.map((item) => (
            <ListGroupItem key={item.id} className="d-flex align-items-center justify-content-between gap-2">
              <div className="me-auto">
                <div className="fw-semibold">{item.nombre}</div>
                <small className="text-body-secondary">
                  {item.cantidad} × ${item.precio.toFixed(2)} = ${(item.cantidad * item.precio).toFixed(2)}
                </small>
              </div>

              <ButtonGroup size="sm" aria-label={`Porciones de ${item.nombre}`}>
                <Button
                  color="outline-secondary"
                  disabled={cargando}
                  onClick={() => onCambiarCantidad(item.id, item.cantidad - 1)}
                  aria-label={`Quitar una porción de ${item.nombre}`}
                >
                  -
                </Button>
                <Button color="outline-secondary" disabled tabIndex={-1}>
                  {item.cantidad}
                </Button>
                <Button
                  color="outline-secondary"
                  disabled={cargando}
                  onClick={() => onCambiarCantidad(item.id, item.cantidad + 1)}
                  aria-label={`Añadir una porción de ${item.nombre}`}
                >
                  +
                </Button>
              </ButtonGroup>

              <Button color="danger" outline size="sm" disabled={cargando} onClick={() => onQuitar(item.id)}>
                Quitar
              </Button>
            </ListGroupItem>
          ))}
        </ListGroup>
      )}

      <CardFooter>
        <div className="d-flex justify-content-between fw-bold mb-2">
          <span>Total</span>
          <span>${reserva.total.toFixed(2)}</span>
        </div>
        {/* EXTRA: confirmar la reserva */}
        <Button color="success" className="w-100" disabled={cargando || bandejaVacia} onClick={onConfirmar}>
          {cargando ? (
            <>
              <Spinner size="sm" /> Cargando...
            </>
          ) : (
            'Confirmar reserva'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ReservaPanel;
