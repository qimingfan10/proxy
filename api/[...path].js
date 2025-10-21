// ‼️ 目标地址应该是你的服务器
const TARGET_URL = "http://172.179.82.230:3000";

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  
  // 构造目标 URL，保留路径和查询参数
  const targetUrl = new URL(url.pathname + url.search, TARGET_URL);

  const headers = new Headers(req.headers);
  headers.set('host', targetUrl.host);
  headers.delete('x-forwarded-for');
  
  const proxyReq = new Request(targetUrl, {
    method: req.method,
    headers: headers,
    body: req.body,
    redirect: 'manual',
  });
  
  // --- 新增的调试代码 ---
  try {
    // 正常转发
    return await fetch(proxyReq);

  } catch (err) {
    // 如果 fetch 失败 (例如防火墙导致连接超时或拒绝)
    // 我们返回一个 502 错误，并带上具体的失败原因
    console.error("Backend fetch error:", err.message);
    return new Response(
      JSON.stringify({
        error: "Bad Gateway",
        details: "The proxy server (Vercel) could not connect to the backend server (172.179.82.230).",
        backend_error: err.message // 这会显示 'connection refused', 'timed out' 等
      }),
      { 
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  // --- 调试代码结束 ---
}