export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 1. Ambil path lengkap (misal: /kodeunik.mp4) dari request yang masuk
    const path = url.pathname;
    const searchParams = url.search; // Mengambil query string jika ada (?start=... dll)

    // 2. Susun URL tujuan baru langsung ke target Slicedrive menggunakan path yang sama
    const targetUrl = `https://cdn2.slicedrive.com${path}${searchParams}`;

    // 3. Buat request baru untuk menembak ke cdn2.slicedrive.com
    const modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow' // Mengikuti jika dari sisi Slicedrive ada redirect internal
    });

    try {
      // 4. Ambil data video/file dari Slicedrive
      const response = await fetch(modifiedRequest);

      // 5. Salin response untuk dikirim kembali ke pengunjung
      const newResponse = new Response(response.body, response);
      
      // 6. Tambahkan atau perbarui header CORS agar video lancar saat di-embed/di-play
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', '*');
      
      return newResponse;
    } catch (error) {
      return new Response('Error fetching video from storage source.', { status: 500 });
    }
  },
};
