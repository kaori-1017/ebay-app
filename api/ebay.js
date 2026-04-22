export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { categoryId } = req.query;
  const appId = process.env.EBAY_APP_ID;
  const certId = process.env.EBAY_CERT_ID;

  // Base64エンコード（BufferなしのWeb標準API版）
  const credentials = btoa(`${appId}:${certId}`);

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
  url.searchParams.set('category_ids', categoryId || '293');
  url.searchParams.set('filter', 'itemLocationCountry:JP,deliveryCountry:US');
  url.searchParams.set('sort', 'newlyListed');
  url.searchParams.set('limit', '10');

  const searchRes = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
    }
  });

  const data = await searchRes.json();
  res.status(200).json(data);
}
