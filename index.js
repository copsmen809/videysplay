export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const hostname = url.hostname;

    // 1. Logic untuk menangkap ID video (format: /ID.mp4)
    const match = path.match(/\/([^\/]+)\.mp4$/);

    if (match) {
      const videoId = match[1];
      
      // Secara default kita arahkan ke server utama Videy
      let destinationUrl = `https://cdn.videy.co/${videoId}.mp4`;

      // Opsional: Jika kamu ingin spesifik cdn2 di domainmu melempar ke cdn2 videy juga
      if (hostname === "cdn2.vid7me.com") {
        destinationUrl = `https://cdn2.videy.co/${videoId}.mp4`;
      }

      // Langsung redirect 302 agar browser/player langsung memutar video aslinya
      return Response.redirect(destinationUrl, 302);
    }

    // 2. Halaman depan/test untuk memastikan semua domain aktif
    return new Response(`[OK] Server ${hostname} Siap Tempur!\nFormat Link: ${hostname}/ID.mp4`, {
      headers: { "content-type": "text/plain" }
    });
  }
};
