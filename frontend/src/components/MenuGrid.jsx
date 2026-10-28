// Cuadrícula del "Menú del Día": recorre el arreglo de platos con map.
import { Row, Col, Spinner } from 'reactstrap';
import PlatoCard from './PlatoCard.jsx';

function MenuGrid({ menu, cargando, cargaInicial, onAgregar }) {
  return (
    <section aria-labelledby="titulo-menu">
      <div className="d-flex align-items-center gap-2 mb-3">
        <h2 id="titulo-menu" className="h4 mb-0">
          Menú del Día
        </h2>
        {cargando && <Spinner size="sm" color="primary" aria-label="Cargando..." />}
      </div>

      {cargaInicial ? (
        <div className="d-flex align-items-center gap-2 text-body-secondary">
          <Spinner size="sm" /> Cargando...
        </div>
      ) : (
        <Row>
          {menu.map((plato) => (
            <Col xs="12" md="4" key={plato.id}>
              <PlatoCard plato={plato} cargando={cargando} onAgregar={onAgregar} />
            </Col>
          ))}
        </Row>
      )}
    </section>
  );
}

export default MenuGrid;
