import "../lib/fonts/_active.css";
import "../lib/fonts/_vars.css";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Default Setting",
  description: "Webサイト制作用の初期設定環境",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className="antialiased font-body"
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EE10HG4BBW"
          strategy="afterInteractive"
        />
        <Script id="ga4-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EE10HG4BBW');
          `}
        </Script>
        <Script id="ga4-cvr-events" strategy="afterInteractive">
          {`
            (function() {
              function detectPosition(el) {
                var node = el;
                while (node && node !== document.body) {
                  var tag = (node.tagName || '').toLowerCase();
                  if (tag === 'header' || tag === 'nav' || tag === 'footer' || tag === 'main' || tag === 'aside') {
                    return tag === 'aside' ? 'sidebar' : tag;
                  }
                  var cls = ((node.className && typeof node.className === 'string') ? node.className : '').toLowerCase();
                  var id = (node.id || '').toLowerCase();
                  var combined = cls + ' ' + id;
                  if (/header|masthead/.test(combined)) return 'header';
                  if (/nav|navbar|navigation|menu|gnav/.test(combined)) return 'nav';
                  if (/hero|jumbotron|banner|key-visual|kv|mv|main-visual|first-view|fv/.test(combined)) return 'hero';
                  if (/sidebar|side-bar|widget/.test(combined)) return 'sidebar';
                  if (/footer|colophon/.test(combined)) return 'footer';
                  if (/main-content|page-content/.test(combined)) return 'main';
                  node = node.parentElement;
                }
                return 'other';
              }

              function detectCtaType(href) {
                if (/line\\.me|line\\.naver\\.jp/i.test(href)) return 'line';
                if (/docs\\.google\\.com\\/forms|forms\\.office\\.com|typeform\\.com|jotform\\.com|wufoo\\.com/i.test(href)) return 'external_form';
                if (/^tel:/i.test(href)) return 'tel';
                if (/^mailto:/i.test(href)) return 'mailto';
                return null;
              }

              function isExternalLink(href) {
                try {
                  var link = new URL(href, window.location.origin);
                  return link.hostname !== window.location.hostname;
                } catch(e) { return false; }
              }

              document.addEventListener('click', function(e) {
                var a = e.target.closest('a');
                if (!a || !a.href) return;
                var href = a.href;
                var ctaType = detectCtaType(href);
                if (!ctaType && isExternalLink(href)) ctaType = 'external';
                if (!ctaType) return;
                var position = detectPosition(a);
                var eventName = 'cta_' + ctaType + '_' + position;
                if (typeof gtag === 'function') gtag('event', eventName, { link_url: href, cta_type: ctaType, cta_position: position });
              });
              document.addEventListener('click', function(e) {
                var a = e.target.closest ? e.target.closest('a') : null;
                if (a && a.href) return;
                var el = e.target.closest ? e.target.closest('button, [role="button"], div, span') : e.target;
                if (!el) return;
                var text = (el.textContent || '').trim();
                var cls = ((el.className && typeof el.className === 'string') ? el.className : '').toLowerCase();
                var elId = (el.id || '').toLowerCase();
                var ctaType = null;
                if (/LINE|ライン/i.test(text) || /\\bline[-_]?(?:btn|button|cta|link|banner|add)\\b/i.test(cls + ' ' + elId)) ctaType = 'line';
                if (!ctaType) return;
                var position = detectPosition(el);
                if (typeof gtag === 'function') gtag('event', 'cta_' + ctaType + '_' + position, { cta_type: ctaType, cta_position: position });
              });
              var CONTACT_KW = /contact|inquiry|enquiry|お問い合わせ|問い合わせ|お問合せ|問合せ|consultation|相談|資料請求|見積|応募|エントリー|申し込み|申込/i;
              var EXCLUDE_KW = /search|login|signin|sign-in|signup|sign-up|register|subscribe|newsletter|ログイン|検索|新規登録/i;
              var SUBMIT_TEXT = /送信|submit|お問い合わせ|問い合わせ|申し込み|申込|応募|エントリー|確認|confirm/i;
              function getContactContext(el) {
                var node = el;
                while (node && node !== document.body) {
                  var attr = ((node.className && typeof node.className === 'string') ? node.className : '') + ' ' + (node.id || '');
                  if (EXCLUDE_KW.test(attr)) return false;
                  if (CONTACT_KW.test(attr)) return true;
                  node = node.parentElement;
                }
                return false;
              }
              function isContactForm(form) {
                if (form.querySelector('input[type="password"]')) return false;
                var fa = ((form.action || '') + ' ' + ((form.className && typeof form.className === 'string') ? form.className : '') + ' ' + (form.id || '') + ' ' + (form.name || '')).toLowerCase();
                if (EXCLUDE_KW.test(fa)) return false;
                if (CONTACT_KW.test(fa)) return true;
                if (getContactContext(form.parentElement)) return true;
                if (form.querySelector('textarea') && form.querySelector('input[type="email"], input[name*="email"], input[name*="mail"]')) return true;
                return false;
              }
              document.addEventListener('submit', function(e) {
                var form = e.target;
                if (!form || form.tagName !== 'FORM') return;
                if (!isContactForm(form)) return;
                var position = detectPosition(form);
                if (typeof gtag === 'function') gtag('event', 'form_submit_contact_' + position, { cta_type: 'contact_form', cta_position: position, transport_type: 'beacon' });
              });
              document.addEventListener('click', function(e) {
                var btn = e.target.closest ? e.target.closest('button, input[type="submit"]') : null;
                if (!btn || btn.closest('form')) return;
                var btnText = (btn.textContent || btn.value || '').trim();
                if (!SUBMIT_TEXT.test(btnText)) return;
                if (!getContactContext(btn)) return;
                var position = detectPosition(btn);
                if (typeof gtag === 'function') gtag('event', 'form_submit_contact_' + position, { cta_type: 'contact_form', cta_position: position, transport_type: 'beacon' });
              });
            })();
          `}
        </Script>
      
        {children}
        <Script
          src="https://site-annotator.vercel.app/tracker.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
