import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';

export let openModalWindow = null;

function ModalWindow() {
  const [opened, { open, close }] = useDisclosure(false);
  openModalWindow = open;

  return (
    <>
      <Modal opened={opened} onClose={close} title={<h3>База данных отсутствует</h3>}>
        Нажмите кнопку "Загрузить данные" и выберите предварительно скачанный с аккаунта YouTube файл с данными в формате html.
      </Modal>
    </>
  );
}

export { ModalWindow }