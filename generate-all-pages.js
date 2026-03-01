// generate-all-pages.js - Auto-assembled
// Generates: 45 comparison pages, 10 alternatives pages, 1 hub page
const fs = require("fs");
const path = require("path");

const SITE_URL = "https://france-voyance-avenir.fr";
const dataRaw = fs.readFileSync(path.join(__dirname, "data", "platforms.json"), "utf8");
const data = JSON.parse(dataRaw);
const platforms = data.platforms;
const comparisons = data.comparisons;

function getPlatform(slug) { return platforms.find(p => p.slug === slug); }
function starsHTML(r) {
    let s = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(r)) s += '<i class="fas fa-star"></i>';
        else if (i - 0.5 <= r) s += '<i class="fas fa-star-half-alt"></i>';
        else s += '<i class="far fa-star"></i>';
    }
    return '<span class="star-rating">' + s + '</span>';
}
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; } return Math.abs(h); }
function pick(arr, seed) { return arr[hashStr(seed) % arr.length]; }
function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }
function cost20min(pm) { return (pm * 20).toFixed(2).replace(".", ","); }
function b64(s) { return Buffer.from(s).toString("base64"); }

const AVIS_INLINE_CSS = Buffer.from("PHN0eWxlPgogICAgLnJldmlldy10bGRye2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMUExQTRBIDAlLCMyRDFCNjkgMTAwJSk7Ym9yZGVyLWxlZnQ6NXB4IHNvbGlkICNENEFGMzc7cGFkZGluZzoyNXB4IDMwcHg7Ym9yZGVyLXJhZGl1czowIDEycHggMTJweCAwO21hcmdpbjozMHB4IDA7Y29sb3I6I2ZmZn0KICAgIC5yZXZpZXctdGxkciBoM3tjb2xvcjojRDRBRjM3O21hcmdpbi1ib3R0b206MTJweDtmb250LWZhbWlseTonUGxheWZhaXIgRGlzcGxheScsc2VyaWZ9CiAgICAucmV2aWV3LXRsZHIgLnRsZHItcmF0aW5ne2ZvbnQtc2l6ZToxLjNlbTttYXJnaW4tYm90dG9tOjhweH0KICAgIC5yZXZpZXctdGFibGV7d2lkdGg6MTAwJTtib3JkZXItY29sbGFwc2U6c2VwYXJhdGU7Ym9yZGVyLXNwYWNpbmc6MDtib3JkZXItcmFkaXVzOjEycHg7b3ZlcmZsb3c6aGlkZGVuO21hcmdpbjoyNXB4IDA7Ym94LXNoYWRvdzowIDRweCAxNXB4IHJnYmEoMCwwLDAsLjEpfQogICAgLnJldmlldy10YWJsZSB0aHtiYWNrZ3JvdW5kOiM0QTFBNkI7Y29sb3I6I2ZmZjtwYWRkaW5nOjE0cHggMThweDt0ZXh0LWFsaWduOmxlZnQ7Zm9udC1mYW1pbHk6J1BsYXlmYWlyIERpc3BsYXknLHNlcmlmO2ZvbnQtd2VpZ2h0OjYwMDt3aWR0aDozNSV9CiAgICAucmV2aWV3LXRhYmxlIHRke3BhZGRpbmc6MTRweCAxOHB4O2JhY2tncm91bmQ6I2ZmZjtjb2xvcjojNTU1O2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNlZWV9CiAgICAucmV2aWV3LXRhYmxlIHRyOmxhc3QtY2hpbGQgdGR7Ym9yZGVyLWJvdHRvbTpub25lfQogICAgLnByb3MtY29uc3tkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmciAxZnI7Z2FwOjI1cHg7bWFyZ2luOjMwcHggMH0KICAgIEBtZWRpYShtYXgtd2lkdGg6NzY4cHgpey5wcm9zLWNvbnN7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmcn19CiAgICAucHJvcy1ib3gsLmNvbnMtYm94e3BhZGRpbmc6MjVweDtib3JkZXItcmFkaXVzOjEycHh9CiAgICAucHJvcy1ib3h7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCNlOGY1ZTksI2YxZjhlOSk7Ym9yZGVyOjFweCBzb2xpZCAjYTVkNmE3fQogICAgLmNvbnMtYm94e2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjZmNlNGVjLCNmZmYzZTApO2JvcmRlcjoxcHggc29saWQgI2VmOWE5YX0KICAgIC5wcm9zLWJveCBoM3tjb2xvcjojMmU3ZDMyfS5jb25zLWJveCBoM3tjb2xvcjojYzYyODI4fQogICAgLnByb3MtYm94IHVsLC5jb25zLWJveCB1bHtsaXN0LXN0eWxlOm5vbmU7cGFkZGluZzowfQogICAgLnByb3MtYm94IGxpOjpiZWZvcmV7Y29udGVudDoiXDI3MTMgIjtjb2xvcjojMmU3ZDMyO2ZvbnQtd2VpZ2h0OmJvbGQ7bWFyZ2luLXJpZ2h0OjhweH0KICAgIC5jb25zLWJveCBsaTo6YmVmb3Jle2NvbnRlbnQ6IlwyNzE3ICI7Y29sb3I6I2M2MjgyODtmb250LXdlaWdodDpib2xkO21hcmdpbi1yaWdodDo4cHh9CiAgICAucHJvcy1ib3ggbGksLmNvbnMtYm94IGxpe3BhZGRpbmc6NnB4IDA7bGluZS1oZWlnaHQ6MS41O2NvbG9yOiM1NTV9CiAgICAuc3Rhci1yYXRpbmd7Y29sb3I6I0Q0QUYzNztsZXR0ZXItc3BhY2luZzoycHh9CiAgICAucGxhdGZvcm0tY2FyZCBwLC5wbGF0Zm9ybS1jYXJkIHNwYW4sLnBsYXRmb3JtLWNhcmQgZGl2e2NvbG9yOiM1NTV9CiAgICAucGxhdGZvcm0tY2FyZCBwIHN0cm9uZ3tjb2xvcjojMjIyfQogICAgLnBsYXRmb3JtLWNhcmQgaDN7Y29sb3I6I0Q0QUYzN30ucGxhdGZvcm0tY2FyZCAuY2FyZC1yYXRpbmd7Y29sb3I6I0Q0QUYzNztmb250LXdlaWdodDo2MDB9CiAgICAucmFua2luZy10YWJsZSB0ZCwuY29tcGFyaXNvbi10YWJsZSB0ZHtjb2xvcjojNTU1fQogICAgLnJhbmtpbmctdGFibGUgdGQgYSwuY29tcGFyaXNvbi10YWJsZSB0ZCBhe2NvbG9yOiNENEFGMzc7Zm9udC13ZWlnaHQ6NjAwfQogICAgLnJhbmtpbmctdGFibGUgdHI6Zmlyc3QtY2hpbGQgdGR7Y29sb3I6IzJkMGE0ZTtmb250LXdlaWdodDo3MDB9CiAgICAuY29tcGFyaXNvbi10YWJsZSB0ZDpmaXJzdC1jaGlsZHtjb2xvcjojRDRBRjM3O2ZvbnQtd2VpZ2h0OjYwMH0KICAgIC5jb21wYXJpc29uLXRhYmxlIC53aW5uZXJ7Y29sb3I6IzFiNWUyMDtmb250LXdlaWdodDo3MDB9CiAgICAudmVyZGljdC1ib3h7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCM0QTFBNkIgMCUsIzFBMUE0QSAxMDAlKTtjb2xvcjojZmZmO3BhZGRpbmc6MzBweDtib3JkZXItcmFkaXVzOjEycHg7bWFyZ2luOjMwcHggMDt0ZXh0LWFsaWduOmNlbnRlcjtib3JkZXI6MnB4IHNvbGlkICNENEFGMzd9CiAgICAudmVyZGljdC1ib3ggaDN7Y29sb3I6I0Q0QUYzNztmb250LWZhbWlseTonUGxheWZhaXIgRGlzcGxheScsc2VyaWY7bWFyZ2luLWJvdHRvbToxNXB4fQogICAgLnZlcmRpY3QtYm94IC52ZXJkaWN0LXNjb3Jle2ZvbnQtc2l6ZToyLjVlbTtmb250LXdlaWdodDo3MDA7Y29sb3I6I0Q0QUYzNztmb250LWZhbWlseTonUGxheWZhaXIgRGlzcGxheScsc2VyaWZ9CiAgICAucGxhdGZvcm0tY2FyZHtiYWNrZ3JvdW5kOiNmZmY7Y29sb3I6IzU1NTtib3JkZXItcmFkaXVzOjEycHg7cGFkZGluZzoyNXB4O21hcmdpbjoyMHB4IDA7Ym94LXNoYWRvdzowIDRweCAxNXB4IHJnYmEoMCwwLDAsLjA4KTtib3JkZXI6MXB4IHNvbGlkICNlZWV9CiAgICAucGxhdGZvcm0tY2FyZDpob3Zlcnt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtM3B4KTtib3gtc2hhZG93OjAgOHB4IDI1cHggcmdiYSgwLDAsMCwuMTIpfQogICAgLmNvbXBhcmlzb24tdGFibGV7d2lkdGg6MTAwJTtib3JkZXItY29sbGFwc2U6c2VwYXJhdGU7Ym9yZGVyLXNwYWNpbmc6MDtib3JkZXItcmFkaXVzOjEycHg7b3ZlcmZsb3c6aGlkZGVuO21hcmdpbjoyNXB4IDA7Ym94LXNoYWRvdzowIDRweCAxNXB4IHJnYmEoMCwwLDAsLjEpfQogICAgLmNvbXBhcmlzb24tdGFibGUgdGhlYWQgdGh7YmFja2dyb3VuZDojNEExQTZCO2NvbG9yOiNmZmY7cGFkZGluZzoxNnB4O2ZvbnQtZmFtaWx5OidQbGF5ZmFpciBEaXNwbGF5JyxzZXJpZjtmb250LXdlaWdodDo2MDA7dGV4dC1hbGlnbjpjZW50ZXJ9CiAgICAuY29tcGFyaXNvbi10YWJsZSB0aGVhZCB0aDpmaXJzdC1jaGlsZHt0ZXh0LWFsaWduOmxlZnR9CiAgICAuY29tcGFyaXNvbi10YWJsZSB0ZHtwYWRkaW5nOjE0cHggMTZweDt0ZXh0LWFsaWduOmNlbnRlcjtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZWVlO2JhY2tncm91bmQ6I2ZmZjtjb2xvcjojNTU1fQogICAgLmNvbXBhcmlzb24tdGFibGUgdGQ6Zmlyc3QtY2hpbGR7dGV4dC1hbGlnbjpsZWZ0O2ZvbnQtd2VpZ2h0OjYwMDtiYWNrZ3JvdW5kOiNmOGY2ZmM7Y29sb3I6I0Q0QUYzN30KICAgIC5jb21wYXJpc29uLXRhYmxlIHRyOmxhc3QtY2hpbGQgdGR7Ym9yZGVyLWJvdHRvbTpub25lfQogICAgLmNvbXBhcmlzb24tdGFibGUgLndpbm5lcntiYWNrZ3JvdW5kOiNlOGY1ZTk7Zm9udC13ZWlnaHQ6NjAwO2NvbG9yOiMyZTdkMzJ9CiAgICAudmVyZGljdC1ieS1wcm9maWxle2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyIDFmcjtnYXA6MjBweDttYXJnaW46MjVweCAwfQogICAgQG1lZGlhKG1heC13aWR0aDo3NjhweCl7LnZlcmRpY3QtYnktcHJvZmlsZXtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyfX0KICAgIC5wcm9maWxlLWNhcmR7YmFja2dyb3VuZDojZjhmNmZjO2NvbG9yOiM1NTU7Ym9yZGVyLXJhZGl1czoxMnB4O3BhZGRpbmc6MjBweDtib3JkZXItbGVmdDo0cHggc29saWQgI0Q0QUYzN30KICAgIC5wcm9maWxlLWNhcmQgaDR7Y29sb3I6I0Q0QUYzNzttYXJnaW4tYm90dG9tOjhweH0KICAgIC5yYW5raW5nLXRhYmxle3dpZHRoOjEwMCU7Ym9yZGVyLWNvbGxhcHNlOnNlcGFyYXRlO2JvcmRlci1zcGFjaW5nOjA7Ym9yZGVyLXJhZGl1czoxMnB4O292ZXJmbG93OmhpZGRlbjttYXJnaW46MjVweCAwO2JveC1zaGFkb3c6MCA0cHggMTVweCByZ2JhKDAsMCwwLC4xKX0KICAgIC5yYW5raW5nLXRhYmxlIHRoZWFkIHRoe2JhY2tncm91bmQ6IzRBMUE2Qjtjb2xvcjojZmZmO3BhZGRpbmc6MTRweDtmb250LWZhbWlseTonUGxheWZhaXIgRGlzcGxheScsc2VyaWZ9CiAgICAucmFua2luZy10YWJsZSB0ZHtwYWRkaW5nOjEycHggMTRweDtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZWVlO2JhY2tncm91bmQ6I2ZmZjtjb2xvcjojNTU1O3RleHQtYWxpZ246Y2VudGVyfQogICAgLnJhbmtpbmctdGFibGUgdGQ6Zmlyc3QtY2hpbGQsLnJhbmtpbmctdGFibGUgdGQ6bnRoLWNoaWxkKDIpe3RleHQtYWxpZ246bGVmdH0KICAgIC5yYW5raW5nLXRhYmxlIHRyOmZpcnN0LWNoaWxkIHRke2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjZmRmNmUzLCNmZmY4ZTEpO2ZvbnQtd2VpZ2h0OjYwMDtjb2xvcjojRDRBRjM3fQogICAgLmh1Yi1saW5rc3tkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmciAxZnI7Z2FwOjE1cHg7bWFyZ2luOjI1cHggMH0KICAgIEBtZWRpYShtYXgtd2lkdGg6NzY4cHgpey5odWItbGlua3N7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmcn19CiAgICAuaHViLWxpbmt7ZGlzcGxheTpibG9jaztwYWRkaW5nOjE4cHggMjBweDtiYWNrZ3JvdW5kOiNmOGY2ZmM7Ym9yZGVyLXJhZGl1czoxMHB4O2NvbG9yOiNENEFGMzc7dGV4dC1kZWNvcmF0aW9uOm5vbmU7Zm9udC13ZWlnaHQ6NjAwO2JvcmRlcjoxcHggc29saWQgI2UwZDRmMDt0cmFuc2l0aW9uOmFsbCAuM3MgZWFzZX0KICAgIC5odWItbGluazpob3ZlcntiYWNrZ3JvdW5kOiM0QTFBNkI7Y29sb3I6I2ZmZjt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMnB4KX0KICAgIC5odWItbGluayBpe2NvbG9yOiNENEFGMzc7bWFyZ2luLXJpZ2h0OjEwcHh9CiAgICAudGFibGUtcmVzcG9uc2l2ZXtvdmVyZmxvdy14OmF1dG87LXdlYmtpdC1vdmVyZmxvdy1zY3JvbGxpbmc6dG91Y2g7bWFyZ2luOjI1cHggMDtib3JkZXItcmFkaXVzOjEycHh9CiAgICAudGFibGUtcmVzcG9uc2l2ZSAuY29tcGFyaXNvbi10YWJsZSwudGFibGUtcmVzcG9uc2l2ZSAucmFua2luZy10YWJsZXttYXJnaW46MDttaW4td2lkdGg6NTAwcHh9CiAgICAuY3RhLWF1ZGlvdGVse2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMUExQTRBIDAlLCM0QTFBNkIgMTAwJSk7Ym9yZGVyOjJweCBzb2xpZCAjRDRBRjM3O2JvcmRlci1yYWRpdXM6MTJweDtwYWRkaW5nOjI1cHg7bWFyZ2luOjMwcHggMDt0ZXh0LWFsaWduOmNlbnRlcjtjb2xvcjojZmZmfQogICAgLmN0YS1hdWRpb3RlbCBoM3tjb2xvcjojRDRBRjM3O2ZvbnQtZmFtaWx5OidQbGF5ZmFpciBEaXNwbGF5JyxzZXJpZjttYXJnaW4tYm90dG9tOjEwcHh9CiAgICAuY3RhLWF1ZGlvdGVsIC5waG9uZS1udW1iZXJ7Zm9udC1zaXplOjEuOGVtO2ZvbnQtd2VpZ2h0OjcwMDtjb2xvcjojRDRBRjM3O2xldHRlci1zcGFjaW5nOjJweDtkaXNwbGF5OmJsb2NrO21hcmdpbjoxNXB4IDA7dGV4dC1kZWNvcmF0aW9uOm5vbmV9CiAgICAuY3RhLWF1ZGlvdGVsIC5waG9uZS1jb2Rle2ZvbnQtc2l6ZToxLjFlbTtjb2xvcjojZmZmO21hcmdpbi1ib3R0b206MTVweH0KICAgIC5vYmYtbGlua3tjdXJzb3I6cG9pbnRlcjt0ZXh0LWRlY29yYXRpb246dW5kZXJsaW5lO2NvbG9yOmluaGVyaXR9Lm9iZi1saW5rOmhvdmVye29wYWNpdHk6Ljh9CiAgICBAbWVkaWEobWF4LXdpZHRoOjc2OHB4KXsucmV2aWV3LXRhYmxlIHRoe3dpZHRoOmF1dG87cGFkZGluZzoxMHB4IDEycHg7Zm9udC1zaXplOi45ZW19LnJldmlldy10YWJsZSB0ZHtwYWRkaW5nOjEwcHggMTJweDtmb250LXNpemU6LjllbX19CiAgICBAbWVkaWEobWF4LXdpZHRoOjU3NnB4KXsucmV2aWV3LXRhYmxlIHRoe2Rpc3BsYXk6YmxvY2s7d2lkdGg6MTAwJTtib3JkZXItYm90dG9tOm5vbmV9LnJldmlldy10YWJsZSB0ZHtkaXNwbGF5OmJsb2NrO3dpZHRoOjEwMCV9LnJldmlldy10YWJsZSB0cntkaXNwbGF5OmJsb2NrO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNlZWV9fQo8L3N0eWxlPgo=", "base64").toString("utf8");


function getHead(title, metaDesc, canonical, schemaLD) {
    return `<!DOCTYPE html>
<html lang="fr" class="no-js">
<head>
    <script>document.documentElement.classList.remove('no-js');</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${metaDesc}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:url" content="${SITE_URL}${canonical}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${SITE_URL}/images/og-default.png">
    <meta property="og:locale" content="fr_FR">
    <meta property="og:site_name" content="France Voyance Avenir">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="${SITE_URL}/images/og-default.png">
    <link rel="canonical" href="${SITE_URL}${canonical}">
    <meta name="robots" content="index, follow">
    <link rel="icon" href="/images/favicon.png" type="image/png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/css/style.css?v=2029">
    <link rel="stylesheet" href="/css/animations.css?v=2026">
    <script src="/js/config.js"></script>
    ${AVIS_INLINE_CSS}
    <noscript><style>.fade-in-up,.fade-in-left,.fade-in-right,.scale-in,.reveal{opacity:1 !important;transform:none !important;transition:none !important}.faq-answer{max-height:none !important;overflow:visible !important;padding:0 24px 20px !important}.faq-icon,.faq-toggle{display:none}.sticky-cta{opacity:1 !important;transform:none !important;pointer-events:auto !important}.testimonial-nav{display:none}.reading-progress-container{display:none}</style></noscript>
    <script type="application/ld+json">
    ${JSON.stringify(schemaLD, null, 2)}
    </script>
</head>`;
}


function getHeader() {
    const platformDropdown = platforms.map(p =>
        `<li><a href="/avis/${p.slug}/">${p.name}</a></li>`
    ).join('\n                            ');
    return `
    <div class="stars-container"></div>
    <div class="reading-progress-container"><div class="reading-progress-bar"></div></div>
    <header class="site-header">
        <div class="container header-container">
            <a href="/" class="logo"><img src="/images/logo.svg" alt="France Voyance Avenir"></a>
            <div class="mobile-toggle"><i class="fa-solid fa-bars"></i></div>
            <nav class="main-nav">
                <a href="/" class="nav-logo"><img src="/images/logo.svg" alt="France Voyance Avenir"></a>
                <ul>
                    <li class="nav-item"><a href="/" class="nav-link">Accueil</a></li>
                    <li class="nav-item">
                        <a href="/voyance-gratuite/" class="nav-link">Voyance Gratuite <i class="fa-solid fa-chevron-down" style="font-size:0.7em;"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/voyance-gratuite/tarot-gratuit/">Tarot Gratuit</a></li>
                            <li><a href="/voyance-gratuite/tarot-d-amour/">Tarot Amour</a></li>
                            <li><a href="/voyance-gratuite/numerologie-gratuite/">Numerologie Gratuite</a></li>
                            <li><a href="/voyance-gratuite/pendule-oui-non/">Pendule Oui/Non</a></li>
                            <li><a href="/voyance-gratuite/tarot-oui-non/">Tarot Oui/Non</a></li>
                            <li><a href="/voyance-gratuite/compatibilite-astrale/">Compatibilite Astrale</a></li>
                            <li><a href="/voyance-gratuite/tirage-runes/">Tirage de Runes</a></li>
                            <li><a href="/glossaire/">Glossaire Esoterique</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="#" class="nav-link">Arts Divinatoires <i class="fa-solid fa-chevron-down" style="font-size:0.7em;"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/tarot-marseille/">Tarot de Marseille</a></li>
                            <li><a href="/arts-divinatoires/pendule/">Voyance Pendule</a></li>
                            <li><a href="/arts-divinatoires/oracle-belline/">Oracle Belline</a></li>
                            <li><a href="/arts-divinatoires/oracle-ge/">Oracle Ge</a></li>
                            <li><a href="/arts-divinatoires/runes/">Tirage Runes</a></li>
                            <li><a href="/arts-divinatoires/cartomancie/">Cartomancie</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a href="/avis/" class="nav-link">Plateformes <i class="fa-solid fa-chevron-down" style="font-size:0.7em;"></i></a>
                        <ul class="dropdown-menu">
                            ${platformDropdown}
                        </ul>
                    </li>
                    <li class="nav-item"><a href="/comparatif/" class="nav-link">Comparatifs</a></li>
                    <li class="nav-item">
                        <a href="#" class="nav-link">Consulter <i class="fa-solid fa-chevron-down" style="font-size:0.7em;"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/consulter/voyance-telephone/">Voyance Telephone</a></li>
                            <li><a href="/consultations/amour-retour-affectif/">Amour & Retour Affectif</a></li>
                            <li><a href="/consultations/flamme-jumelle/">Flamme Jumelle</a></li>
                            <li><a href="/consultations/medium-defunts/">Medium & Defunts</a></li>
                        </ul>
                    </li>
                    <li class="nav-item cta-nav">
                        <a href="tel:0892686882" class="btn btn-gold btn-sm"><i class="fas fa-phone-alt"></i> Consulter maintenant</a>
                    </li>
                </ul>
            </nav>
        </div>
    </header>`;
}


function getFooter() {
    const platformLinks = platforms.map(p =>
        `<li><a href="/avis/${p.slug}/">${p.name}</a></li>`
    ).join('\n                        ');
    const topComps = comparisons.slice(0, 6).map(c => {
        const pA = getPlatform(c.platformA);
        const pB = getPlatform(c.platformB);
        return `<li><a href="/avis/${c.slug}/">${pA.name} vs ${pB.name}</a></li>`;
    }).join('\n                        ');
    return `
    <footer class="site-footer">
        <div class="container">
            <div class="footer-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:30px;">
                <div class="footer-col">
                    <h4>Plateformes de voyance</h4>
                    <ul class="footer-links">${platformLinks}</ul>
                </div>
                <div class="footer-col">
                    <h4>Comparatifs</h4>
                    <ul class="footer-links">
                        <li><a href="/comparatif/">Tous les comparatifs</a></li>
                        ${topComps}
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Outils gratuits</h4>
                    <ul class="footer-links">
                        <li><a href="/voyance-gratuite/tarot-gratuit/">Tarot Gratuit</a></li>
                        <li><a href="/voyance-gratuite/tarot-d-amour/">Tarot Amour</a></li>
                        <li><a href="/voyance-gratuite/numerologie-gratuite/">Numerologie Gratuite</a></li>
                        <li><a href="/voyance-gratuite/pendule-oui-non/">Pendule Oui/Non</a></li>
                        <li><a href="/voyance-gratuite/compatibilite-astrale/">Compatibilite Astrale</a></li>
                        <li><a href="/glossaire/">Glossaire</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Informations</h4>
                    <ul class="footer-links">
                        <li><span class="obf-link" data-o="${b64('/legal/mentions-legales/')}" role="link" tabindex="0">Mentions Legales</span></li>
                        <li><span class="obf-link" data-o="${b64('/legal/politique-confidentialite/')}" role="link" tabindex="0">Politique de Confidentialite</span></li>
                        <li><span class="obf-link" data-o="${b64('/legal/politique-cookies/')}" role="link" tabindex="0">Politique des Cookies</span></li>
                        <li><span class="obf-link" data-o="${b64('/legal/cgu/')}" role="link" tabindex="0">CGU</span></li>
                        <li><a href="/contact/">Contact</a></li>
                        <li><a href="/plan-du-site/">Plan du site</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container">
                <p>&copy; 2026 France Voyance Avenir - Tous droits reserves</p>
                <div class="disclaimer">Ce site propose des services de divertissement. Les consultations de voyance ne remplacent pas un avis medical, juridique ou financier professionnel.</div>
                <p class="affiliate-disclosure">* Ce site contient des liens affilies. En cliquant sur ces liens et en effectuant un achat, nous pouvons recevoir une commission sans frais supplementaires pour vous.</p>
            </div>
        </div>
    </footer>
    <div class="sticky-cta"><div class="sticky-cta-pulse"></div><a href="tel:0892686882" class="btn btn-gold"><span class="sticky-cta-icon"><i class="fas fa-phone-alt"></i></span><span>Consulter</span></a></div>
    <script>document.addEventListener('click',function(e){if(e.target.classList.contains('obf-link')||e.target.closest('.obf-link')){var el=e.target.classList.contains('obf-link')?e.target:e.target.closest('.obf-link');window.location.href=atob(el.getAttribute('data-o'));}});</script>
    <script src="/js/animations.js" defer></script>
    <script src="/js/main.js?v=2029"></script>
    <script src="/js/logger.js" defer></script>`;
}


function ctaCosmospace() {
    return `
    <div class="cta-audiotel">
        <h3><i class="fas fa-phone-alt"></i> Consulte un voyant maintenant</h3>
        <p>Pas besoin de CB, pas d'attente, 24h/24</p>
        <a href="tel:0892686882" class="phone-number">08 92 68 68 82</a>
        <p class="phone-code">Code : <strong>1211</strong></p>
        <p style="font-size:0.85em;opacity:0.8;">Service Cosmospace - 0,80 euros/min + prix appel</p>
    </div>`;
}
function ctaPlatform(p) {
    if (p.slug === 'cosmospace') return ctaCosmospace();
    if (p.isAffiliate) {
        return `<div class="verdict-box" style="margin:30px 0;"><h3><i class="fas fa-star"></i> Essayer ${p.name}</h3><p style="margin-bottom:15px;">${p.freeOffer}</p><a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(),'_blank');return false;" data-affiliate="default" class="btn btn-gold btn-xl">Decouvrir ${p.name}</a></div>`;
    }
    return `<div class="verdict-box" style="margin:30px 0;"><h3><i class="fas fa-star"></i> Essayer ${p.name}</h3><p style="margin-bottom:15px;">${p.freeOffer}</p><a href="${p.url}" target="_blank" rel="noopener" class="btn btn-gold btn-xl">Decouvrir ${p.name}</a></div>`;
}
function ctaDefault() { return ctaCosmospace(); }


const V_INTRO = [
    (A, B) => "Tu hesites entre " + A + " et " + B + " ? C'est un choix courant quand on cherche une consultation de voyance en ligne de qualite.",
    (A, B) => "Difficile de choisir entre " + A + " et " + B + " sans un comparatif clair. Les deux plateformes ont leurs adeptes.",
    (A, B) => A + " et " + B + " font partie des plateformes les plus consultees pour la voyance en ligne.",
    (A, B) => "Si tu compares " + A + " et " + B + ", c'est que tu veux faire le bon choix avant ta premiere consultation.",
    (A, B) => A + " ou " + B + " pour ta consultation de voyance ? La question revient souvent dans les forums.",
    (A, B) => "Avant de choisir entre " + A + " et " + B + ", il est important de comprendre ce qui les differencie vraiment.",
    (A, B) => "Tu cherches a savoir si " + A + " vaut mieux que " + B + " pour la voyance en ligne ? Ce comparatif t'aidera.",
    (A, B) => "Entre " + A + " et " + B + ", le choix n'est pas toujours evident. On a fait le travail de comparaison pour toi.",
    (A, B) => A + " et " + B + " sont deux noms qui reviennent souvent quand on parle de voyance en ligne en France.",
    (A, B) => "Choisir entre " + A + " et " + B + " peut sembler complique. Les deux proposent de la voyance, mais avec des approches differentes.",
    (A, B) => "Tu veux comparer " + A + " et " + B + " avant de te lancer ? On a analyse ces deux services sous tous les angles.",
    (A, B) => A + " face a " + B + " : quel service de voyance choisir en 2026 ? On compare tarifs, voyants et fiabilite."
];

const V_INTRO_P2 = [
    (A, B) => "Dans ce comparatif, on analyse " + A + " et " + B + " critere par critere : tarifs, qualite, canaux, offres et service client.",
    (A, B) => "On a teste les deux plateformes en conditions reelles pour te livrer un avis objectif. Chaque critere est passe au peigne fin.",
    (A, B) => "Ce guide couvre tous les aspects importants : prix, disponibilite, avis clients et offres de decouverte.",
    (A, B) => "Notre equipe a analyse les forces et faiblesses de " + A + " et " + B + ". Un comparatif honnete, sans langue de bois.",
    (A, B) => "Que tu privilegies le prix, la qualite ou la diversite des voyants, ce comparatif t'apportera les reponses.",
    (A, B) => "On a epluche les avis clients, compare les tarifs et teste l'ergonomie. Voici notre analyse.",
    (A, B) => "Ce comparatif est a jour pour 2026. Les informations presentees sont recentes et fiables.",
    (A, B) => "Plutot que les forums, on a centralise toutes les infos utiles. Donnees factuelles et avis personnel apres test."
];

const V_PRIX = [
    (A, B, pA, pB) => {
        const cheaper = pA.priceMin <= pB.priceMin ? A : B;
        const cheaperP = pA.priceMin <= pB.priceMin ? pA : pB;
        const otherP = pA.priceMin <= pB.priceMin ? pB : pA;
        const other = pA.priceMin <= pB.priceMin ? B : A;
        return "Cote tarifs, " + cheaper + " est plus accessible (" + cheaperP.priceRange + ") contre " + otherP.priceRange + " chez " + other + ". 20 minutes au minimum : " + cost20min(pA.priceMin) + " euros (" + A + ") vs " + cost20min(pB.priceMin) + " euros (" + B + "). Offres : " + A + " = " + pA.freeOffer + ", " + B + " = " + pB.freeOffer + ". Paiements : " + A + " accepte " + pA.paymentMethods.join(", ") + " ; " + B + " accepte " + pB.paymentMethods.join(", ") + ".";
    },
    (A, B, pA, pB) => {
        return A + " : " + pA.priceRange + ". " + B + " : " + pB.priceRange + ". " + (pA.priceMin === pB.priceMin ? "Meme tarif d'entree." : (pA.priceMin < pB.priceMin ? A + " est plus abordable." : B + " est plus accessible.")) + " Cout 20 min : " + cost20min(pA.priceMin) + " euros (" + A + "), " + cost20min(pB.priceMin) + " euros (" + B + "). " + A + " : " + pA.freeOffer + ". " + B + " : " + pB.freeOffer + ".";
    },
    (A, B, pA, pB) => {
        return "Budget : " + A + " pratique " + pA.priceRange + ", " + B + " " + pB.priceRange + ". 20 min au minimum = " + cost20min(pA.priceMin) + " euros (" + A + ") contre " + cost20min(pB.priceMin) + " euros (" + B + "). Offres de bienvenue : " + A + " (" + pA.freeOffer + "), " + B + " (" + pB.freeOffer + ").";
    },
    (A, B, pA, pB) => {
        return "Tarifs : " + A + " de " + pA.priceRange + ", " + B + " de " + pB.priceRange + ". " + (pA.priceMin < pB.priceMin ? "Avantage " + A + "." : pA.priceMin > pB.priceMin ? "Avantage " + B + "." : "Parite.") + " Pour 20 min : " + cost20min(pA.priceMin) + " euros vs " + cost20min(pB.priceMin) + " euros. Decouverte : " + A + " propose " + pA.freeOffer + ", " + B + " offre " + pB.freeOffer + ".";
    }
];

const V_QUALITE = [
    (A, B, pA, pB) => {
        const better = pA.rating >= pB.rating ? A : B;
        return "Qualite : " + better + " se demarque avec " + (pA.rating >= pB.rating ? pA : pB).rating + "/5 contre " + (pA.rating >= pB.rating ? pB : pA).rating + "/5. " + A + " propose " + pA.nbPractitioners + " voyants, " + B + " en compte " + pB.nbPractitioners + ". Avis : " + A + " = " + pA.ratingCount.toLocaleString("fr-FR") + ", " + B + " = " + pB.ratingCount.toLocaleString("fr-FR") + ".";
    },
    (A, B, pA, pB) => {
        return A + " : " + pA.rating + "/5 sur " + pA.ratingCount.toLocaleString("fr-FR") + " avis, " + pA.nbPractitioners + " voyants. " + B + " : " + pB.rating + "/5 sur " + pB.ratingCount.toLocaleString("fr-FR") + " avis, " + pB.nbPractitioners + " voyants. Specialites " + A + " : " + pA.specialties.slice(0,3).join(", ") + ". " + B + " : " + pB.specialties.slice(0,3).join(", ") + ".";
    },
    (A, B, pA, pB) => {
        return "Meilleurs voyants ? " + A + " = " + pA.rating + "/5 (" + pA.ratingCount.toLocaleString("fr-FR") + " avis, " + pA.nbPractitioners + " praticiens). " + B + " = " + pB.rating + "/5 (" + pB.ratingCount.toLocaleString("fr-FR") + " avis, " + pB.nbPractitioners + " voyants). " + (pA.rating > pB.rating ? A + " a une meilleure note." : pB.rating > pA.rating ? B + " est mieux note." : "Egalite.");
    }
];

const V_FACILITE = [
    (A, B, pA, pB) => {
        let t = "Canaux : " + A + " = " + pA.channels.join(", ") + ". " + B + " = " + pB.channels.join(", ") + ". ";
        t += "Dispo : " + A + " " + pA.availability + ", " + B + " " + pB.availability + ".";
        if (pA.availability.includes("24h") && !pB.availability.includes("24h")) t += " " + A + " est accessible 24h/24.";
        else if (pB.availability.includes("24h") && !pA.availability.includes("24h")) t += " " + B + " est dispo en permanence.";
        return t;
    },
    (A, B, pA, pB) => {
        let t = A + " : " + pA.channels.join(", ") + ". " + B + " : " + pB.channels.join(", ") + ". ";
        if (pA.channels.includes("Audiotel") && !pB.channels.includes("Audiotel")) t += A + " a l'audiotel (sans CB). ";
        else if (pB.channels.includes("Audiotel") && !pA.channels.includes("Audiotel")) t += B + " propose l'audiotel. ";
        if (pA.channels.includes("Visio") && !pB.channels.includes("Visio")) t += A + " offre la visio. ";
        else if (pB.channels.includes("Visio") && !pA.channels.includes("Visio")) t += B + " offre la visio. ";
        t += "Horaires : " + A + " " + pA.availability + ", " + B + " " + pB.availability + ".";
        return t;
    },
    (A, B, pA, pB) => {
        return A + " : " + pA.channels.join(" et ") + ". " + B + " : " + pB.channels.join(" et ") + ". " + A + " dispo " + pA.availability + ", " + B + " " + pB.availability + ".";
    }
];

const V_SUPPORT = [
    (A, B, pA, pB) => { return "Service client : " + A + " (depuis " + pA.yearFounded + ", " + (2026-pA.yearFounded) + " ans) vs " + B + " (depuis " + pB.yearFounded + ", " + (2026-pB.yearFounded) + " ans). Trustpilot : " + A + " " + pA.trustpilotScore + ", " + B + " " + pB.trustpilotScore + "."; },
    (A, B, pA, pB) => { return A + " (actif depuis " + pA.yearFounded + ") a rode son support. " + B + " (depuis " + pB.yearFounded + ") propose aussi un accompagnement. Paiements : " + A + " = " + pA.paymentMethods.join(", ") + ". " + B + " = " + pB.paymentMethods.join(", ") + "."; },
    (A, B, pA, pB) => { const older = pA.yearFounded <= pB.yearFounded ? A : B; return older + " est le plus ancien. Trustpilot : " + A + " " + pA.trustpilotScore + ", " + B + " " + pB.trustpilotScore + ". Les deux gerent litiges et remboursements."; }
];

const V_VERDICT = [
    (A, B, pA, pB, w, wP, l, lP) => { return "Au final, " + w + " est le meilleur choix. Note " + wP.rating + "/5, offre " + wP.freeOffer + ". " + l + " reste valable " + (lP.priceMin < wP.priceMin ? "pour les petits budgets." : "selon tes preferences."); },
    (A, B, pA, pB, w, wP, l, lP) => { return "Notre verdict : " + w + ". Note " + wP.rating + "/5, " + wP.nbPractitioners + " voyants, " + wP.freeOffer + ". " + l + " merite le detour " + (lP.channels.includes("Audiotel") ? "pour l'audiotel." : "pour une autre approche."); },
    (A, B, pA, pB, w, wP, l, lP) => { return "On recommande " + w + ". " + wP.rating + "/5, " + wP.nbPractitioners + " voyants, " + wP.freeOffer + ". Teste les deux grace aux offres de decouverte."; }
];


const EXISTING_COMP = {
    "wengo-vs-spiriteo": {
        introP1: "Wengo et Spiriteo sont deux piliers de la voyance en ligne en France. Wengo mise sur le volume (500+ voyants), Spiriteo sur la selection (150 praticiens).",
        introP2: "Ce comparatif t'aide a determiner laquelle correspond le mieux a tes attentes. On a teste les deux.",
        prixAnalysis: "Wengo : 2,00 euros/min, Spiriteo : 2,90. Wengo offre 10 minutes, Spiriteo 5. Wengo accepte PayPal en plus de la CB.",
        qualiteAnalysis: "Spiriteo a un recrutement plus exigeant. Wengo compense par la diversite et les avis verifies.",
        faciliteAnalysis: "Wengo : interface complete, recherche avancee. Spiriteo : interface epuree et moderne. Les deux sur mobile.",
        supportAnalysis: "Wengo : service client 24h/24. Spiriteo : 7h-3h mais reactif.",
        faq: [
            { q: "Wengo ou Spiriteo, le moins cher ?", a: "Wengo a 2 euros/min contre 2,90 Spiriteo." },
            { q: "Meilleurs voyants ?", a: "Spiriteo pour la qualite, Wengo pour le choix." },
            { q: "Premiere consultation ?", a: "Wengo : 10 min offertes vs 5 Spiriteo." },
            { q: "Disponibles 24h/24 ?", a: "Wengo oui, Spiriteo non (7h-3h)." }
        ]
    },
    "wengo-vs-jimini": {
        introP1: "Wengo est le leader (500+ voyants), Jimini une alternative accessible avec des tarifs bas.",
        introP2: "Ce comparatif t'aide a choisir entre richesse Wengo et accessibilite Jimini.",
        prixAnalysis: "Jimini : 1,90 euro/min, Wengo : 2,00. Wengo offre 10 min, Jimini 3. Jimini propose l'audiotel.",
        qualiteAnalysis: "Wengo : 4.5/5, Jimini : 3.8/5. Panel Wengo six fois plus large (500 vs 80).",
        faciliteAnalysis: "Interface Wengo plus sophistiquee. Jimini se demarque par le SMS.",
        supportAnalysis: "Wengo : service client 24h/24, plus developpe.",
        faq: [
            { q: "Le moins cher ?", a: "Jimini a 1,90 vs 2,00 Wengo." },
            { q: "Plus de voyants ?", a: "Wengo : 500+ vs 80." },
            { q: "SMS ?", a: "Seul Jimini." },
            { q: "Minutes offertes ?", a: "Wengo 10, Jimini 3." }
        ]
    },
    "wengo-vs-avigora": {
        introP1: "Wengo (2007) est le leader, Avigora (2010) mise sur la disponibilite et l'audiotel.",
        introP2: "Ce comparatif t'aide a choisir la plateforme adaptee.",
        prixAnalysis: "Les deux a 2,00 euros/min. Wengo offre 10 min, Avigora 5. Avigora a l'audiotel.",
        qualiteAnalysis: "Wengo : 4.5/5 vs 3.7/5. Panel Wengo quatre fois superieur (500 vs 120).",
        faciliteAnalysis: "Interface Wengo plus moderne. Avigora : 24h/24 et audiotel.",
        supportAnalysis: "Wengo a le meilleur service client.",
        faq: [
            { q: "Audiotel ?", a: "Avigora oui, Wengo non." },
            { q: "Plus fiable ?", a: "Wengo, avis verifies." },
            { q: "Memes tarifs ?", a: "Oui, 2 euros/min." },
            { q: "La nuit ?", a: "Les deux 24h/24." }
        ]
    },
    "spiriteo-vs-jimini": {
        introP1: "Spiriteo mise sur la qualite, Jimini sur les tarifs accessibles.",
        introP2: "Qualite vs accessibilite : ce comparatif t'aide a trancher.",
        prixAnalysis: "Jimini : 1,90, Spiriteo : 2,90. Spiriteo offre 5 min, Jimini 3. Jimini a l'audiotel.",
        qualiteAnalysis: "Spiriteo : recrutement exigeant, panel plus large (150 vs 80).",
        faciliteAnalysis: "Spiriteo : interface moderne. Jimini : SMS et audiotel.",
        supportAnalysis: "Spiriteo plus reactif, horaires 7h-3h vs 8h-minuit.",
        faq: [
            { q: "Le moins cher ?", a: "Jimini a 1,90 vs 2,90." },
            { q: "Meilleurs voyants ?", a: "Spiriteo." },
            { q: "SMS ?", a: "Seul Jimini." },
            { q: "Audiotel ?", a: "Seul Jimini." }
        ]
    },
    "spiriteo-vs-avigora": {
        introP1: "Avigora (2010) : disponibilite permanente. Spiriteo (2015) : qualite et interface moderne.",
        introP2: "Accessibilite Avigora vs qualite Spiriteo.",
        prixAnalysis: "Avigora : 2,00, Spiriteo : 2,90. Les deux offrent 5 min. Avigora a l'audiotel.",
        qualiteAnalysis: "Spiriteo : meilleure qualite, recrutement exigeant.",
        faciliteAnalysis: "Spiriteo : interface moderne. Avigora : 24h/24 et audiotel.",
        supportAnalysis: "Spiriteo mieux note. Avigora : audiotel sans inscription.",
        faq: [
            { q: "24h/24 ?", a: "Seul Avigora." },
            { q: "Meilleurs voyants ?", a: "Spiriteo." },
            { q: "Audiotel ?", a: "Seul Avigora." },
            { q: "Petits budgets ?", a: "Avigora a 2 vs 2,90." }
        ]
    }
};


function generateCompContent(slug, pA, pB) {
    const A = pA.name, B = pB.name, seed = slug;
    let winner, winnerP, loser, loserP;
    if (pA.slug === "cosmospace") { winner = A; winnerP = pA; loser = B; loserP = pB; }
    else if (pB.slug === "cosmospace") { winner = B; winnerP = pB; loser = A; loserP = pA; }
    else if (pA.rating >= pB.rating) { winner = A; winnerP = pA; loser = B; loserP = pB; }
    else { winner = B; winnerP = pB; loser = A; loserP = pA; }
    return {
        introP1: pick(V_INTRO, seed + "_intro")(A, B),
        introP2: pick(V_INTRO_P2, seed + "_intro2")(A, B),
        prixAnalysis: pick(V_PRIX, seed + "_prix")(A, B, pA, pB),
        qualiteAnalysis: pick(V_QUALITE, seed + "_qual")(A, B, pA, pB),
        faciliteAnalysis: pick(V_FACILITE, seed + "_fac")(A, B, pA, pB),
        supportAnalysis: pick(V_SUPPORT, seed + "_sup")(A, B, pA, pB),
        verdict: pick(V_VERDICT, seed + "_verd")(A, B, pA, pB, winner, winnerP, loser, loserP),
        winner: winner, winnerP: winnerP,
        faq: generateCompFAQ(slug, A, B, pA, pB, winner)
    };
}
function generateCompFAQ(slug, A, B, pA, pB, winner) {
    const faqs = [
        { q: A + " ou " + B + ", le moins cher ?", a: (pA.priceMin <= pB.priceMin ? A : B) + " des " + (pA.priceMin <= pB.priceMin ? pA.priceRange : pB.priceRange) + "." },
        { q: "Meilleure note entre " + A + " et " + B + " ?", a: (pA.rating >= pB.rating ? A : B) + " avec " + Math.max(pA.rating, pB.rating) + "/5." },
        { q: A + " ou " + B + " pour debuter ?", a: winner + " est recommande." },
        { q: "Disponibilite 24h/24 ?", a: (pA.availability.includes("24h") ? A + " = 24h/24. " : A + " = " + pA.availability + ". ") + (pB.availability.includes("24h") ? B + " = 24h/24." : B + " = " + pB.availability + ".") }
    ];
    if (pA.channels.includes("Audiotel") || pB.channels.includes("Audiotel")) {
        faqs.push({ q: "Audiotel ?", a: (pA.channels.includes("Audiotel") ? A : B) + " propose l'audiotel." });
    }
    return faqs.slice(0, 4);
}


function generateComparisonPage(comp) {
    const pA = getPlatform(comp.platformA), pB = getPlatform(comp.platformB);
    const A = pA.name, B = pB.name;
    const canonicalPath = "/avis/" + comp.slug + "/";
    const content = EXISTING_COMP[comp.slug] || generateCompContent(comp.slug, pA, pB);
    const isAuto = !EXISTING_COMP[comp.slug];
    let winner, winnerP;
    if (pA.slug === "cosmospace") { winner = A; winnerP = pA; }
    else if (pB.slug === "cosmospace") { winner = B; winnerP = pB; }
    else if (pA.rating >= pB.rating) { winner = A; winnerP = pA; }
    else { winner = B; winnerP = pB; }
    const title = A + " ou " + B + " : Avis & Comparatif 2026";
    const metaDesc = "Comparatif " + A + " vs " + B + " : tarifs, voyants, avis. Decouvre quelle plateforme choisir en 2026.";
    const relatedComps = comparisons.filter(c => c.slug !== comp.slug && (c.platformA === pA.slug || c.platformB === pA.slug || c.platformA === pB.slug || c.platformB === pB.slug)).slice(0, 3);
    const schema = { "@context": "https://schema.org", "@graph": [
        { "@type": "BreadcrumbList", "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE_URL + "/" },
            { "@type": "ListItem", "position": 2, "name": "Comparatifs", "item": SITE_URL + "/comparatif/" },
            { "@type": "ListItem", "position": 3, "name": A + " vs " + B, "item": SITE_URL + canonicalPath }
        ]},
        { "@type": "Article", "headline": title, "author": { "@type": "Organization", "name": "France Voyance Avenir" }, "datePublished": "2026-02-15", "dateModified": "2026-03-01" },
        { "@type": "FAQPage", "mainEntity": content.faq.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) }
    ]};
    const relatedLinks = relatedComps.map(rc => { const rcA = getPlatform(rc.platformA), rcB = getPlatform(rc.platformB); return '<li><a href="/avis/' + rc.slug + '/">' + rcA.name + ' vs ' + rcB.name + '</a></li>'; }).join("\n");
    const faqHtml = content.faq.map(f => '<div class="faq-item"><button class="faq-question" aria-expanded="false"><span>' + f.q + '</span><span class="faq-icon">+</span></button><div class="faq-answer"><p>' + f.a + '</p></div></div>').join("\n");
    const prosA = pA.pros.map(p => "<li>" + p + "</li>").join("");
    const consA = pA.cons.map(c => "<li>" + c + "</li>").join("");
    const prosB = pB.pros.map(p => "<li>" + p + "</li>").join("");
    const consB = pB.cons.map(c => "<li>" + c + "</li>").join("");

    const html = getHead(title, metaDesc, canonicalPath, schema) + `
<body>
    ${getHeader()}
    <main>
        <nav class="breadcrumbs" aria-label="Fil d'Ariane"><div class="container"><a href="/">Accueil</a> <span class="separator">&rsaquo;</span> <a href="/comparatif/">Comparatifs</a> <span class="separator">&rsaquo;</span> <span class="current">${A} vs ${B}</span></div></nav>
        <section class="local-hero"><div class="container"><h1 class="fade-in-up">${A} ou ${B} : comparatif complet pour bien choisir</h1><p class="hero-subtitle fade-in-up stagger-1">Analyse detaillee pour choisir la bonne plateforme de voyance</p></div></section>
        <section class="content-section"><div class="container"><div class="content-grid">
            <article class="main-content">
                <div class="review-tldr fade-in-up">
                    <h3><i class="fas fa-bolt"></i> Le verdict en bref</h3>
                    <p><strong>Notre recommandation :</strong> ${winner} (${winnerP.rating}/5)</p>
                    <p><strong>Budget serre :</strong> ${comp.verdictBudget}</p>
                    <p><strong>Large choix :</strong> ${comp.verdictChoice}</p>
                    <p><strong>Pour debuter :</strong> ${comp.verdictBeginner}</p>
                </div>
                ${ctaCosmospace()}
                <section class="content-block fade-in-up"><h2>${A} vs ${B} : deux approches differentes</h2><p>${content.introP1}</p><p>${content.introP2}</p></section>

                <section class="content-block fade-in-up"><h2>Tableau comparatif</h2><div class="table-responsive"><table class="comparison-table">
                    <thead><tr><th>Critere</th><th>${A}</th><th>${B}</th></tr></thead>
                    <tbody>
                        <tr><td>Note</td><td${pA.rating >= pB.rating ? ' class="winner"' : ''}>${starsHTML(pA.rating)} ${pA.rating}/5</td><td${pB.rating >= pA.rating ? ' class="winner"' : ''}>${starsHTML(pB.rating)} ${pB.rating}/5</td></tr>
                        <tr><td>Avis</td><td${pA.ratingCount >= pB.ratingCount ? ' class="winner"' : ''}>${pA.ratingCount.toLocaleString("fr-FR")}</td><td${pB.ratingCount >= pA.ratingCount ? ' class="winner"' : ''}>${pB.ratingCount.toLocaleString("fr-FR")}</td></tr>
                        <tr><td>Tarifs</td><td${pA.priceMin <= pB.priceMin ? ' class="winner"' : ''}>${pA.priceRange}</td><td${pB.priceMin <= pA.priceMin ? ' class="winner"' : ''}>${pB.priceRange}</td></tr>
                        <tr><td>Offre</td><td>${pA.freeOffer}</td><td>${pB.freeOffer}</td></tr>
                        <tr><td>Voyants</td><td>${pA.nbPractitioners}</td><td>${pB.nbPractitioners}</td></tr>
                        <tr><td>Canaux</td><td>${pA.channels.join(", ")}</td><td>${pB.channels.join(", ")}</td></tr>
                        <tr><td>Disponibilite</td><td>${pA.availability}</td><td>${pB.availability}</td></tr>
                        <tr><td>Specialites</td><td>${pA.specialties.join(", ")}</td><td>${pB.specialties.join(", ")}</td></tr>
                        <tr><td>Paiement</td><td>${pA.paymentMethods.join(", ")}</td><td>${pB.paymentMethods.join(", ")}</td></tr>
                        <tr><td>Trustpilot</td><td>${pA.trustpilotScore}</td><td>${pB.trustpilotScore}</td></tr>
                        <tr><td>Creation</td><td>${pA.yearFounded}</td><td>${pB.yearFounded}</td></tr>
                    </tbody>
                </table></div></section>
                <section class="content-block fade-in-up"><h2>Presentation de ${A}</h2><p>${pA.verdict}</p><h3>Points forts</h3><div class="pros-box"><ul>${prosA}</ul></div><h3>Points faibles</h3><div class="cons-box"><ul>${consA}</ul></div><h3>Pour qui ?</h3><p>${pA.bestFor}</p></section>
                <section class="content-block fade-in-up"><h2>Presentation de ${B}</h2><p>${pB.verdict}</p><h3>Points forts</h3><div class="pros-box"><ul>${prosB}</ul></div><h3>Points faibles</h3><div class="cons-box"><ul>${consB}</ul></div><h3>Pour qui ?</h3><p>${pB.bestFor}</p></section>

                <section class="content-block fade-in-up"><h2>Comparaison detaillee des tarifs</h2><p>${content.prixAnalysis}</p></section>
                ${ctaCosmospace()}
                <section class="content-block fade-in-up"><h2>Qualite des voyants</h2><p>${content.qualiteAnalysis}</p></section>
                <section class="content-block fade-in-up"><h2>Facilite d'utilisation et canaux</h2><p>${content.faciliteAnalysis}</p></section>
                <section class="content-block fade-in-up"><h2>Service client et support</h2><p>${content.supportAnalysis}</p></section>
                <section class="content-block fade-in-up"><h2>Quelle plateforme choisir selon ta situation ?</h2>
                    <div class="verdict-by-profile">
                        <div class="profile-card"><h3><i class="fas fa-wallet" style="color:#D4AF37;margin-right:8px;"></i> Budget serre</h3><p>${comp.verdictBudget}</p></div>
                        <div class="profile-card"><h3><i class="fas fa-users" style="color:#D4AF37;margin-right:8px;"></i> Large choix</h3><p>${comp.verdictChoice}</p></div>
                        <div class="profile-card"><h3><i class="fas fa-seedling" style="color:#D4AF37;margin-right:8px;"></i> Premiere consultation</h3><p>${comp.verdictBeginner}</p></div>
                    </div>
                </section>
                <section class="content-block fade-in-up"><h2>Notre verdict</h2>
                    <div class="verdict-box"><h3><i class="fas fa-trophy"></i> ${winner}</h3><div class="verdict-score">${winnerP.rating}/5</div><div class="star-rating" style="font-size:1.5em;margin:10px 0;">${starsHTML(winnerP.rating)}</div><p>${isAuto ? content.verdict : (winner + " est notre recommandation.")}</p></div>
                </section>
                ${ctaCosmospace()}
                <section class="content-block fade-in-up"><h2>Pour aller plus loin</h2><ul>
                    <li><a href="/avis/${pA.slug}/">Avis complet ${A} 2026</a></li>
                    <li><a href="/avis/${pB.slug}/">Avis complet ${B} 2026</a></li>
                    <li><a href="/alternatives/${pA.slug}/">Alternatives a ${A}</a></li>
                    <li><a href="/alternatives/${pB.slug}/">Alternatives a ${B}</a></li>
                    ${relatedLinks}
                    <li><a href="/comparatif/">Tous les comparatifs</a></li>
                </ul></section>
                <section class="faq-section fade-in-up"><h2>FAQ : ${A} vs ${B}</h2><div class="faq-list">${faqHtml}</div></section>
            </article>
            <aside class="sidebar"><div class="sidebar-sticky">
                <div class="cta-box fade-in-right"><h3><i class="fas fa-balance-scale icon-pulse"></i> Comparatif</h3><p style="margin:8px 0;"><strong>${A}</strong> : ${pA.rating}/5</p><p style="margin:8px 0;"><strong>${B}</strong> : ${pB.rating}/5</p><a href="tel:0892686882" class="btn btn-gold btn-block"><i class="fas fa-phone-alt"></i> Consulter</a></div>
                <div class="pillar-link-box fade-in-right stagger-1"><h4>Avis individuels</h4><a href="/avis/${pA.slug}/" class="pillar-link" style="display:block;margin-bottom:8px;"><i class="fas fa-arrow-right"></i> Avis ${A}</a><a href="/avis/${pB.slug}/" class="pillar-link" style="display:block;"><i class="fas fa-arrow-right"></i> Avis ${B}</a></div>
            </div></aside>
        </div></div></section>
    </main>
    ${getFooter()}
</body></html>`;
    return html;
}


function generateAlternativesPage(platform) {
    const p = platform, slug = p.slug, name = p.name;
    const canonicalPath = "/alternatives/" + slug + "/";
    const alternatives = platforms.filter(alt => alt.slug !== slug).sort((a, b) => b.rating - a.rating);
    const top3 = alternatives.slice(0, 3);
    const title = "Les 9 meilleures alternatives a " + name + " en 2026";
    const metaDesc = "Alternatives a " + name + " : les 9 meilleures plateformes de voyance comparees.";
    const myComps = comparisons.filter(c => c.platformA === slug || c.platformB === slug);
    const faq = [
        { q: "Meilleure alternative a " + name + " ?", a: top3[0].name + " avec " + top3[0].rating + "/5." },
        { q: "Alternatives moins cheres ?", a: alternatives.filter(a => a.priceMin < p.priceMin).length > 0 ? "Oui : " + alternatives.filter(a => a.priceMin < p.priceMin).map(a => a.name).join(", ") + "." : "Tarifs comparables." },
        { q: "Combien d'alternatives ?", a: "9 alternatives serieuses." }
    ];
    const schema = { "@context": "https://schema.org", "@graph": [
        { "@type": "BreadcrumbList", "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE_URL + "/" },
            { "@type": "ListItem", "position": 2, "name": "Alternatives", "item": SITE_URL + "/alternatives/" },
            { "@type": "ListItem", "position": 3, "name": "Alternatives a " + name, "item": SITE_URL + canonicalPath }
        ]},
        { "@type": "FAQPage", "mainEntity": faq.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) }
    ]};
    const altCards = alternatives.map((alt, i) => {
        const compSlug = myComps.find(c => (c.platformA === slug && c.platformB === alt.slug) || (c.platformA === alt.slug && c.platformB === slug));
        const compLink = compSlug ? '<p><a href="/avis/' + compSlug.slug + '/">Comparatif ' + name + ' vs ' + alt.name + '</a></p>' : '';
        return '<section class="content-block fade-in-up"><h3>' + (i+1) + '. ' + alt.name + ' - ' + alt.rating + '/5 ' + starsHTML(alt.rating) + '</h3><div class="platform-card"><p><strong>Tarifs :</strong> ' + alt.priceRange + ' | <strong>Voyants :</strong> ' + alt.nbPractitioners + ' | <strong>Dispo :</strong> ' + alt.availability + '</p><p>' + alt.verdict + '</p><p><strong>Ideal pour :</strong> ' + alt.bestFor + '</p><p><strong>Offre :</strong> ' + alt.freeOffer + '</p><p><a href="/avis/' + alt.slug + '/">Avis ' + alt.name + '</a></p>' + compLink + '</div></section>';
    }).join("\n");
    const tableRows = alternatives.map((alt, i) => '<tr><td><strong>' + (i+1) + '</strong></td><td><a href="/avis/' + alt.slug + '/">' + alt.name + '</a></td><td>' + starsHTML(alt.rating) + ' ' + alt.rating + '/5</td><td>' + alt.priceRange + '</td><td>' + alt.nbPractitioners + '</td><td>' + alt.freeOffer + '</td></tr>').join("\n");
    const faqHtml = faq.map(f => '<div class="faq-item"><button class="faq-question" aria-expanded="false"><span>' + f.q + '</span><span class="faq-icon">+</span></button><div class="faq-answer"><p>' + f.a + '</p></div></div>').join("\n");
    const compLinks = myComps.map(c => { const cA = getPlatform(c.platformA), cB = getPlatform(c.platformB); return '<li><a href="/avis/' + c.slug + '/">' + cA.name + ' vs ' + cB.name + '</a></li>'; }).join("\n");

    const html = getHead(title, metaDesc, canonicalPath, schema) + `
<body>
    ${getHeader()}
    <main>
        <nav class="breadcrumbs" aria-label="Fil d'Ariane"><div class="container"><a href="/">Accueil</a> <span class="separator">&rsaquo;</span> <a href="/comparatif/">Comparatifs</a> <span class="separator">&rsaquo;</span> <span class="current">Alternatives a ${name}</span></div></nav>
        <section class="local-hero"><div class="container"><h1 class="fade-in-up">Les 9 meilleures alternatives a ${name} en 2026</h1><p class="hero-subtitle fade-in-up stagger-1">Comparatif des meilleures plateformes pour remplacer ${name}</p></div></section>
        <section class="content-section"><div class="container"><div class="content-grid">
            <article class="main-content">
                <div class="review-tldr fade-in-up"><h3><i class="fas fa-bolt"></i> Top 3 alternatives</h3><p><strong>#1 ${top3[0].name}</strong> - ${top3[0].rating}/5 - ${top3[0].freeOffer}</p><p><strong>#2 ${top3[1].name}</strong> - ${top3[1].rating}/5 - ${top3[1].freeOffer}</p><p><strong>#3 ${top3[2].name}</strong> - ${top3[2].rating}/5 - ${top3[2].freeOffer}</p></div>
                ${ctaCosmospace()}
                <section class="content-block fade-in-up"><h2>Pourquoi chercher une alternative a ${name} ?</h2><p>${name} (${p.rating}/5) a ses qualites mais ne convient pas a tout le monde. Tarifs (${p.priceRange}), disponibilite (${p.availability}), canaux (${p.channels.join(", ")}) : il existe des alternatives qui correspondent mieux a certains besoins.</p><p>Voici les 9 meilleures alternatives, classees par note.</p></section>
                <section class="content-block fade-in-up"><h2>Classement des alternatives</h2></section>
                ${altCards}
                <section class="content-block fade-in-up"><h2>Tableau recapitulatif</h2><div class="table-responsive"><table class="ranking-table"><thead><tr><th>#</th><th>Plateforme</th><th>Note</th><th>Tarifs</th><th>Voyants</th><th>Offre</th></tr></thead><tbody>${tableRows}</tbody></table></div></section>
                ${ctaCosmospace()}
                <section class="content-block fade-in-up"><h2>Comment choisir</h2><p>Identifie ce qui te manque chez ${name}. Prix ? Regarde les alternatives abordables. Qualite ? Regarde les notes. Disponibilite ? Privilegie le 24h/24. Profite des offres de bienvenue pour tester.</p></section>
                <section class="content-block fade-in-up"><h2>Comparatifs avec ${name}</h2><ul>${compLinks}</ul><p><a href="/comparatif/">Tous les comparatifs</a></p></section>
                <section class="faq-section fade-in-up"><h2>FAQ</h2><div class="faq-list">${faqHtml}</div></section>
                ${ctaCosmospace()}
            </article>
            <aside class="sidebar"><div class="sidebar-sticky"><div class="cta-box fade-in-right"><h3><i class="fas fa-star icon-pulse"></i> Alternative #1</h3><p><strong>${top3[0].name}</strong> ${top3[0].rating}/5</p><p style="font-size:0.9em;">${top3[0].freeOffer}</p><a href="tel:0892686882" class="btn btn-gold btn-block"><i class="fas fa-phone-alt"></i> Consulter</a></div></div></aside>
        </div></div></section>
    </main>
    ${getFooter()}
</body></html>`;
    return html;
}


function generateHubPage() {
    const canonicalPath = "/comparatif/";
    const title = "Top 10 Meilleurs Sites de Voyance 2026 : Avis";
    const metaDesc = "Classement complet des 10 meilleures plateformes de voyance en ligne en 2026. Tableau comparatif, avis, tarifs et 45 comparatifs detailles.";
    const sorted = [...platforms].sort((a, b) => b.rating - a.rating);
    const schema = { "@context": "https://schema.org", "@graph": [
        { "@type": "BreadcrumbList", "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Accueil", "item": SITE_URL + "/" },
            { "@type": "ListItem", "position": 2, "name": "Comparatifs", "item": SITE_URL + canonicalPath }
        ]},
        { "@type": "Article", "headline": title, "author": { "@type": "Organization", "name": "France Voyance Avenir" }, "datePublished": "2026-02-01", "dateModified": "2026-03-01" },
        { "@type": "ItemList", "itemListElement": sorted.map((p, i) => ({ "@type": "ListItem", "position": i+1, "name": p.name, "url": SITE_URL + "/avis/" + p.slug + "/" })) }
    ]};
    const tableRows = sorted.map((p, i) => '<tr><td><strong>' + (i+1) + '</strong></td><td><a href="/avis/' + p.slug + '/">' + p.name + '</a></td><td>' + starsHTML(p.rating) + ' ' + p.rating + '/5</td><td>' + p.priceRange + '</td><td>' + p.nbPractitioners + '</td><td>' + p.freeOffer + '</td></tr>').join("\n");
    const compsByPlatform = {};
    platforms.forEach(p => { compsByPlatform[p.slug] = []; });
    comparisons.forEach(c => { compsByPlatform[c.platformA].push(c); compsByPlatform[c.platformB].push(c); });
    const compSections = platforms.map(p => {
        const myComps = compsByPlatform[p.slug];
        const links = myComps.map(c => { const cA = getPlatform(c.platformA), cB = getPlatform(c.platformB); return '<a href="/avis/' + c.slug + '/" class="hub-link"><i class="fas fa-balance-scale"></i> ' + cA.name + ' vs ' + cB.name + '</a>'; }).join("\n");
        return '<h3>' + p.name + ' (' + myComps.length + ' comparatifs)</h3><div class="hub-links">' + links + '</div><p><a href="/alternatives/' + p.slug + '/">Alternatives a ' + p.name + '</a></p>';
    }).join("\n");

    const avisLinks = platforms.map(p => '<li><a href="/avis/' + p.slug + '/">Avis ' + p.name + ' 2026</a></li>').join("\n");

    // Detailed platform cards
    const platformCards = sorted.map((p, i) => {
        const pros = p.pros ? p.pros.slice(0, 3).map(pro => '<li><i class="fas fa-check" style="color:#2ecc71;margin-right:8px;"></i>' + pro + '</li>').join('') : '';
        const cons = p.cons ? p.cons.slice(0, 2).map(con => '<li><i class="fas fa-times" style="color:#e74c3c;margin-right:8px;"></i>' + con + '</li>').join('') : '';
        const isCosmo = p.slug === 'cosmospace';
        const ctaHTML = isCosmo
            ? '<a href="tel:0892686882" class="btn btn-gold btn-block" style="margin-top:15px;"><i class="fas fa-phone-alt"></i> 08 92 68 68 82 (code 1211)</a><p style="font-size:0.8em;opacity:0.7;text-align:center;margin-top:5px;">0,80€/min + prix appel</p>'
            : (p.isAffiliate ? '<a href="javascript:void(0)" onclick="window.open(getAffiliateUrl(),\'_blank\');return false;" data-affiliate="default" class="btn btn-gold btn-block" style="margin-top:15px;"><i class="fas fa-external-link-alt"></i> Essayer ' + p.name + '</a>' : '<a href="/avis/' + p.slug + '/" class="btn btn-gold btn-block" style="margin-top:15px;">Voir l\'avis complet</a>');
        return `
            <div class="platform-detail-card" style="background:#fff;border-radius:12px;padding:25px;margin-bottom:25px;box-shadow:0 4px 15px rgba(0,0,0,0.08);border-left:4px solid #D4AF37;">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:15px;margin-bottom:15px;">
                    <h3 style="color:#4A1A6B;margin:0;font-size:1.3em;">#${i+1} ${p.name}</h3>
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="font-size:1.1em;font-weight:700;color:#D4AF37;">${starsHTML(p.rating)} ${p.rating}/5</span>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:15px;">
                    <div><strong style="color:#4A1A6B;"><i class="fas fa-euro-sign" style="margin-right:5px;"></i>Tarifs :</strong> <span style="color:#555;">${p.priceRange}</span></div>
                    <div><strong style="color:#4A1A6B;"><i class="fas fa-users" style="margin-right:5px;"></i>Voyants :</strong> <span style="color:#555;">${p.nbPractitioners}</span></div>
                    <div><strong style="color:#4A1A6B;"><i class="fas fa-gift" style="margin-right:5px;"></i>Offre :</strong> <span style="color:#555;">${p.freeOffer}</span></div>
                    <div><strong style="color:#4A1A6B;"><i class="fas fa-clock" style="margin-right:5px;"></i>Disponibilite :</strong> <span style="color:#555;">${p.availability || '24h/24'}</span></div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;">
                    <div><h4 style="color:#2ecc71;font-size:0.95em;margin-bottom:8px;"><i class="fas fa-plus-circle"></i> Points forts</h4><ul style="list-style:none;padding:0;margin:0;font-size:0.9em;color:#555;">${pros}</ul></div>
                    <div><h4 style="color:#e74c3c;font-size:0.95em;margin-bottom:8px;"><i class="fas fa-minus-circle"></i> Points faibles</h4><ul style="list-style:none;padding:0;margin:0;font-size:0.9em;color:#555;">${cons}</ul></div>
                </div>
                ${ctaHTML}
            </div>`;
    }).join("\n");

    const html = getHead(title, metaDesc, canonicalPath, schema) + `
<body>
    ${getHeader()}
    <main>
        <nav class="breadcrumbs" aria-label="Fil d'Ariane"><div class="container"><a href="/">Accueil</a> <span class="separator">&rsaquo;</span> <span class="current">Comparatifs</span></div></nav>
        <section class="local-hero"><div class="container"><h1 class="fade-in-up">Classement des meilleures plateformes de voyance en 2026</h1><p class="hero-subtitle fade-in-up stagger-1">Tableau comparatif, avis detailles, tarifs et 45 comparatifs face-a-face</p></div></section>
        <section class="content-section"><div class="container"><div class="content-grid">
            <article class="main-content">
                <div class="review-tldr fade-in-up"><h3><i class="fas fa-bolt"></i> Top 3 plateformes</h3><p><strong>#1 ${sorted[0].name}</strong> - ${sorted[0].rating}/5 - ${sorted[0].freeOffer}</p><p><strong>#2 ${sorted[1].name}</strong> - ${sorted[1].rating}/5 - ${sorted[1].freeOffer}</p><p><strong>#3 ${sorted[2].name}</strong> - ${sorted[2].rating}/5 - ${sorted[2].freeOffer}</p></div>
                ${ctaCosmospace()}
                <section class="content-block fade-in-up"><h2>Classement general des 10 plateformes</h2><div class="table-responsive"><table class="ranking-table"><thead><tr><th>#</th><th>Plateforme</th><th>Note</th><th>Tarifs</th><th>Voyants</th><th>Offre</th></tr></thead><tbody>${tableRows}</tbody></table></div></section>
                <section class="content-block fade-in-up"><h2>Classement detaille : avis sur chaque plateforme</h2><p>Retrouve ci-dessous le detail de chaque plateforme avec ses points forts, ses tarifs et son offre decouverte.</p>${platformCards}</section>
                ${ctaCosmospace()}
                <section class="content-block fade-in-up"><h2>Tous les comparatifs par plateforme</h2><p>45 comparatifs detailles pour comparer chaque paire de plateformes.</p>${compSections}</section>
                ${ctaCosmospace()}
                <section class="content-block fade-in-up"><h2>Avis individuels</h2><ul>${avisLinks}</ul></section>
                ${ctaCosmospace()}
            </article>
            <aside class="sidebar"><div class="sidebar-sticky"><div class="cta-box fade-in-right"><h3><i class="fas fa-star icon-pulse"></i> Notre #1</h3><p><strong>${sorted[0].name}</strong> ${sorted[0].rating}/5</p><p style="font-size:0.9em;">${sorted[0].freeOffer}</p><a href="tel:0892686882" class="btn btn-gold btn-block"><i class="fas fa-phone-alt"></i> Consulter</a></div></div></aside>
        </div></div></section>
    </main>
    ${getFooter()}
</body></html>`;
    return html;
}


// ── MAIN EXECUTION ──────────────────────────────────────────────
console.log("Generating all pages...");
console.log("Platforms: " + platforms.length);
console.log("Comparisons: " + comparisons.length);

let count = 0;

// 1. Generate 45 comparison pages
comparisons.forEach(comp => {
    const html = generateComparisonPage(comp);
    const dir = path.join(__dirname, "avis", comp.slug);
    ensureDir(dir);
    fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
    count++;
});
console.log("Comparison pages: " + count);

// 2. Generate 10 alternatives pages
let altCount = 0;
platforms.forEach(p => {
    const html = generateAlternativesPage(p);
    const dir = path.join(__dirname, "alternatives", p.slug);
    ensureDir(dir);
    fs.writeFileSync(path.join(dir, "index.html"), html, "utf8");
    altCount++;
});
console.log("Alternatives pages: " + altCount);
count += altCount;

// 3. Generate hub page
const hubHtml = generateHubPage();
const hubDir = path.join(__dirname, "comparatif");
ensureDir(hubDir);
fs.writeFileSync(path.join(hubDir, "index.html"), hubHtml, "utf8");
count++;
console.log("Hub page: 1");

console.log("Total pages generated: " + count);
console.log("Done!");
