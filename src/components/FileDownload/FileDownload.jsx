import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './FileDownload.module.scss';

function FileDownload({ onFileDownload, ref }) {
    const { t } = useTranslation();

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) onFileDownload(file);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          // Perform the click action if the Enter key is pressed
          ref.current.click();
        }
    };

  return (
    <div className={styles.header}>         
        <input type="file" id="chooseFile" className={styles.chooseFile} onChange={handleFileChange} ref={ref} />
        <label   htmlFor="chooseFile" className={styles.custom_file_download} onKeyDown={handleKeyDown} ref={ref} tabIndex="0">
            {t('Download data')}
        </label>
    </div>
  )
}

export default FileDownload