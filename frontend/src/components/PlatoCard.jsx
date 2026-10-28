// Tarjeta de un plato: nombre, categoría, precio, stock y botón para añadir.
import { Card, CardBody, CardTitle, CardSubtitle, CardText, Badge, Button } from 'reactstrap';

function PlatoCard({ plato, cargando, onAgregar }) {
  const agotado = plato.stock === 0; // boolean

  return (
    <Card className="mb-3 h-100 shadow-sm">
      <CardBody className="d-flex flex-column">
        <CardTitle tag="h3" className="h6">
          {plato.nombre}
        </CardTitle>
        <CardSubtitle tag="p" className="mb-2 text-body-secondary small">
          {plato.categoria}
        </CardSubtitle>

        <CardText className="d-flex justify-content-between align-items-center">
          <Badge color="success" className="fs-6">
            ${plato.precio.toFixed(2)}
          </Badge>
          <span className={`small ${plato.stock <= 3 ? 'text-danger fw-semibold' : 'text-body-secondary'}`}>
            Stock: {plato.stock}
          </span>
        </CardText>

        <div className="mt-auto">
          {agotado ? (
            <Button color="secondary" disabled className="w-100">
              Agotado
            </Button>
          ) : (
            <Button color="primary" className="w-100" disabled={cargando} onClick={() => onAgregar(plato.id)}>
              Añadir a la Reserva
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export default PlatoCard;
