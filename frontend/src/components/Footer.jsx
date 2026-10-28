// Pie de página con la marca de la empresa desarrolladora.
function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-3 mt-4">
      <div className="container d-flex flex-wrap justify-content-between gap-2 small">
        <span>© {anio} Food DEI S.A. de R.L.</span>
        <span>
          Desarrollado por <strong>Macrowebs</strong>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
