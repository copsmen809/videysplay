export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Menangkap ID video dari format /ID.mp4
    const match = path.match(/\/([^\/]+)\.mp4$/);

    if (match) {
      const videoId = match[1];
      // Gunakan link original Videy
      const originalUrl = `https://videy.co/v/?id=${videoId}`;
      
      // Ambil file videonya langsung (Proxying)
      const videoResponse = await fetch(`https://cdn.videy.co/${videoId}.mp4`);

      // Buat response baru dengan header agar bisa di-embed di X/Twitter
      const response = new Response(videoResponse.body, videoResponse);
      response.headers.set("Access-Control-Allow-Origin", "*");
      response.headers.set("Content-Type", "video/mp4");
      response.headers.set("Content-Disposition", "inline");

      return response;
    }

    return new Response("Server Aktif - vid7me.com", { status: 200 });
  }
};
