import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';

export let openModalWindow;

function ModalWindow() {
  const [opened, { open, close }] = useDisclosure(false);
  openModalWindow = () => open()

  return (
    <>
      <Modal opened={opened} onClose={close} title="Authentication">
        {/* Modal content */}
      </Modal>
    </>
  );
}

export { ModalWindow }