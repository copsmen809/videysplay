export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Contoh: domainkamu.com/v1 -> diarahkan ke link Videy tertentu
    if (url.pathname === '/v1') {
      return Response.redirect('https://videy.co/v?id=ABCDEFG', 302);
    }

    // Jika ingin redirect otomatis berdasarkan ID: domainkamu.com/watch/ID
    if (url.pathname.startsWith('/watch/')) {
      const videoId = url.pathname.split('/')[2];
      return Response.redirect(`https://videy.co/v?id=${videoId}`, 302);
    }

    return new Response('Link tidak ditemukan', { status: 404 });
  },
};
