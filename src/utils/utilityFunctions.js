import moment from 'moment';

export const parseYouTubeFile = (fileContent) => {
    // Parsing the content of the input file and assign result to domTree variable
    const domTree = new DOMParser().parseFromString(fileContent, 'text/html');

    // Pass the content of 'content-cell' and 'mdl-cell--6-col' classes to array allSelectors
    const allSelectors = domTree.querySelectorAll('.content-cell.mdl-cell--6-col');

    // Form the array with youtube videos data
    return Array.from(allSelectors).map((item) => ({
        title: item.children[0]?.textContent || '',
        titleLink: item.children[0]?.href || '',
        channel: item.children[2]?.textContent || '',
        channelLink: item.children[2]?.href || '',
        date: item.lastChild?.textContent || '',
    })).filter(item => item.title !== '');
}

export const filterYoutubeDB = (
    youtubeDB,
    filters
  ) => {

    if (/^[0-9].*$/.test(youtubeDB[0]?.date)) {
      moment.locale('ru');
    } else moment.locale('en');

    const dateFormat = moment.locale() === 'ru' 
      ? 'DD MMMM YYYY, HH:mm:ss' 
      : 'MMMM DD YYYY, HH:mm:ss';
      
  return youtubeDB
    .filter((item) => item?.title?.toLowerCase().includes(filters.title.trim().toLowerCase()))
    .filter((item) => item?.channel?.toLowerCase().includes(filters.channel.trim().toLowerCase()))
    .filter((item) => 
      item.date && moment(item?.date, dateFormat).isBetween(filters.dateFrom, moment(filters.dateTo).endOf('day'))
    )
}

export const removeDuplicates = (items) => {
    const uniqueItems = {};

    items.forEach((item) => {
      if (!uniqueItems[item.title] || uniqueItems[item.title].date > item.date) {
        uniqueItems[item.title] = item;
      }
    });
    return Object.values(uniqueItems);
  }