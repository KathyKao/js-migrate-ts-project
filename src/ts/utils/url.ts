const getParams = () => {
  const params = new URLSearchParams(window.location.search);
  return params;
};

const queryParse = (query: string) => {
  const queryKey = query.split('=')[0];
  if (window.location.search === '') {
    return `?${query}`;
  }
  if (window.location.search.includes(queryKey)) {
    const params = getParams().get(queryKey);
    return window.location.search.replace(`${queryKey}=${params}`, query);
  }
  return `${window.location.search}&${query}`;
};

const parseFindNewQuery = (params: string, fist: number) => {
  const { search } = window.location;
  const query = getParams().get(params);
  const qParse = queryParse(`${params}=${query}`);
  let newQuery = '';
  if (search[fist - 1] === '&') {
    newQuery = qParse.replace(`${search[fist - 1]}${params}=${query}`, '');
  }
  if (search[fist - 1] === '?') {
    const str = !search.includes('&') ? `?${params}=${query}` : `${params}=${query}&`;
    newQuery = qParse.replace(str, '');
  }
  return newQuery;
};

// 添加 query 參數 push
const routerQueryPush = (params: string) => {
  const { pathname } = window.location;
  const query = queryParse(params);
  window.history.pushState({}, '', `${pathname}${query}`);
};

// 添加 query 參數 replace
const routerQueryReplace = (params: string) => {
  const { pathname } = window.location;
  const query = queryParse(params);
  window.history.replaceState({}, '', `${pathname}${query}`);
};

// 刪除 query 參數 push
const routerQueryRemove = (params: string) => {
  const { search } = window.location;
  const fist = search.indexOf(params);
  if (['?', '&'].includes(search[fist - 1])) {
    const newQuery = parseFindNewQuery(params, fist);
    const { pathname } = window.location;
    window.history.pushState({}, '', `${pathname}${newQuery}`);
  }
};

// 刪除 query 參數 replace
const routerQueryReplaceRemove = (params: string) => {
  const { search } = window.location;
  const fist = search.indexOf(params);
  if (['?', '&'].includes(search[fist - 1])) {
    const newQuery = parseFindNewQuery(params, fist);
    const { pathname } = window.location;
    window.history.replaceState({}, '', `${pathname}${newQuery}`);
  }
};

export { routerQueryPush, routerQueryReplace, routerQueryRemove, routerQueryReplaceRemove, getParams };
