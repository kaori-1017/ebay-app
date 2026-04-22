export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const appId = process.env.EBAY_APP_ID;
  const certId = process.env.EBAY_CERT_ID;

  // 環境変数が正しく読めているか確認
  res.status(200).json({
    appId_length: appId ? appId.length : 'undefined',
    appId_start: appId ? appId.substring(0, 10) : 'undefined',
    certId_length: certId ? certId.length : 'undefined',
    certId_start: certId ? certId.substring(0, 10) : 'undefined',
  });
}
