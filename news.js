// news.js - 홈 화면에 산업연관분석 관련 뉴스 목록을 보여준다 (news.json을 읽어 표시)
(function () {
  'use strict';
  const home = document.getElementById('page-main');
  if (!home) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const SHOW = 6;   // 처음에 보여줄 기사 수

  const style = document.createElement('style');
  style.textContent =
    '.news-card{margin:24px 0}' +
    '.news-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:6px}' +
    '.news-head h2{margin:0}.news-updated{font-size:.82rem;color:var(--muted,#7a6f63)}' +
    '.news-list{list-style:none;margin:8px 0 0;padding:0}' +
    '.news-list li{border-top:1px solid var(--rule,#e6e2d6)}' +
    '.news-list li:first-child{border-top:0}' +
    '.news-item{display:block;padding:12px 10px;border-radius:12px;text-decoration:none;color:inherit}' +
    '.news-item:hover{background:var(--cream2,#f3efe4)}' +
    '.news-title{display:block;font-weight:700;line-height:1.5}' +
    '.news-meta{display:block;margin-top:2px;font-size:.84rem;color:var(--muted,#7a6f63)}' +
    '.news-more{margin-top:10px}';
  document.head.append(style);

  const card = document.createElement('section');
  card.className = 'news-card';
  card.innerHTML = '<div class="news-head"><h2>산업연관분석 뉴스</h2><span class="news-updated" id="news-updated"></span></div>' +
    '<p class="note" id="news-note">뉴스를 불러오는 중입니다…</p><ul class="news-list" id="news-list"></ul><div id="news-more"></div>';
  const guideTitle = Array.from(home.querySelectorAll('h2')).find((h) => h.textContent.trim() === '이용 안내');
  if (guideTitle) home.insertBefore(card, guideTitle); else home.append(card);

  const fmtDate = (d) => (d ? d.replace(/-/g, '.') : '');
  function render(items, all) {
    const list = document.getElementById('news-list');
    list.innerHTML = (all ? items : items.slice(0, SHOW)).map((a) =>
      `<li><a class="news-item" href="${esc(a.link)}" target="_blank" rel="noopener noreferrer"><span class="news-title">${esc(a.title)}</span><span class="news-meta">${esc([a.source, fmtDate(a.date)].filter(Boolean).join(' · '))}</span></a></li>`
    ).join('');
    const more = document.getElementById('news-more');
    more.innerHTML = !all && items.length > SHOW ? `<button type="button" class="news-more">기사 ${items.length - SHOW}건 더 보기</button>` : '';
    const b = more.querySelector('button');
    if (b) b.addEventListener('click', () => render(items, true));
  }

  fetch('./news.json', { cache: 'no-cache' })
    .then((r) => { if (!r.ok) throw Error('HTTP ' + r.status); return r.json(); })
    .then((d) => {
      const items = (d.items || []).filter((a) => a && a.title && /^https?:\/\//.test(a.link));
      if (!items.length) throw Error('기사 없음');
      document.getElementById('news-note').remove();
      document.getElementById('news-updated').textContent = d.updatedAt ? '갱신 ' + d.updatedAt : '';
      render(items, false);
    })
    .catch((e) => {
      document.getElementById('news-note').textContent = '뉴스를 불러오지 못했습니다. (' + e.message + ')';
    });
})();
