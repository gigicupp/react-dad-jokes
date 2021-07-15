import axios from 'axios';

async function fetchData(url) {
  let res = await axios.get(url, {
    headers : {Accept: 'application/json'}
  });
  return res.data;
}

export { fetchData } 