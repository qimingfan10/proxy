// ‼️ 目标地址应该是你的服务器
// 注意：因为目标是 http，所以要写完整的 http://...
const TARGET_URL = "http://172.179.82.230:3000"; 

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  
  // 构造目标 URL，保留路径和查询参数
  const targetUrl = new URL(url.pathname + url.search, TARGET_URL);

  const headers = new Headers(req.headers);
  headers.set('host', targetUrl.host); // host 应该是 172.179.82.230:3000
  headers.delete('x-forwarded-for');
  
  const proxyReq = new Request(targetUrl, {
    method: req.method,
    headers: headers,
    body: req.body,
    redirect: 'manual',
  });

  return await fetch(proxyReq);
}