const CACHE = new Map();

async function processFetch (url) {
  const resp = await fetch(url);

  if (resp.status < 200 || resp.status > 299) {
    throw new Error(resp.statusText);
  }

  return resp.json();
}

export const fetchFeatures = url => {
  if (!CACHE.has(url)) {
    CACHE.set(url, processFetch(url));
  }

  return CACHE.get(url);
};

export const clear = () => CACHE.clear();

export default fetchFeatures;
