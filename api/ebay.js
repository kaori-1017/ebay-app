module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { categoryId, keyword, minPrice, maxPrice, freeShipping } = req.query;
  const appId = process.env.EBAY_APP_ID;
  const certId = process.env.EBAY_CERT_ID;

  const credentials = Buffer.from(`${appId}:${certId}`).toString('base64');

  const tokenRes = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope'
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    res.status(401).json({ error: 'Token取得失敗', detail: tokenData });
    return;
  }

  const url = new URL('https://api.ebay.com/buy/browse/v1/item_summary/search');
  if (keyword) url.searchParams.set('q', keyword);
  if (categoryId) url.searchParams.set('category_ids', categoryId);

  const filters = ['itemLocationCountry:JP', 'deliveryCountry:US'];
  if (minPrice && maxPrice) filters.push(`price:[${minPrice}..${maxPrice}]`);
  else if (minPrice) filters.push(`price:[${minPrice}..]`);
  else if (maxPrice) filters.push(`price:[..${maxPrice}]`);
  if (freeShipping === 'true') filters.push('maxDeliveryCost:0');

  url.searchParams.set('filter', filters.join(','));
  url.searchParams.set('sort', 'newlyListed');
  url.searchParams.set('limit', '50');

  const searchRes = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
    }
  });

  const data = await searchRes.json();
  res.status(200).json(data);
}
