// Ejercicio 1: "Adivina el Número" (1 a 100).
import { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  ListGroup,
  ListGroupItem,
  Badge,
  Spinner,
} from 'reactstrap';
import ErrorAlert from './ErrorAlert.jsx';
import { enviarIntento, reiniciarJuego } from '../services/api.js';

// Color de la pista según el resultado del servidor.
const COLOR_PISTA = { mayor: 'info', menor: 'warning', correcto: 'success' };

function AdivinaNumero() {
  const [numero, setNumero] = useState(''); // string: valor del input
  const [intentosFallidos, setIntentosFallidos] = useState(0); // number
  const [mensaje, setMensaje] = useState(''); // string: mensaje del servidor
  const [gano, setGano] = useState(false); // boolean
  const [historial, setHistorial] = useState([]); // arreglo de { numero, resultado, mensaje }
  const [cargando, setCargando] = useState(false); // boolean
  const [error, setError] = useState({ mensaje: '', clave: 0 });

  const mostrarError = (texto) => setError((previo) => ({ mensaje: texto, clave: previo.clave + 1 }));

  const handleIntentar = async (evento) => {
    evento.preventDefault();
    const valor = Number(numero);

    if (!Number.isInteger(valor) || valor < 1 || valor > 100) {
      mostrarError('Escribe un número entero entre 1 y 100');
      return;
    }

    setCargando(true);
    try {
      const respuesta = await enviarIntento(valor);
      setMensaje(respuesta.mensaje);
      setHistorial((previo) => [...previo, { numero: valor, resultado: respuesta.resultado, mensaje: respuesta.mensaje }]);

      if (respuesta.resultado === 'correcto') {
        setGano(true);
      } else {
        setIntentosFallidos((previo) => previo + 1);
      }
      setNumero('');
    } catch (err) {
      mostrarError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleNuevoJuego = async () => {
    setCargando(true);
    try {
      const respuesta = await reiniciarJuego();
      setNumero('');
      setIntentosFallidos(0);
      setGano(false);
      setHistorial([]);
      setMensaje(respuesta.mensaje);
    } catch (err) {
      mostrarError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs="12" md="8" lg="6">
          <h1 className="h3 mb-1">Adivina el Número</h1>
          <p className="text-body-secondary">El servidor pensó un número entre 1 y 100. ¿Puedes adivinarlo?</p>

          <ErrorAlert key={error.clave} mensaje={error.mensaje} />

          <Card className="mb-3 shadow-sm">
            <CardBody>
              <Form onSubmit={handleIntentar}>
                <FormGroup>
                  <Label for="numero">Tu número</Label>
                  <Input
                    id="numero"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="1 - 100"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    disabled={gano || cargando}
                  />
                </FormGroup>

                <div className="d-flex gap-2">
                  <Button type="submit" color="primary" disabled={gano || cargando || numero === ''}>
                    {cargando ? <Spinner size="sm" /> : 'Intentar'}
                  </Button>
                  <Button type="button" color="secondary" outline onClick={handleNuevoJuego} disabled={cargando}>
                    Nuevo juego
                  </Button>
                  <Badge color="dark" pill className="ms-auto align-self-center">
                    Intentos fallidos: {intentosFallidos}
                  </Badge>
                </div>
              </Form>
            </CardBody>
          </Card>

          {mensaje && (
            <Alert color={gano ? 'success' : 'info'} aria-live="polite">
              {gano ? `¡Ganaste! ${mensaje} Lo lograste con ${intentosFallidos} intento(s) fallido(s).` : mensaje}
            </Alert>
          )}

          <h2 className="h5">Historial de intentos</h2>
          {historial.length === 0 ? (
            <p className="text-body-secondary">Todavía no hay intentos.</p>
          ) : (
            <ListGroup numbered>
              {historial.map((intento, indice) => (
                <ListGroupItem key={indice} className="d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">{intento.numero}</span>
                  <Badge color={COLOR_PISTA[intento.resultado]}>{intento.mensaje}</Badge>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default AdivinaNumero;
