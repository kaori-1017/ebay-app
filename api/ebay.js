export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { categoryId, period, sortOrder } = req.query;
  const appId = process.env.EBAY_APP_ID;

  const daysAgo = new Date(Date.now() - period * 86400000).toISOString();

  const url = new URL('https://svcs.ebay.com/services/search/FindingService/v1');
  url.searchParams.set('OPERATION-NAME', 'findCompletedItems');
  url.searchParams.set('SERVICE-VERSION', '1.0.3');
  url.searchParams.set('SECURITY-APPNAME', appId);
  url.searchParams.set('RESPONSE-DATA-FORMAT', 'JSON');
  url.searchParams.set('categoryId', categoryId || '293');
  url.searchParams.set('sortOrder', sortOrder || 'BestMatch');
  url.searchParams.set('paginationInput.entriesPerPage', '10');
  url.searchParams.set('itemFilter(0).name', 'LocatedIn');
  url.searchParams.set('itemFilter(0).value', 'JP');
  url.searchParams.set('itemFilter(1).name', 'SoldItemsOnly');
  url.searchParams.set('itemFilter(1).value', 'true');
  url.searchParams.set('itemFilter(2).name', 'EndTimeFrom');
  url.searchParams.set('itemFilter(2).value', daysAgo);

  const response = await fetch(url.toString());
  const data = await response.json();

  res.status(200).json(data);
}