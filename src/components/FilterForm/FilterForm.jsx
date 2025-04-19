import React, {useRef} from 'react';
import styles from './FilterForm.module.scss';
import { useTranslation } from 'react-i18next';

function FilterForm({ filters, setFilters, onFilter, itemsNumber, refInput, refButton }) {
    const { t } = useTranslation();

    //const searchButtonRef = useRef(null);
    //const titleInputRef = useRef(null);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const resetDates = () => {
        setFilters((prev) => ({
            ...prev,
            dateFrom: '2017-01-01',
            dateTo: new Date().toISOString().split('T')[0],
        }));
    };

  return (
    <form onSubmit={(e) => e.preventDefault()} className={styles.form}>

    <label htmlFor={styles.name} className={styles.name}>
      {t('Video title:')}
&nbsp;&nbsp;
    </label>
    <input type="text" name="title" ref={refInput} value={filters.title} id={styles.name} onChange={handleChange} />

    <label htmlFor={styles.channel} className={styles.channel}>
      {t('Channel title:')}
&nbsp;&nbsp;
    </label>
    <input type="text" name="channel" value={filters.channel} id={styles.channel} onChange={handleChange} />

    <label htmlFor={styles.dateFrom} className={styles.dateFrom}>
      <div id={styles.data}>{t('Date: ')}</div>
      <div id={styles.from}>{t('from')}</div>
    </label>
    <input type="date" name="dateFrom" value={filters.dateFrom} id={styles.dateFrom} onChange={handleChange} />

    <label htmlFor={styles.dateTo} className={styles.dateTo}>{t('to')}</label>
    <input type="date" name="dateTo" value={filters.dateTo} id={styles.dateTo} onChange={handleChange} />
    <button className={styles.resetDate} onClick={resetDates} type="button">{t('Dates reset')}</button>
    <label htmlFor="checkbox">{t('Eliminate repetitions')}</label>
    <input type="checkbox" name="unique" id="checkbox" className={styles.checkbox} checked={filters.unique} onChange={handleChange} />
    <button type="button" onClick={onFilter} ref={refButton}>{t('Search')}</button>

    <div className={styles.itemsNumber}>
      { itemsNumber ? (
        <div>
          {t('Number of found videos: ')}
          {itemsNumber}
        </div>
      ) : ''}
    </div>
  </form>
  )
}

export default FilterForm