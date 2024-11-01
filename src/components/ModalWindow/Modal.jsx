import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { useTranslation } from 'react-i18next';


export let openModalWindow = null;

function ModalWindow() {
  const { t } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  openModalWindow = open;
  console.log("ModalWindow", Modal)

  return (
    <>
      <Modal opened={opened} onClose={close} title={<div><h2>{t('No database available')}</h2></div>} >
      {t('Click the "Download data" button and select the html data file previously downloaded from your YouTube account.')}
      </Modal>
    </>
  );
}

export { ModalWindow }