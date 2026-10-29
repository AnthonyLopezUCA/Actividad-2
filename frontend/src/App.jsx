// Componente principal: guarda el estado global (useState) y hace la carga inicial (useEffect).
import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ErrorAlert from './components/ErrorAlert.jsx';
import SaldoPanel from './components/SaldoPanel.jsx';
import MenuGrid from './components/MenuGrid.jsx';
import ReservaPanel from './components/ReservaPanel.jsx';
import ExpiradaModal from './components/ExpiradaModal.jsx';
import AdivinaNumero from './components/AdivinaNumero.jsx';
import * as api from './services/api.js';

const PESTANA_JUEGO = 'juego';
const PESTANA_RESERVAS = 'reservas';

const RESERVA_VACIA = { saldo: 25, itemsReservados: [], total: 0 };

function App() {
  // ---------- Estado principal ----------
  const [pestana, setPestana] = useState(PESTANA_RESERVAS); // string
  const [menu, setMenu] = useState([]); // arreglo de platos
  const [reserva, setReserva] = useState(RESERVA_VACIA); // object
  const [segundosRestantes, setSegundosRestantes] = useState(null); // number | null
  const [cargando, setCargando] = useState(false); // boolean: hay una petición en curso
  const [cargaInicial, setCargaInicial] = useState(true); // boolean
  const [error, setError] = useState({ mensaje: '', clave: 0 }); // object
  const [mostrarExpirada, setMostrarExpirada] = useState(false); // boolean
  const [exito, setExito] = useState(''); // string: mensaje al confirmar

  // Muestra un error nuevo (la clave fuerza a que la alerta vuelva a aparecer).
  const mostrarError = (mensaje) => setError((previo) => ({ mensaje, clave: previo.clave + 1 }));

  // Guarda la reserva recibida del backend y sincroniza el temporizador.
  const aplicarReserva = (datos) => {
    setReserva({ saldo: datos.saldo, itemsReservados: datos.itemsReservados, total: datos.total });
    setSegundosRestantes(datos.segundosRestantes);
    if (datos.expirada) setMostrarExpirada(true);
  };

  // Pide menú y reserva al mismo tiempo (Promise.all) y actualiza el estado.
  const cargarDatos = async () => {
    try {
      const [datosMenu, datosReserva] = await Promise.all([api.obtenerMenu(), api.obtenerReserva()]);
      setMenu(datosMenu);
      aplicarReserva(datosReserva);
    } catch (err) {
      mostrarError(err.message);
    } finally {
      setCargaInicial(false);
    }
  };

  // Envoltorio para las acciones del carrito: activa "Cargando...", maneja errores y recarga datos.
  const ejecutarAccion = async (accion) => {
    setCargando(true);
    setExito('');
    try {
      const datos = await accion();
      aplicarReserva(datos);
      if (datos.mensaje) setExito(datos.mensaje);
      setMenu(await api.obtenerMenu());
    } catch (err) {
      // 409 = la reserva expiró en el backend.
      if (err.datos?.expirada) {
        aplicarReserva(err.datos);
        setMenu(await api.obtenerMenu().catch(() => menu));
      } else {
        mostrarError(err.message);
      }
    } finally {
      setCargando(false);
    }
  };

  // ---------- Acciones (endpoints 3, 4, 5 y EXTRA) ----------
  const handleAgregar = (id) => ejecutarAccion(() => api.agregarPlato(id, 1));
  const handleCambiarCantidad = (id, cantidad) => ejecutarAccion(() => api.actualizarPorciones(id, cantidad));
  const handleQuitar = (id) => ejecutarAccion(() => api.eliminarPlato(id));
  const handleConfirmar = () => ejecutarAccion(() => api.confirmarReserva());

  const handleNuevaReserva = async () => {
    setExito('');
    try {
      const datos = await api.iniciarNuevaReserva();
      aplicarReserva(datos);
      setMostrarExpirada(false);
      setMenu(await api.obtenerMenu());
    } catch (err) {
      mostrarError(err.message);
    }
  };

  // Carga inicial al montar el componente.
  useEffect(() => {
    cargarDatos();
  }, []);

  // Cuenta regresiva: resta 1 segundo cada segundo mientras haya tiempo.
  useEffect(() => {
    if (segundosRestantes === null) return undefined;

    // Al llegar a 0 se consulta al backend, que cierra la reserva y responde expirada: true.
    if (segundosRestantes <= 0) {
      cargarDatos();
      return undefined;
    }

    const intervalo = setInterval(() => {
      setSegundosRestantes((previo) => (previo === null ? null : Math.max(0, previo - 1)));
    }, 1000);

    // Se limpia el intervalo en cada cambio para no acumular temporizadores.
    return () => clearInterval(intervalo);
  }, [segundosRestantes]);

  return (
    <div className="app-wrapper">
      <Header pestanaActiva={pestana} onCambiarPestana={setPestana} pestanas={{ PESTANA_JUEGO, PESTANA_RESERVAS }} />

      <main className="app-main">
        {pestana === PESTANA_JUEGO ? (
          <AdivinaNumero />
        ) : (
          <>
            <SaldoPanel saldo={reserva.saldo} total={reserva.total} segundosRestantes={segundosRestantes} />

            <Container className="py-4">
              <ErrorAlert key={error.clave} mensaje={error.mensaje} />

              <Row>
                <Col xs="12" lg="8">
                  <MenuGrid menu={menu} cargando={cargando} cargaInicial={cargaInicial} onAgregar={handleAgregar} />
                </Col>
                <Col xs="12" lg="4">
                  <ReservaPanel
                    menu={menu}
                    reserva={reserva}
                    cargando={cargando}
                    exito={exito}
                    onCambiarCantidad={handleCambiarCantidad}
                    onQuitar={handleQuitar}
                    onConfirmar={handleConfirmar}
                  />
                </Col>
              </Row>
            </Container>

            <ExpiradaModal abierto={mostrarExpirada} onNuevaReserva={handleNuevaReserva} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
