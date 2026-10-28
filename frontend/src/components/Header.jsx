// Barra superior con el nombre del cliente y pestañas para cambiar de ejercicio.
import { Navbar, NavbarBrand, Nav, NavItem, NavLink, Container } from 'reactstrap';

function Header({ pestanaActiva, onCambiarPestana, pestanas }) {
  const opciones = [
    { id: pestanas.PESTANA_JUEGO, texto: 'Adivina el Número' },
    { id: pestanas.PESTANA_RESERVAS, texto: 'Reservas Food DEI' },
  ];

  return (
    <Navbar color="dark" dark expand="xs">
      <Container className="d-flex flex-wrap gap-2">
        <NavbarBrand href="#" onClick={(e) => e.preventDefault()} className="fw-bold">
          Food DEI S.A. de R.L.
        </NavbarBrand>

        <Nav pills className="ms-auto">
          {opciones.map((opcion) => (
            <NavItem key={opcion.id}>
              <NavLink
                href="#"
                active={pestanaActiva === opcion.id}
                className={pestanaActiva === opcion.id ? '' : 'text-light'}
                aria-current={pestanaActiva === opcion.id ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onCambiarPestana(opcion.id);
                }}
              >
                {opcion.texto}
              </NavLink>
            </NavItem>
          ))}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
