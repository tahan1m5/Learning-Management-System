const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const ICONS = {
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  library: '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="m16 8-3 5-5 3 3-5 5-3Z"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z"/>',
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z"/><circle cx="12" cy="12" r="3"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4Z"/>',
};
const icon = (name, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
const cover = id => `https://img.anili.st/media/${id}`;

const seedLibrary = [
  { id:'solo', anilist:105398, title:'Solo Leveling', format:'Manhwa', year:2018, status:'Reading', chapter:143, total:200, score:9, favorite:true, genres:['Action','Fantasy','Dungeon'], author:'Chugong', description:'In a world where hunters battle deadly monsters, the weakest hunter gains the ability to level up without limits.', review:'Pure momentum. Every arc feels bigger than the last, and the art makes each power-up land.', added:'2026-11-12' },
  { id:'villainess', anilist:101517, title:'Villains Are Destined to Die', format:'Manhwa', year:2020, status:'Reading', chapter:92, total:160, score:9, favorite:true, genres:['Romance','Fantasy','Villainess'], author:'SUOL', description:'A woman wakes inside a brutal romance game as its most hated villainess, where every choice can end in death.', review:'Penelope is sharp, complicated, and impossible not to root for. The color work is gorgeous.', added:'2026-11-09' },
  { id:'orv', anilist:119257, title:'Omniscient Reader', format:'Manhwa', year:2020, status:'Reading', chapter:176, total:240, score:10, favorite:true, genres:['Action','Apocalypse','Fantasy'], author:'sing N song', description:'The only reader of an obscure web novel watches its world become reality—and knows exactly how the story ends.', review:'A story about stories, readers, and the terrifying cost of knowing what comes next.', added:'2026-10-29' },
  { id:'witchhat', anilist:85486, title:'Witch Hat Atelier', format:'Manga', year:2016, status:'Plan to Read', chapter:0, total:84, score:0, favorite:false, genres:['Fantasy','Magic','Adventure'], author:'Kamome Shirahama', description:'A girl who dreams of magic discovers that spells are drawn, not inherited, and enters a breathtaking hidden world.', review:'', added:'2026-10-24' },
  { id:'blueperiod', anilist:107237, title:'Blue Period', format:'Manga', year:2017, status:'On Hold', chapter:38, total:72, score:8, favorite:false, genres:['Drama','Art','Coming of Age'], author:'Tsubasa Yamaguchi', description:'A restless high-schooler discovers painting and throws himself into the demanding world of fine art.', review:'Honest about the joy, jealousy, and sheer labor behind making art.', added:'2026-09-17' },
  { id:'spy', anilist:108556, title:'Spy × Family', format:'Manga', year:2019, status:'Reading', chapter:79, total:112, score:8, favorite:false, genres:['Comedy','Action','Family'], author:'Tatsuya Endo', description:'A spy, an assassin, and a telepath create a fake family while keeping their secret lives from one another.', review:'Warm, funny, and effortlessly charming whenever the Forger family is together.', added:'2026-09-02' },
  { id:'berserk', anilist:30002, title:'Berserk', format:'Manga', year:1989, status:'On Hold', chapter:208, total:376, score:10, favorite:true, genres:['Dark Fantasy','Action','Drama'], author:'Kentaro Miura', description:'A lone swordsman marked by tragedy fights through a merciless medieval world of ambition and monsters.', review:'Unmatched visual storytelling. Devastating, immense, and deeply human beneath all the darkness.', added:'2026-08-11' },
  { id:'opm', anilist:30013, title:'One-Punch Man', format:'Manga', year:2012, status:'Completed', chapter:204, total:204, score:8, favorite:false, genres:['Action','Comedy','Superhero'], author:'ONE & Yusuke Murata', description:'A hero who defeats every enemy with one punch searches for a challenge—and meaning in his strange profession.', review:'The spectacle is absurdly good, but Saitama’s boredom is still the best joke.', added:'2026-07-30' },
  { id:'monster', anilist:30001, title:'Monster', format:'Manga', year:1994, status:'Completed', chapter:162, total:162, score:10, favorite:true, genres:['Thriller','Mystery','Psychological'], author:'Naoki Urasawa', description:'A brilliant surgeon saves a young boy, only to learn that his choice may have unleashed a monster.', review:'A patient, morally complex thriller where even the smallest side character feels alive.', added:'2026-06-18' },
];

const catalog = [
  {anilist:113415,title:'The Guy She Was Interested in Wasn’t a Guy at All',format:'Manga',year:2022,genres:['Romance','Music'],author:'Sumiko Arai',reason:'Because you rated character-driven drama highly'},
  {anilist:122663,title:'The Remarried Empress',format:'Manhwa',year:2019,genres:['Romance','Fantasy'],author:'Alphatart',reason:'Matches your Romance and Villainess tags'},
  {anilist:126287,title:'The Greatest Estate Developer',format:'Manhwa',year:2021,genres:['Comedy','Fantasy'],author:'BK_Moon',reason:'Readers of Omniscient Reader also enjoy this'},
  {anilist:100388,title:'The Apothecary Diaries',format:'Manga',year:2017,genres:['Mystery','Historical'],author:'Natsu Hyuuga',reason:'A clever lead and layered mystery'},
  {anilist:104578,title:'Skip and Loafer',format:'Manga',year:2018,genres:['Slice of Life','Romance'],author:'Misaki Takamatsu',reason:'A warm change of pace for your journal'},
  {anilist:109731,title:'A Stepmother’s Märchen',format:'Manhwa',year:2019,genres:['Drama','Fantasy'],author:'ORKA',reason:'Matches your Fantasy and Drama taste'},
  {anilist:118586,title:'Dandadan',format:'Manga',year:2021,genres:['Action','Comedy'],author:'Yukinobu Tatsu',reason:'Fast action with eccentric characters'},
  {anilist:101517,title:'Heaven Official’s Blessing',format:'Manhua',year:2019,genres:['Fantasy','Romance'],author:'STARember',reason:'A lush fantasy with striking artwork'},
  {anilist:99114,title:'Yona of the Dawn',format:'Manga',year:2009,genres:['Fantasy','Adventure'],author:'Mizuho Kusanagi',reason:'For your character-driven fantasy shelf'},
  {anilist:98444,title:'My In-Laws Are Obsessed With Me',format:'Manhwa',year:2021,genres:['Romance','Fantasy'],author:'Han Yoon seol',reason:'Matches your slow-burn romance taste'},
  {anilist:13318,title:'The Summer Hikaru Died',format:'Manga',year:2021,genres:['Horror','Mystery'],author:'Mokumokuren',reason:'A haunting psychological mystery'},
  {anilist:87395,title:'Made in Abyss',format:'Manga',year:2012,genres:['Adventure','Dark Fantasy'],author:'Akihito Tsukushi',reason:'For your darker fantasy shelf'},
].map((x,i)=>({...x,id:`catalog-${i}`,chapter:0,total:0,score:0,status:'Plan to Read',favorite:false,description:`Discover ${x.title}, a ${x.format.toLowerCase()} by ${x.author}.`,review:'',added:'2026-11-14'}));

const defaultState = { page:'home', library:seedLibrary, query:'', status:'All', format:'All', view:'grid', galleries:{solo:[{url:'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80',caption:'Late-night reading mood'}]}, collections:['Favorites','Comfort reads','Beautiful art'], tags:['slow burn','found family','villainess','great art'] };
let state;
try { state = JSON.parse(localStorage.getItem('inklog:v1')) || structuredClone(defaultState); } catch { state = structuredClone(defaultState); }
state = {...structuredClone(defaultState),...state};

const save = () => localStorage.setItem('inklog:v1', JSON.stringify(state));
const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const pct = m => m.total ? Math.min(100, Math.round(m.chapter / m.total * 100)) : Math.min(100, m.chapter ? 70 : 0);
const toast = message => { const root=$('#toast-root'); root.innerHTML=`<div class="toast">${esc(message)}</div>`; setTimeout(()=>root.innerHTML='',2400); };

function navButton(page,label,ico){ return `<button class="nav-button ${state.page===page?'active':''}" data-page="${page}">${icon(ico)}<span>${label}</span></button>`; }
function shell(content){
  return `<div class="app-shell">
    <aside class="sidebar">
      <div class="brand"><div class="brand-mark">${icon('book')}</div><div class="brand-name">Ink<span>log</span></div></div>
      <nav class="nav-list">${navButton('home','Home','home')}${navButton('library','My library','library')}${navButton('explore','Explore','compass')}${navButton('journal','Journal','pen')}</nav>
      <div class="sidebar-foot"><button class="nav-button" data-settings>${icon('settings')}<span>Settings</span></button><div class="profile-mini"><div class="avatar">M</div><div><strong>My journal</strong><span>Private library</span></div></div></div>
    </aside>
    <main class="main"><div class="mobile-top"><div class="brand"><div class="brand-mark">${icon('book')}</div><div class="brand-name">Ink<span>log</span></div></div><button class="button icon ghost" data-settings aria-label="Settings">${icon('settings')}</button></div>${content}</main>
    <nav class="mobile-nav">${navButton('home','Home','home')}${navButton('library','Library','library')}${navButton('explore','Explore','compass')}${navButton('journal','Journal','pen')}</nav>
    <button class="fab" data-add aria-label="Add manga">${icon('plus')}</button>
  </div>`;
}

function mangaCard(m, discover=false){
  const exists=state.library.some(x=>x.anilist===m.anilist);
  return `<article class="manga-card" data-detail="${m.id}">
    <div class="cover-wrap"><img src="${cover(m.anilist)}" alt="Cover of ${esc(m.title)}" loading="lazy" onerror="this.src='https://placehold.co/500x750/2d2338/cab0ff?text=${encodeURIComponent(m.title)}'"/>
      <span class="cover-badge ${discover&&!exists?'pink':''}">${discover?(exists?'In library':m.format):m.status}</span>
      ${discover&&!exists?`<div class="cover-actions"><button class="quick-add" data-quick-add="${m.id}" aria-label="Add ${esc(m.title)}">${icon('plus')}</button></div>`:''}
    </div>
    <h3>${esc(m.title)}</h3>
    <div class="card-meta"><span>${esc(m.format)} · ${m.year}</span>${m.score?`<span class="rating">${icon('star')}${m.score}</span>`:''}</div>
    ${discover?`<div class="reason">${esc(m.reason||'Picked for your journal')}</div>`:''}
  </article>`;
}

function continueCard(m){ return `<article class="continue-card"><img src="${cover(m.anilist)}" alt="${esc(m.title)}" data-detail="${m.id}"/><div class="continue-info"><h3 data-detail="${m.id}">${esc(m.title)}</h3><span class="meta">Chapter ${m.chapter}${m.total?` of ${m.total}`:''}</span><div class="progress"><span style="width:${pct(m)}%"></span></div><div class="progress-row"><span>${pct(m)}% read</span><span>${m.format}</span></div><button class="chapter-button" data-plus-chapter="${m.id}">+ 1 chapter</button></div></article>`; }

function homePage(){
  const reading=state.library.filter(x=>x.status==='Reading').slice(0,3);
  const recent=[...state.library].sort((a,b)=>b.added.localeCompare(a.added)).slice(0,6);
  return shell(`<div class="page">
    <div class="page-head"><div><div class="eyebrow">Your private reading space</div><h1>Good evening, reader.</h1><p class="subtext">Pick up where you left off or make a note while it is fresh.</p></div><div class="head-actions"><div class="search">${icon('search')}<input data-global-search placeholder="Search your library" value="${esc(state.query)}"/></div><button class="button primary" data-add>${icon('plus')} Add manga</button></div></div>
    <section class="hero"><div class="hero-copy"><div class="eyebrow">This week · 16 chapters</div><h1>Your stories, kept <em>beautifully.</em></h1><p>Track every chapter, save the panels you love, and remember what each story made you feel.</p><div class="hero-actions"><button class="button primary" data-page="library">Open my library ${icon('chevron')}</button><button class="button ghost" data-page="journal">Write a review</button></div></div><div class="hero-stack">${recent.slice(0,3).map(m=>`<img src="${cover(m.anilist)}" alt=""/>`).join('')}</div></section>
    <section class="section"><div class="section-head"><div class="section-title"><h2>Continue reading</h2><p>Your current stories, right where you left them.</p></div><button class="text-button" data-page="library">View library →</button></div><div class="continue-grid">${reading.map(continueCard).join('')}</div></section>
    <section class="section"><div class="section-head"><div class="section-title"><h2>Recently shelved</h2><p>The newest additions to your journal.</p></div><button class="text-button" data-page="explore">Find something new →</button></div><div class="shelf-grid">${recent.map(m=>mangaCard(m)).join('')}</div></section>
  </div>`);
}

function libraryPage(){
  const statuses=['All','Reading','Plan to Read','Completed','On Hold','Dropped'];
  const formats=['All','Manga','Manhwa','Manhua'];
  let items=state.library.filter(m=>(state.status==='All'||m.status===state.status)&&(state.format==='All'||m.format===state.format)&&(!state.query||m.title.toLowerCase().includes(state.query.toLowerCase())||m.genres.some(g=>g.toLowerCase().includes(state.query.toLowerCase()))));
  const content=state.view==='grid'?`<div class="shelf-grid">${items.map(m=>mangaCard(m)).join('')}</div>`:`<div class="library-list">${items.map(m=>`<article class="list-item"><img src="${cover(m.anilist)}" data-detail="${m.id}" alt=""/><div><h3 data-detail="${m.id}">${esc(m.title)}</h3><span class="meta">${m.format} · ${m.year} · ${esc(m.author)}</span></div><div class="list-status"><span class="status-dot">${m.status}</span></div><div class="list-progress"><div class="progress"><span style="width:${pct(m)}%"></span></div><span class="meta">Ch. ${m.chapter}${m.total?` / ${m.total}`:''}</span></div><div class="list-extra rating">${m.score?`${icon('star')} ${m.score}/10`:'Unrated'}</div><button class="button icon soft" data-detail="${m.id}">${icon('chevron')}</button></article>`).join('')}</div>`;
  return shell(`<div class="page"><div class="page-head"><div><div class="eyebrow">${state.library.length} stories</div><h1>My library</h1><p class="subtext">Every world you have visited, in one place.</p></div><div class="head-actions"><div class="search">${icon('search')}<input data-library-search placeholder="Search title, tag or genre" value="${esc(state.query)}"/></div><button class="button primary" data-add>${icon('plus')} Add</button></div></div>
    <div class="toolbar"><div class="tabs">${statuses.map(s=>`<button class="tab ${state.status===s?'active':''}" data-status="${s}">${s}${s==='All'?` · ${state.library.length}`:''}</button>`).join('')}</div><div class="view-toggle"><button class="${state.view==='grid'?'active':''}" data-view="grid" aria-label="Grid view">${icon('grid')}</button><button class="${state.view==='list'?'active':''}" data-view="list" aria-label="List view">${icon('list')}</button></div></div>
    <div class="filter-row">${formats.map(f=>`<button class="filter-chip ${state.format===f?'active':''}" data-format="${f}">${f}</button>`).join('')}${state.tags.map(t=>`<button class="filter-chip" data-query="${esc(t)}"># ${esc(t)}</button>`).join('')}</div>
    ${items.length?content:`<div class="empty">${icon('book')}<h3>No stories found</h3><p>Try another search or shelf.</p></div>`}
  </div>`);
}

function explorePage(){
  const available=catalog.filter(x=>!state.library.some(y=>y.anilist===x.anilist));
  return shell(`<div class="page"><div class="page-head"><div><div class="eyebrow">Made for your taste</div><h1>Explore</h1><p class="subtext">Find your next obsession across manga, manhwa, and manhua.</p></div><div class="head-actions"><div class="search">${icon('search')}<input data-catalog-search placeholder="Search recommendations" value="${esc(state.query)}"/></div></div></div>
    <div class="discover-banner"><div><h2>A shelf picked for you</h2><p>Fantasy, strong character arcs, beautiful art, and a little emotional damage.</p></div><button class="button soft" data-refresh>${icon('compass')} Refresh picks</button></div>
    <section><div class="section-head"><div class="section-title"><h2>Because you loved your favorites</h2><p>${available.length} titles outside your library</p></div></div><div class="shelf-grid">${available.filter(m=>!state.query||m.title.toLowerCase().includes(state.query.toLowerCase())||m.genres.some(g=>g.toLowerCase().includes(state.query.toLowerCase()))).map(m=>mangaCard(m,true)).join('')}</div></section>
  </div>`);
}

function journalPage(){
  const reviewed=state.library.filter(x=>x.review).sort((a,b)=>b.added.localeCompare(a.added));
  const chapters=state.library.reduce((n,m)=>n+m.chapter,0);
  return shell(`<div class="page"><div class="page-head"><div><div class="eyebrow">Thoughts worth keeping</div><h1>Reading journal</h1><p class="subtext">A record of the stories that stayed with you.</p></div><div class="head-actions"><button class="button primary" data-review>${icon('pen')} New entry</button></div></div>
    <div class="stats-grid"><div class="stat"><div class="stat-icon">${icon('book')}</div><strong>${state.library.length}</strong><span>titles shelved</span></div><div class="stat"><div class="stat-icon">${icon('clock')}</div><strong>${chapters.toLocaleString()}</strong><span>chapters tracked</span></div><div class="stat"><div class="stat-icon">${icon('pen')}</div><strong>${reviewed.length}</strong><span>journal entries</span></div><div class="stat"><div class="stat-icon">${icon('star')}</div><strong>${(state.library.filter(x=>x.score).reduce((n,m)=>n+m.score,0)/state.library.filter(x=>x.score).length||0).toFixed(1)}</strong><span>average score</span></div></div>
    <div class="section-head"><div class="section-title"><h2>Recent reflections</h2><p>Private by default, always yours.</p></div></div><div class="journal-grid">${reviewed.map(m=>`<article class="review-card"><img src="${cover(m.anilist)}" data-detail="${m.id}" alt=""/><div><h3>${esc(m.title)}</h3><div class="review-stars">${'★'.repeat(Math.ceil(m.score/2))}${'☆'.repeat(5-Math.ceil(m.score/2))} · ${m.score}/10</div><p>${esc(m.review)}</p><div class="review-footer"><span>${m.added}</span><button class="text-button" data-edit-review="${m.id}">Edit</button></div></div></article>`).join('')}</div>
  </div>`);
}

function render(){
  const app=$('#app');
  app.innerHTML=state.page==='home'?homePage():state.page==='library'?libraryPage():state.page==='explore'?explorePage():journalPage();
  bind();
  window.scrollTo({top:0,behavior:'smooth'});
}

function bind(){
  $$('[data-page]').forEach(el=>el.onclick=()=>{state.page=el.dataset.page;state.query='';save();render();});
  $$('[data-add]').forEach(el=>el.onclick=openAdd);
  $$('[data-settings]').forEach(el=>el.onclick=openSettings);
  $$('[data-detail]').forEach(el=>el.onclick=e=>{if(e.target.closest('[data-quick-add]'))return;openDetail(el.dataset.detail);});
  $$('[data-plus-chapter]').forEach(el=>el.onclick=()=>increment(el.dataset.plusChapter));
  $$('[data-quick-add]').forEach(el=>el.onclick=e=>{e.stopPropagation();addCatalog(el.dataset.quickAdd);});
  $$('[data-status]').forEach(el=>el.onclick=()=>{state.status=el.dataset.status;save();render();});
  $$('[data-format]').forEach(el=>el.onclick=()=>{state.format=el.dataset.format;save();render();});
  $$('[data-view]').forEach(el=>el.onclick=()=>{state.view=el.dataset.view;save();render();});
  $$('[data-query]').forEach(el=>el.onclick=()=>{state.query=el.dataset.query;render();});
  const lib=$('[data-library-search]'); if(lib)lib.oninput=()=>{state.query=lib.value;renderDebounced();};
  const cat=$('[data-catalog-search]'); if(cat)cat.oninput=()=>{state.query=cat.value;renderDebounced();};
  const global=$('[data-global-search]'); if(global)global.onkeydown=e=>{if(e.key==='Enter'){state.query=global.value;state.page='library';save();render();}};
  $$('[data-edit-review]').forEach(el=>el.onclick=()=>openReview(el.dataset.editReview));
  const review=$('[data-review]'); if(review)review.onclick=()=>openReview(state.library[0]?.id);
  const refresh=$('[data-refresh]'); if(refresh)refresh.onclick=()=>{catalog.sort(()=>Math.random()-.5);toast('Fresh picks added to your shelf');render();};
}
let renderTimer; function renderDebounced(){clearTimeout(renderTimer);renderTimer=setTimeout(render,180);}

function increment(id, amount=1){ const m=state.library.find(x=>x.id===id);if(!m)return;m.chapter=Math.max(0,m.chapter+amount);if(m.total&&m.chapter>=m.total){m.chapter=m.total;m.status='Completed';}else if(m.status==='Plan to Read')m.status='Reading';save();toast(`Chapter ${m.chapter} saved`);render(); }
function addCatalog(id){ const m=catalog.find(x=>x.id===id);if(!m)return;if(state.library.some(x=>x.anilist===m.anilist)){toast('Already in your library');return;}state.library.unshift({...m,id:`title-${Date.now()}`,added:new Date().toISOString().slice(0,10)});save();toast(`${m.title} added to Plan to Read`);render(); }
function closeModal(){ $('#modal-root').innerHTML=''; }
function modal(html,wide=false){ $('#modal-root').innerHTML=`<div class="modal-backdrop"><section class="modal ${wide?'wide':''}" role="dialog" aria-modal="true">${html}</section></div>`;$('.modal-backdrop').onclick=e=>{if(e.target===e.currentTarget)closeModal();};$$('[data-close]').forEach(x=>x.onclick=closeModal);document.onkeydown=e=>{if(e.key==='Escape')closeModal();}; }

function openDetail(id){
  const m=state.library.find(x=>x.id===id)||catalog.find(x=>x.id===id); if(!m)return;
  const inLibrary=state.library.some(x=>x.id===id);
  modal(`<div class="detail-hero"><div class="detail-bg" style="background-image:url('${cover(m.anilist)}')"></div><img class="detail-cover" src="${cover(m.anilist)}" alt="Cover of ${esc(m.title)}"/><div class="detail-copy"><div class="eyebrow">${m.format} · ${m.year}</div><h1>${esc(m.title)}</h1><div class="detail-meta"><span>${esc(m.author)}</span><span>${inLibrary?m.status:'Discover'}</span><span>${m.total?m.total+' chapters':'Ongoing'}</span></div><div class="detail-actions">${inLibrary?`<button class="button primary" data-modal-plus>${icon('plus')} Chapter ${m.chapter+1}</button><button class="button soft" data-modal-review>${icon('pen')} Review</button><button class="button ghost" data-modal-gallery>${icon('image')} Gallery</button>`:`<button class="button primary" data-modal-add>${icon('plus')} Add to library</button>`}</div></div></div>
    <div class="detail-content"><div class="tabs"><button class="tab active">Overview</button><button class="tab" data-modal-review>My review</button><button class="tab" data-modal-gallery>Gallery</button></div><div class="detail-panel"><div><div class="progress-editor"><strong>Your progress</strong><div class="progress-controls"><select class="mini-select" data-detail-status ${!inLibrary?'disabled':''}>${['Plan to Read','Reading','Completed','On Hold','Dropped'].map(s=>`<option ${m.status===s?'selected':''}>${s}</option>`).join('')}</select><div class="stepper"><button data-step="-1">−</button><input data-chapter-input type="number" step="0.1" value="${m.chapter||0}" ${!inLibrary?'disabled':''}/><button data-step="1">+</button></div></div></div><h2>About this story</h2><p>${esc(m.description)}</p><div class="tag-list">${m.genres.map(g=>`<span class="tag">${esc(g)}</span>`).join('')}</div>${m.review?`<section class="section"><h2>Your note</h2><p>“${esc(m.review)}”</p></section>`:''}</div><aside class="info-list"><div class="info-row"><span>Creator</span><strong>${esc(m.author)}</strong></div><div class="info-row"><span>Format</span><strong>${m.format}</strong></div><div class="info-row"><span>Released</span><strong>${m.year}</strong></div><div class="info-row"><span>Your score</span><strong>${m.score?m.score+'/10':'Not rated'}</strong></div><div class="info-row"><span>Shelf</span><strong>${m.status}</strong></div></aside></div></div>`,true);
  const plus=$('[data-modal-plus]');if(plus)plus.onclick=()=>{increment(id);openDetail(id);};
  $$('[data-modal-review]').forEach(x=>x.onclick=()=>openReview(id));
  $$('[data-modal-gallery]').forEach(x=>x.onclick=()=>openGallery(id));
  const add=$('[data-modal-add]');if(add)add.onclick=()=>{addCatalog(id);closeModal();};
  const status=$('[data-detail-status]');if(status)status.onchange=()=>{m.status=status.value;save();toast('Shelf updated');};
  $$('[data-step]').forEach(x=>x.onclick=()=>{increment(id,Number(x.dataset.step));closeModal();openDetail(id);});
  const input=$('[data-chapter-input]');if(input)input.onchange=()=>{m.chapter=Math.max(0,Number(input.value)||0);save();toast('Progress saved');};
}

function openAdd(){
  modal(`<div class="modal-head"><div><div class="eyebrow">A new world awaits</div><h2>Add to your journal</h2></div><button class="close" data-close>${icon('x')}</button></div><div class="modal-body"><div class="tabs"><button class="tab active" data-add-tab="search">Search catalog</button><button class="tab" data-add-tab="custom">Custom entry</button></div><div data-add-content><div class="field full" style="margin:18px 0"><label>Search manga, manhwa, or manhua</label><div class="search" style="width:100%;min-width:0">${icon('search')}<input data-add-search placeholder="Try a title or creator"/></div></div><div class="shelf-grid" data-add-results>${catalog.slice(0,6).map(m=>mangaCard(m,true)).join('')}</div></div></div>`,true);
  bindAddModal();
}
function bindAddModal(){
  $$('[data-add-tab]').forEach(el=>el.onclick=()=>{ $$('[data-add-tab]').forEach(x=>x.classList.toggle('active',x===el)); if(el.dataset.addTab==='custom')renderCustomForm();else openAdd(); });
  const search=$('[data-add-search]');if(search)search.oninput=()=>{const q=search.value.toLowerCase();$('[data-add-results]').innerHTML=catalog.filter(m=>m.title.toLowerCase().includes(q)||m.author.toLowerCase().includes(q)).slice(0,6).map(m=>mangaCard(m,true)).join('');wireCatalogAdds();clearTimeout(search._timer);if(q.length>=3)search._timer=setTimeout(()=>searchAniList(q),450);};
  $$('[data-quick-add]').forEach(el=>el.onclick=e=>{e.stopPropagation();addCatalog(el.dataset.quickAdd);closeModal();});
}
function wireCatalogAdds(){ $$('[data-quick-add]').forEach(el=>el.onclick=e=>{e.stopPropagation();addCatalog(el.dataset.quickAdd);closeModal();}); }
async function searchAniList(search){
  const results=$('[data-add-results]');if(!results)return;
  try{
    const query=`query ($search: String) { Page(page: 1, perPage: 6) { media(search: $search, type: MANGA, sort: SEARCH_MATCH) { id title { english romaji } format startDate { year } genres staff(perPage: 1, sort: RELEVANCE) { nodes { name { full } } } description(asHtml: false) } } }`;
    const response=await fetch('https://graphql.anilist.co',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({query,variables:{search}})});
    if(!response.ok)throw Error('catalog unavailable');
    const data=await response.json();
    const found=data.data.Page.media.map((x,i)=>({id:`live-${x.id}`,anilist:x.id,title:x.title.english||x.title.romaji,format:x.format==='MANGA'?'Manga':x.format==='ONE_SHOT'?'Manga':'Manhwa',year:x.startDate.year||'—',genres:x.genres.slice(0,3),author:x.staff.nodes[0]?.name.full||'Unknown creator',reason:'Live result from AniList',chapter:0,total:0,score:0,status:'Plan to Read',favorite:false,description:(x.description||'No description available.').replace(/<[^>]+>/g,''),review:'',added:new Date().toISOString().slice(0,10)}));
    found.forEach(item=>{const old=catalog.findIndex(x=>x.anilist===item.anilist);if(old>=0)catalog[old]={...catalog[old],...item,id:catalog[old].id};else catalog.unshift(item);});
    if($('[data-add-search]')?.value.toLowerCase()!==search)return;
    results.innerHTML=found.map(m=>mangaCard(catalog.find(x=>x.anilist===m.anilist),true)).join('');wireCatalogAdds();
  }catch{ if(results)results.insertAdjacentHTML('beforeend','<p class="subtext" style="grid-column:1/-1">Live catalog is unavailable. Showing your saved recommendations instead.</p>'); }
}
function renderCustomForm(){
  $('[data-add-content]').innerHTML=`<form data-custom-form style="margin-top:20px"><div class="form-grid"><div class="field full"><label>Title *</label><input name="title" required placeholder="The story's title"/></div><div class="field"><label>Format</label><select name="format"><option>Manga</option><option>Manhwa</option><option>Manhua</option><option>Other</option></select></div><div class="field"><label>Reading status</label><select name="status"><option>Plan to Read</option><option>Reading</option><option>Completed</option><option>On Hold</option><option>Dropped</option></select></div><div class="field"><label>Creator</label><input name="author" placeholder="Author or artist"/></div><div class="field"><label>Cover URL</label><input name="coverId" placeholder="AniList media ID (optional)"/></div><div class="field full"><label>Description</label><textarea name="description" placeholder="What is this story about?"></textarea></div></div><div class="form-actions"><button type="button" class="button ghost" data-close>Cancel</button><button class="button primary">${icon('plus')} Add custom title</button></div></form>`;
  $('[data-custom-form]').onsubmit=e=>{e.preventDefault();const f=new FormData(e.currentTarget);const title=f.get('title').trim();if(!title)return;state.library.unshift({id:`custom-${Date.now()}`,anilist:Number(f.get('coverId'))||30013,title,format:f.get('format'),year:new Date().getFullYear(),status:f.get('status'),chapter:0,total:0,score:0,favorite:false,genres:['Custom'],author:f.get('author')||'Unknown creator',description:f.get('description')||'A custom story in your journal.',review:'',added:new Date().toISOString().slice(0,10)});save();closeModal();toast(`${title} added to your journal`);render();};
  $$('[data-close]').forEach(x=>x.onclick=closeModal);
}

function openReview(id){
  const m=state.library.find(x=>x.id===id)||state.library[0];if(!m)return;
  modal(`<div class="modal-head"><div><div class="eyebrow">Private journal entry</div><h2>Review ${esc(m.title)}</h2></div><button class="close" data-close>${icon('x')}</button></div><form class="modal-body" data-review-form><div class="field"><label>Your score</label><div class="rating-input">${[2,4,6,8,10].map(n=>`<button type="button" class="star-button ${m.score>=n?'active':''}" data-score="${n}">★</button>`).join('')}<span class="meta" style="align-self:center;margin-left:8px" data-score-label>${m.score?m.score+'/10':'Not rated'}</span></div></div><div class="field" style="margin-top:18px"><label>What stayed with you?</label><textarea name="review" placeholder="Characters, art, pacing, feelings…">${esc(m.review)}</textarea></div><div class="field" style="margin-top:14px"><label><input type="checkbox" name="spoiler"/> This note contains spoilers</label></div><div class="form-actions"><button type="button" class="button ghost" data-close>Cancel</button><button class="button primary">${icon('pen')} Save entry</button></div></form>`);
  let score=m.score;$$('[data-score]').forEach(x=>x.onclick=()=>{score=Number(x.dataset.score);$$('[data-score]').forEach(s=>s.classList.toggle('active',Number(s.dataset.score)<=score));$('[data-score-label]').textContent=`${score}/10`;});
  $('[data-review-form]').onsubmit=e=>{e.preventDefault();m.review=new FormData(e.currentTarget).get('review').trim();m.score=score;save();closeModal();toast('Journal entry saved');render();};
}

function openGallery(id){
  const m=state.library.find(x=>x.id===id);if(!m)return;const items=state.galleries[id]||[];
  modal(`<div class="modal-head"><div><div class="eyebrow">Private collection</div><h2>${esc(m.title)} gallery</h2></div><button class="close" data-close>${icon('x')}</button></div><div class="modal-body"><label class="upload-zone">${icon('upload')}<h3 style="margin:8px 0 3px">Add a panel or memory</h3><span>Choose a JPG, PNG, or WebP image</span><input type="file" accept="image/jpeg,image/png,image/webp" hidden data-gallery-file/></label><form data-link-form class="form-grid" style="margin-bottom:20px"><div class="field"><label>Or paste an image link</label><input name="url" type="url" placeholder="https://…"/></div><div class="field"><label>Caption</label><input name="caption" placeholder="Why you saved it"/></div><div class="field full"><button class="button soft">Add image link</button></div></form>${items.length?`<div class="gallery-grid">${items.map((g,i)=>`<figure class="gallery-item"><img src="${esc(g.url)}" alt="${esc(g.caption||'Gallery image')}"/><figcaption class="gallery-caption">${esc(g.caption||'Saved image')} <button class="text-button" data-delete-image="${i}">Remove</button></figcaption></figure>`).join('')}</div>`:`<div class="empty">${icon('image')}<h3>Your gallery is waiting</h3><p>Save panels, artwork, or reading memories here.</p></div>`}</div>`,true);
  $('[data-gallery-file]').onchange=e=>{const file=e.target.files[0];if(!file)return;if(file.size>10*1024*1024){toast('Please choose an image under 10 MB');return;}const r=new FileReader();r.onload=()=>{state.galleries[id]=[...(state.galleries[id]||[]),{url:r.result,caption:file.name}];try{save();openGallery(id);toast('Image added to gallery');}catch{state.galleries[id].pop();toast('Browser storage is full—try an image link');}};r.readAsDataURL(file);};
  $('[data-link-form]').onsubmit=e=>{e.preventDefault();const f=new FormData(e.currentTarget);if(!f.get('url'))return;state.galleries[id]=[...(state.galleries[id]||[]),{url:f.get('url'),caption:f.get('caption')}];save();openGallery(id);toast('Image link added');};
  $$('[data-delete-image]').forEach(x=>x.onclick=()=>{state.galleries[id].splice(Number(x.dataset.deleteImage),1);save();openGallery(id);});
}

function openSettings(){
  modal(`<div class="modal-head"><div><div class="eyebrow">Your space</div><h2>Journal settings</h2></div><button class="close" data-close>${icon('x')}</button></div><div class="modal-body"><div class="form-grid"><div class="field full"><label>Journal name</label><input value="My manga journal"/></div><div class="field full"><label>Collections</label><div class="tag-list">${state.collections.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div></div><div class="field full"><label>Tags</label><div class="tag-list">${state.tags.map(x=>`<span class="tag"># ${esc(x)}</span>`).join('')}</div></div></div><section class="section"><h2>Backup and restore</h2><p class="subtext" style="margin:7px 0 16px">Export your library, progress, reviews, tags, and image-link metadata as JSON.</p><div class="hero-actions"><button class="button soft" data-export>${icon('download')} Export JSON</button><label class="button ghost">${icon('upload')} Import JSON<input type="file" accept="application/json" hidden data-import/></label></div></section><section class="section"><h2>About this version</h2><p class="subtext" style="margin-top:7px">Inklog saves your journal privately in this browser. The hosted app itself is owner-private.</p></section></div>`);
  $('[data-export]').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`inklog-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);toast('Backup downloaded');};
  $('[data-import]').onchange=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{try{const next=JSON.parse(r.result);if(!Array.isArray(next.library))throw Error();state={...structuredClone(defaultState),...next};save();closeModal();render();toast('Journal restored');}catch{toast('That backup file could not be read');}};r.readAsText(file);};
}

render();
