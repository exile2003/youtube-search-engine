import { useRef } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';

export let modalRef;
export let openModalWindow;

function Demo() {
  const [opened, { open, close }] = useDisclosure(false);
  modalRef = useRef(null);
  openModalWindow = () => open()

  

  return (
    <>
      <Modal ref={modalRef} opened={opened} onClose={close} title="Authentication">
        {/* Modal content */}
      </Modal>

      {/* <Button onClick={open}>Open modal</Button> */}
    </>
  );
}

export {Demo}