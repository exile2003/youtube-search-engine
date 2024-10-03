import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';

export let openModalWindow = null;

function ModalWindow() {
  const [opened, { open, close }] = useDisclosure(false);
  openModalWindow = open;
  console.log("ModalWindow")

  return (
    <>
      <Modal opened={opened} onClose={close} title={<div><h2>База данных отсутствует</h2></div>} >
        Нажмите кнопку "Загрузить данные" и выберите предварительно скачанный с аккаунта YouTube файл с данными в формате html.
      </Modal>
    </>
  );
}

export { ModalWindow }