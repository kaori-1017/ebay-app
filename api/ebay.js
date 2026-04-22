export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { categoryId, period } = req.query;
  const appId = process.env.EBAY_APP_ID;

  const url = new URL('https://api.ebay.com/buy/browse/v1/item_summary/search');
  url.searchParams.set('category_ids', categoryId || '293');
  url.searchParams.set('filter', 'itemLocationCountry:JP,deliveryCountry:US,conditions:{USED|NEW}');
  url.searchParams.set('sort', 'newlyListed');
  url.searchParams.set('limit', '10');

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${appId}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  res.status(200).json(data);
}
