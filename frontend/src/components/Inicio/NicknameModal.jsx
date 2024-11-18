import React, { useRef, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import "../../assets/NicknameModal.css";

const NicknameModal = ({ onAuthenticate, show, onHide }) => {
  const nicknameRef = useRef(null);
  const [nickname, setNickname] = useState('');

  const handleInvalid = (e, message) => {
    e.target.setCustomValidity(message);
  };

  const handleInputChange = (e) => {
    e.target.setCustomValidity("");
    setNickname(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Comprobamos si el nickname está vacío
    if (nickname.trim()) {
      localStorage.setItem("nickname", nickname);      // Guardamos el nickname en localStorage
      console.log('Nickname guardado:', nickname);     // Verifica que el nickname se guarda correctamente
      onAuthenticate(nickname);                        // Llama al método de autenticación con el nickname
      onHide();                                        // Cierra el modal después de la autenticación
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>Ingresa tu Nickname</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nickname">
            <Form.Control
              ref={nicknameRef}
              type="text"
              placeholder="Nickname"
              value={nickname}
              required
              onInvalid={(e) => handleInvalid(e, "Por favor, ingresa tu nickname")}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Aceptar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NicknameModal;
