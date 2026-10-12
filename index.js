export default {
  async fetch(request) {
    const url = new URL(request.url);
    const fileCode = url.pathname.substring(1);
    
    const targetUrl = `https://aceimg.com/upload/?f=${fileCode}`;

    return Response.redirect(targetUrl, 302);
  }
};
