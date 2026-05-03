export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\//, ""); // Menghilangkan "/" di depan

    // Cek jika request berakhiran .mp4
    if (path.endsWith(".mp4")) {
      // Ambil ID videonya saja (menghilangkan .mp4)
      const videoId = path.replace(".mp4", "");

      // Link CDN asli Videy (Biasanya formatnya seperti ini)
      // Catatan: Jika Videy mengubah strukturnya, bagian ini perlu disesuaikan
      const videyUrl = `https://cdn.videy.co/${videoId}.mp4`;

      // Ambil video dari Videy
      const response = await fetch(videyUrl, {
        headers: {
          "User-Agent": request.headers.get("User-Agent"),
        }
      });

      // Kembalikan video ke user seolah-olah dari domain vid7me.com
      const newResponse = new Response(response.body, response);
      newResponse.headers.set("Access-Control-Allow-Origin", "*");
      return newResponse;
    }

    return new Response("Gunakan format: vid7me.com/ID_VIDEO.mp4", { status: 200 });
  }
};
