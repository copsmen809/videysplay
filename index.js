export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Jika mengakses halaman utama (https://cdn2.slirpdrive.com/)
    if (pathname === '/' || pathname === '') {
      return new Response('cdn2.vid7me.com - CDN Mirror Service is Active.', {
        status: 200,
        headers: { 'content-type': 'text/plain' }
      });
    }

    // Ambil nama file beserta ekstensinya (menghilangkan tanda "/" di depan)
    // Contoh: "/16fca76a2.mp4" menjadi "16fca76a2.mp4"
    const fileName = pathname.substring(1);

    // Gabungkan ke format default aceimg.com dengan parameter ?f=
    // Hasil: https://aceimg.com/upload/?f=16fca76a2.mp4
    const targetUrl = `https://aceimg.com/upload/?f=${fileName}`;

    // Lakukan redirect 302 ke halaman default aceimg
    return Response.redirect(targetUrl, 302);
  },
};
