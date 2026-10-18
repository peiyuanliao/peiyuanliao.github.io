(() => {
  'use strict';
  const p = window.ACADEMIC_PROFILE;
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = value => { try { const url = new URL(value, location.href); return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? url.href : null; } catch { return null; } };
  const link = item => { const url = safeUrl(item.url); return url ? `<a href="${esc(url)}">${esc(item.label)}</a>` : ''; };
  document.title = `${p.name} | ${p.institution}`;
  document.querySelector('meta[name=description]').content = p.description || '';
  for (const key of ['name', 'role', 'invitation']) {
    $(key).textContent = p[key] || '';
    $(key).hidden = !p[key];
  }
  $('affiliation').innerHTML = [p.department,p.institution].filter(Boolean).map(t=>`<span>${esc(t)}</span>`).join('');
  $('email').textContent = p.email || '';
  if (p.email) $('email').href = `mailto:${p.email}`; else $('email').hidden = true;
  $('profile-links').innerHTML = (p.links || []).map(link).join('');
  $('biography').innerHTML = (p.about || []).map(text => `<p>${esc(text)}</p>`).join('');
  $('news-list').innerHTML = (p.news || []).map(n => `<li><strong>[${esc(n.date)}]</strong> ${esc(n.text)}</li>`).join('');
  $('talks-list').innerHTML = (p.talks || []).map(t => `<li>${esc(t.title)}<span class="event-meta">${[t.event,t.date,t.location].filter(Boolean).map(esc).join(', ')}</span></li>`).join('');
  $('teaching-list').innerHTML = (p.teaching || []).map(t => `<li>${esc(t.role)}, <strong>${esc(t.title)}</strong>, ${esc(t.institution)}, ${esc(t.term)}</li>`).join('');
  $('copyright').textContent = `© ${new Date().getFullYear()} ${p.name}`;
  $('demo-note').hidden = !p.demo;
  const sections = [['about','About'],['publications','Publications'],['talks','Talks'],['teaching','Teaching']].filter(([id]) => {
    const visible = id === 'about' || p[id]?.length;
    $(id).hidden = !visible;
    return visible;
  });
  $('news').hidden = !p.news?.length;
  $('navigation').innerHTML = sections.map(([id,label])=>`<a href="#${id}">${label}</a>`).join('');
  $('publication-list').innerHTML = [...(p.publications || [])].sort((a,b)=>b.year-a.year).map(a=>`<article class="publication">
    <h3>${safeUrl(a.url) && a.url ? `<a href="${esc(safeUrl(a.url))}">${esc(a.title)}</a>` : esc(a.title)}</h3>
    <p>${a.authors.map(n=>n===p.name?`<strong>${esc(n)}</strong>`:esc(n)).join(', ')}</p>
    <p class="venue">${esc(a.venue)}, ${esc(a.year)}.</p>
    ${(a.links||[]).length?`<div class="paper-links">${a.links.map(link).join('')}</div>`:''}
    ${a.bibtex?`<details><summary>BibTeX</summary><pre>${esc(a.bibtex)}</pre></details>`:''}
  </article>`).join('');
})();
