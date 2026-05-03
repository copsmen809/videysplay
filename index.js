export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Log sederhana untuk memastikan worker jalan (bisa dilihat di dashboard Cloudflare)
    console.log(`Request masuk ke: ${url.hostname}${path}`);

    // Kita buat logic yang lebih luas: cari ID video di dalam path
    // Contoh: /abcdefg.mp4 atau /v/abcdefg.mp4
    const match = path.match(/\/([^\/]+)\.mp4$/);

    if (match) {
      const videoId = match[1];
      const videyUrl = `https://cdn.videy.co/${videoId}.mp4`;

      const cache = caches.default;
      let response = await cache.match(request);

      if (!response) {
        try {
          response = await fetch(videyUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Referer": "https://videy.co/"
            }
          });

          // Jika Videy kasih error (misal 404), jangan di-cache
          if (!response.ok) {
            return new Response(`Video tidak ditemukan di Videy (Status: ${response.status})`, { status: response.status });
          }

          // Bungkus ulang respon agar bisa dimodifikasi
          response = new Response(response.body, response);
          response.headers.set("Cache-Control", "public, max-age=604800");
          response.headers.set("Access-Control-Allow-Origin", "*");
          response.headers.set("X-CDN-Node", url.hostname); // Penanda server mana yang jawab

          ctx.waitUntil(cache.put(request, response.clone()));
        } catch (err) {
          return new Response("Gagal mengambil video dari sumber.", { status: 500 });
        }
      }

      return response;
    }

    // Jika buka halaman utama cdn/cdn2 tanpa link video
    return new Response(`Sistem Aktif di ${url.hostname}. Format: ${url.hostname}/ID.mp4`, {
      headers: { "content-type": "text/plain" }
    });
  }
};

