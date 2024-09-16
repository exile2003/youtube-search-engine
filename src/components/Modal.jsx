import React, { useEffect, useRef } from 'react';
import M from 'materialize-css';
import {createPortal} from 'react-dom';
//import 'materialize-css/dist/css/materialize.min.css';
//import 'materialize-css/dist/js/materialize.min.js';
// import './Modal.css';

//import styles from './Modal.module.css';

const portal = document.getElementById('portal');

export let modalRef;

const Modal = () => {
    modalRef = useRef(null);

  useEffect(() => {
    // Инициализация модального окна при монтировании компонента
    M.Modal.init(modalRef.current);
  }, []);

 const openModal = () => {
    const instance = M.Modal.getInstance(modalRef.current);
    instance.open(); // Открытие модального окна
  };

  return (
    <div>
      {/* Кнопка для вызова функции открытия модального окна */}
      {/* <button className="waves-effect waves-light btn" onClick={openModal}>
        Open Modal Programmatically
      </button> */}
     
      {/* Структура модального окна */}
      <div ref={modalRef} className="modal"> 
        <div className="modal-content">
          <h4>Modal Header</h4>
          <p>This is a Materialize modal triggered by a function in a React component.</p>
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export { Modal }
