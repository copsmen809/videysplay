export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Menangkap ID video (contoh: vid7me.com/tfKo52ZY1.mp4)
    const match = path.match(/\/([^\/]+)\.mp4$/);

    if (match) {
      const videoId = match[1];
      
      // Ambil video dari CDN Slicedrive menggunakan ID yang sama dengan Videy
      const targetUrl = `https://cdn2.slicedrive.com/${videoId}.mp4`;

      const videoResponse = await fetch(targetUrl);

      // Bungkus lagi biar X/Twitter melihat ini murni dari domain kamu
      const response = new Response(videoResponse.body, videoResponse);
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Content-Type", "video/mp4");
      response.headers.set("Content-Disposition", "inline");

      return response;
    }

    return new Response(`Server Proxy Ready - ${hostname}`, { 
      status: 200,
      headers: { "content-type": "text/plain" }
    });
  }
};
