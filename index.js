export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\//, "");
    const hostname = url.hostname; // Ini akan mengambil 'cdn.vid7me.com' atau 'cdn2.vid7me.com'

    if (path.endsWith(".mp4")) {
      const videoId = path.replace(".mp4", "");
      const videyUrl = `https://cdn.videy.co/${videoId}.mp4`;

      const cache = caches.default;
      let response = await cache.match(request);

      if (!response) {
        response = await fetch(videyUrl, {
          headers: {
            "User-Agent": request.headers.get("User-Agent"),
          }
        });

        response = new Response(response.body, response);
        response.headers.set("Cache-Control", "public, max-age=604800");
        response.headers.set("Access-Control-Allow-Origin", "*");
        
        // Menambahkan header kustom untuk tanda CDN mana yang melayani
        response.headers.set("X-Served-By", hostname);

        ctx.waitUntil(cache.put(request, response.clone()));
      }

      return response;
    }

    return new Response(`Server ${hostname} Aktif. Gunakan format: ${hostname}/ID.mp4`, {
      headers: { "content-type": "text/plain" }
    });
  }
};
