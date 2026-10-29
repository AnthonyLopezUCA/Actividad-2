// Modal que avisa que la reserva se cerró porque terminó el tiempo.
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

function ExpiradaModal({ abierto, onNuevaReserva }) {
  return (
    <Modal isOpen={abierto} centered backdrop="static" keyboard={false}>
      <ModalHeader>Tu reserva se cerró</ModalHeader>
      <ModalBody>
        El tiempo límite de 5 minutos terminó. Los platos se devolvieron al menú para que otras personas puedan
        reservarlos. Puedes iniciar una nueva reserva cuando quieras.
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onNuevaReserva}>
          Iniciar nueva reserva
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ExpiradaModal;