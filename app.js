const root = document.getElementById('app');
const modalRoot = document.getElementById('modal-root');
const statuses = ['Reading', 'Plan to Read', 'Completed', 'On Hold', 'Dropped'];
const paths = {
  book:'<path d="M12 6v15M3 3l9 3 9-3v15l-9 3-9-3z"/>',
  reading:'<path d="M12 6v15M3 3l9 3 9-3v15l-9 3-9-3z"/>',
  library:'<path d="M4 4v16M9 4v16M14 4v16M18 4l4 16"/>',
  profile:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  search:'<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  edit:'<path d="m16 3 5 5-12 12-6 1 1-6zM13 6l5 5"/>',
  star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',
  trash:'<path d="M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>',
  up:'<path d="m6 14 6-6 6 6"/>',down:'<path d="m6 10 6 6 6-6"/>',
  upload:'<path d="M12 16V3m-5 5 5-5 5 5M3 16v5h18v-5"/>',
  download:'<path d="M12 3v13m-5-5 5 5 5-5M3 18v3h18v-3"/>'
};
const icon = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[n] || paths.book}</svg>`;
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = () => crypto.randomUUID();
const fresh = () => ({version:3,profile:{username:'My shelf',photo:'',theme:'dark',accent:'lavender',text:'standard',layout:'comfortable'},categories:[],tags:[],manga:[]});
let db, data, page='reading', query='', statusFilter='All', categoryFilter='All', tagFilter='All', sort='updated', previousFocus, dialogContext, toastTimer;

function imageURL(value) {
  if (!value) return '';
  if (/^data:image\/(jpeg|png|webp);base64,[a-z\d+/=]+$/i.test(value)) return value;
  try {const u=new URL(value);return u.protocol==='https:'?u.href:'';}catch{return '';}
}
const picture = (url, alt, cls='') => imageURL(url) ? `<img class="${cls}" src="${esc(imageURL(url))}" alt="${esc(alt)}" loading="lazy" referrerpolicy="no-referrer">` : '';
const placeholder = () => `${icon('book')}<small>No cover yet</small>`;
const coverHTML = (m, extra='') => `<div class="cover ${extra}">${placeholder()}${picture(m.cover,m.title)}${extra?'':`<span class="status">${esc(m.status)}</span>`}</div>`;
const percent = m => m.total ? Math.min(100,m.chapter/m.total*100) : 0;

async function openDB(){
  db=await new Promise((resolve,reject)=>{const r=indexedDB.open('inklog-journal',1);r.onupgradeneeded=()=>r.result.createObjectStore('journal');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  return new Promise((resolve,reject)=>{const t=db.transaction('journal');const r=t.objectStore('journal').get('state');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
}
async function persist(next){
  await new Promise((resolve,reject)=>{const tx=db.transaction('journal','readwrite');tx.objectStore('journal').put(next,'state');tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
  data=next;applyAppearance();
}
let pendingWrite=Promise.resolve();
function change(fn){const run=pendingWrite.then(async()=>{const next=structuredClone(data);fn(next);await persist(next);});pendingWrite=run.catch(()=>{});return run;}
function migrate(old){
  const next=fresh();
  next.categories=Array.isArray(old.collections)?old.collections.filter(x=>typeof x==='string'):[];
  next.tags=Array.isArray(old.tags)?old.tags.filter(x=>typeof x==='string'):[];
  next.manga=(old.library||[]).map(m=>({id:String(m.id),title:String(m.title||'Untitled'),cover:imageURL(m.cover||`https://img.anili.st/media/${Number(m.anilist)}`),status:statuses.includes(m.status)?m.status:'Plan to Read',chapter:Math.max(0,Number(m.chapter)||0),total:Math.max(0,Number(m.total)||0),rating:Math.round((Number(m.score)||0)/2),review:String(m.review||''),categories:m.favorite?['Favorites']:[],tags:Array.isArray(m.genres)?m.genres:[],gallery:(old.galleries?.[m.id]||[]).map(x=>({id:uid(),url:imageURL(x.url),caption:String(x.caption||'')})).filter(x=>x.url),updated:Date.now(),created:Date.now()}));
  next.legacy=true;return next;
}
function applyAppearance(){
  const p=data.profile;document.body.dataset.theme=p.theme;document.body.dataset.text=p.text;document.body.classList.toggle('compact',p.layout==='compact');
  document.documentElement.style.fontSize=p.text==='large'?'21px':'18px';
  const colors=p.theme==='light'?{lavender:['#713b92','#fff'],rose:['#972f69','#fff'],sage:['#34674d','#fff']}:{lavender:['#e1c7ff','#2d123c'],rose:['#ffc2e0','#43142e'],sage:['#b9e5c8','#123820']};
  const c=colors[p.accent]||colors.lavender;document.documentElement.style.setProperty('--accent',c[0]);document.documentElement.style.setProperty('--accent-ink',c[1]);
  document.querySelector('meta[name="theme-color"]').content=p.theme==='dark'?'#121019':'#f6f2f9';
}
function toast(msg){clearTimeout(toastTimer);document.getElementById('toast-root').innerHTML=`<div class="toast" role="status">${esc(msg)}</div>`;toastTimer=setTimeout(()=>document.getElementById('toast-root').innerHTML='',2800);}
function fail(e){console.error(e);const error=modalRoot.querySelector('[data-error]');const message=e?.name==='QuotaExceededError'?'Storage is full. Remove a few gallery images or export a backup.':e?.message||'Could not save. Please try again.';if(error){error.textContent=message;error.focus();}else toast(message);}

function nav(name,label){return `<button data-page="${name}" class="${page===name?'active':''}" ${page===name?'aria-current="page"':''}>${icon(name)}${label}</button>`;}
function render(){
  applyAppearance();const p=data.profile;
  root.innerHTML=`<div class="app"><header class="header"><div class="logo"><div class="logo-mark">${icon('book')}</div>Ink<span>log</span></div><nav class="nav" aria-label="Main navigation">${nav('reading','Reading')}${nav('library','Library')}${nav('profile','Profile')}</nav><button class="profile-dot" data-page="profile" aria-label="Open profile">${p.photo?picture(p.photo,'Profile picture'):esc(p.username.slice(0,1).toUpperCase())}</button></header><main id="main" class="page">${page==='reading'?readingPage():page==='library'?libraryPage():profilePage()}</main></div>`;
}
function card(m,reading=false){
  if(reading===true)return `<article class="manga-card reading-card"><button class="reading-cover" data-open="${m.id}" aria-label="Open ${esc(m.title)}">${coverHTML(m)}</button><div class="reading-info"><button class="reading-title" data-open="${m.id}"><h3>${esc(m.title)}</h3></button><div class="card-rating">${m.rating?'★ '+m.rating+' / 5':'Unrated'}</div><div class="chapter-row"><div><span class="muted small">Chapter</span><br><strong>${m.chapter}${m.total?' / '+m.total:''}</strong></div><button class="chapter-add" data-plus="${m.id}" aria-label="Add one chapter to ${esc(m.title)}">+1</button></div><button class="text-btn small" data-open="${m.id}">Update status</button></div></article>`;
  return `<article class="manga-card"><button class="card-open" data-open="${m.id}" aria-label="Open ${esc(m.title)}">${coverHTML(m)}<div class="card-body"><h3>${esc(m.title)}</h3><div class="card-rating">${m.rating?'★ '+m.rating+' / 5':'Unrated'}</div></div></button><div class="card-bottom"><div class="chapter-row"><div><span class="muted small">Chapter</span><br><strong>${m.chapter}${m.total?' / '+m.total:''}</strong></div><button class="chapter-add" data-plus="${m.id}" aria-label="Add one chapter to ${esc(m.title)}">+1</button></div>${m.total?`<div class="progress" role="progressbar" aria-label="Reading progress" aria-valuenow="${Math.min(100,Math.round(percent(m)))}" aria-valuemin="0" aria-valuemax="100"><i style="width:${percent(m)}%"></i></div>`:''}</div></article>`;
}
function empty(title,text,button=true){return `<div class="empty"><div class="empty-icon">${icon('book')}</div><h2>${title}</h2><p>${text}</p>${button?`<button class="btn primary" data-new>${icon('plus')}Add manga</button>`:''}</div>`;}
function readingPage(){
  const current=data.manga.filter(m=>m.status==='Reading').sort((a,b)=>b.updated-a.updated);
  const planned=data.manga.filter(m=>m.status==='Plan to Read').sort((a,b)=>b.updated-a.updated).slice(0,4);
  return `<div class="page-title"><div><h1>Currently reading</h1><p>${current.length?current.length+' '+(current.length===1?'story':'stories')+' in progress':'Your next chapter starts here.'}</p></div><button class="btn primary" data-new>${icon('plus')}Add manga</button></div>${data.legacy?`<div class="notice row between"><span>Your previous library is here.</span><button class="text-btn" data-dismiss-legacy>Got it</button></div>`:''}${current.length?`<div class="grid reading-grid">${current.map(m=>card(m,true)).join('')}</div>`:empty('A shelf of your own','Add a manga and choose Reading to see it here.')}${planned.length?`<div class="section-title"><h2>Read next</h2><button class="text-btn" data-show-planned>View all</button></div><div class="grid">${planned.map(card).join('')}</div>`:''}`;
}
function libraryPage(){return `<div class="page-title"><div><h1>Your library</h1><p>${data.manga.length} ${data.manga.length===1?'manga':'manga'} on your shelves</p></div><button class="btn primary" data-new>${icon('plus')}Add manga</button></div><div class="toolbar"><label class="search">${icon('search')}<input class="input" type="search" id="search" placeholder="Search titles or tags" aria-label="Search titles or tags" value="${esc(query)}"></label><select class="input" id="category-filter" aria-label="Filter by category"><option value="All">All categories</option>${data.categories.map(c=>`<option ${c===categoryFilter?'selected':''}>${esc(c)}</option>`).join('')}</select><select class="input" id="sort" aria-label="Sort manga">${[['updated','Recently updated'],['title','Title A–Z'],['rating','Highest rated']].map(([v,l])=>`<option value="${v}" ${sort===v?'selected':''}>${l}</option>`).join('')}</select></div><div class="chips" aria-label="Reading status">${['All',...statuses].map(s=>`<button class="chip ${s===statusFilter?'active':''}" data-status-filter="${s}" aria-pressed="${s===statusFilter}">${s}</button>`).join('')}</div>${data.tags.length?`<div class="toolbar"><label class="small" for="tag-filter">Tag</label><select class="input" id="tag-filter"><option value="All">All tags</option>${data.tags.map(t=>`<option ${t===tagFilter?'selected':''}>${esc(t)}</option>`).join('')}</select></div>`:''}<div id="library-results" aria-live="polite">${libraryResults()}</div>`;}
function libraryResults(){
  let list=data.manga.filter(m=>(statusFilter==='All'||m.status===statusFilter)&&(categoryFilter==='All'||m.categories.includes(categoryFilter))&&(tagFilter==='All'||m.tags.includes(tagFilter))&&(!query||[m.title,...m.tags].some(t=>t.toLowerCase().includes(query.toLowerCase()))));
  list.sort(sort==='title'?(a,b)=>a.title.localeCompare(b.title):sort==='rating'?(a,b)=>b.rating-a.rating:(a,b)=>b.updated-a.updated);
  return list.length?`<div class="grid">${list.map(card).join('')}</div>`:empty(data.manga.length?'No matches':'Your library is empty',data.manga.length?'Try a different search or filter.':'Add your first manga, just the way you like it.',!data.manga.length);
}
function profilePage(){const p=data.profile;return `<div class="page-title"><div><h1>Your profile</h1></div></div><div class="profile-layout"><aside class="profile-card"><div class="profile-avatar">${p.photo?picture(p.photo,'Your profile picture'):esc(p.username.slice(0,1).toUpperCase())}</div><h2>${esc(p.username)}</h2><p class="muted small" style="margin-top:8px">${data.manga.length} manga · ${data.manga.filter(m=>m.status==='Completed').length} completed</p><label class="btn file-label">${icon('image')}Change photo<input class="file-input" type="file" id="profile-photo" accept="image/jpeg,image/png,image/webp"></label>${p.photo?'<button class="text-btn" data-remove-photo>Remove photo</button>':''}</aside><div class="settings-stack"><section class="settings-card"><h2>Make it yours</h2><form id="profile-form"><div class="field"><label for="username">Username</label><input class="input" id="username" name="username" maxlength="40" required value="${esc(p.username)}"></div><button class="btn primary" style="margin-top:14px">Save name</button></form><div class="setting-row"><label for="theme">Appearance</label><select class="input" id="theme"><option value="dark" ${p.theme==='dark'?'selected':''}>Dark</option><option value="light" ${p.theme==='light'?'selected':''}>Light</option></select></div><div class="setting-row"><span>Accent colour</span><div class="colour-options">${[['lavender','#d8b4f8'],['rose','#ffbadc'],['sage','#b9e5c8']].map(([name,c])=>`<button class="colour-option ${p.accent===name?'active':''}" data-accent="${name}" aria-label="${name}" aria-pressed="${p.accent===name}" style="--swatch:${c}"><span></span></button>`).join('')}</div></div><div class="setting-row"><label for="text-size">Text size</label><select class="input" id="text-size"><option value="standard" ${p.text==='standard'?'selected':''}>Comfortable</option><option value="large" ${p.text==='large'?'selected':''}>Extra large</option></select></div><div class="setting-row"><label for="layout">Cover layout</label><select class="input" id="layout"><option value="comfortable" ${p.layout==='comfortable'?'selected':''}>Roomy</option><option value="compact" ${p.layout==='compact'?'selected':''}>Compact</option></select></div></section>${manager('categories','Categories')}${manager('tags','Tags')}<section class="settings-card"><h2>Backup</h2><div class="row"><button class="btn" data-export>${icon('download')}Export</button><label class="btn file-label">${icon('upload')}Restore<input type="file" accept="application/json" class="file-input" id="import"></label></div><p class="help">Saved on this device. Backups include covers and galleries.</p></section></div></div>`;}
function manager(type,title){return `<section class="settings-card"><h2>${title}</h2><form data-manager="${type}" class="add-inline"><input class="input" name="name" maxlength="50" required placeholder="New ${type==='categories'?'category':'tag'}" aria-label="New ${type==='categories'?'category':'tag'}"><button class="btn" aria-label="Add ${title.toLowerCase()}">${icon('plus')}</button></form><div class="settings-list">${data[type].map((n,i)=>`<div class="settings-item"><span>${esc(n)}</span><div class="row"><button class="btn icon" data-rename="${type}:${i}" aria-label="Rename ${esc(n)}">${icon('edit')}</button><button class="btn icon danger" data-delete-group="${type}:${i}" aria-label="Delete ${esc(n)}">${icon('trash')}</button></div></div>`).join('')}</div></section>`;}

function showDialog(title,html,context){
  if(!modalRoot.firstChild)previousFocus=document.activeElement;
  dialogContext=context;modalRoot.innerHTML=`<div class="dialog-backdrop"><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div class="dialog-head"><h2 id="dialog-title">${esc(title)}</h2><button class="btn icon" data-close aria-label="Close">${icon('close')}</button></div><div class="dialog-body">${html}<div data-error role="alert" class="error" tabindex="-1"></div></div></section></div>`;
  document.body.classList.add('modal-open');requestAnimationFrame(()=>modalRoot.querySelector('button,input')?.focus());
}
function closeDialog(){modalRoot.innerHTML='';document.body.classList.remove('modal-open');dialogContext=null;if(previousFocus?.isConnected)previousFocus.focus();}
function mangaById(id){return data.manga.find(m=>m.id===id);}
function detail(id,tab='overview'){
  const m=mangaById(id);if(!m)return;
  showDialog(m.title,`<div class="detail-top">${coverHTML(m,'detail-cover')}<div class="detail-title"><h2>${esc(m.title)}</h2><p class="muted" style="margin-bottom:12px">${m.rating?'★ '+m.rating+' / 5':'Not rated'}</p><button class="btn" data-edit="${m.id}">${icon('edit')}Edit manga</button></div></div><div class="detail-progress"><div class="row between"><label class="field" style="min-width:150px;flex:1"><span>Status</span><select class="input" data-detail-status="${m.id}">${statuses.map(s=>`<option ${s===m.status?'selected':''}>${s}</option>`).join('')}</select></label><div class="field"><label for="detail-chapter">Chapter${m.total?' / '+m.total:''}</label><div class="stepper"><input class="input" id="detail-chapter" type="number" min="0" step="0.1" value="${m.chapter}" data-detail-chapter="${m.id}"><button class="btn primary" data-plus="${m.id}" aria-label="Add one chapter">+1</button></div></div></div></div><div class="detail-tabs" role="tablist" aria-label="Manga details"><button role="tab" aria-selected="${tab==='overview'}" aria-controls="detail-panel" class="${tab==='overview'?'active':''}" data-detail-tab="overview">Details</button><button role="tab" aria-selected="${tab==='gallery'}" aria-controls="detail-panel" class="${tab==='gallery'?'active':''}" data-detail-tab="gallery">Gallery (${m.gallery.length})</button></div><div id="detail-panel" role="tabpanel">${tab==='gallery'?galleryPanel(m):overviewPanel(m)}</div>`,{type:'detail',id,tab});
}
function overviewPanel(m){return `<div class="detail-section"><h3>Categories</h3>${m.categories.length?`<div class="tags">${m.categories.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`:'<p class="muted">No categories yet.</p>'}</div><div class="detail-section"><h3>Tags</h3>${m.tags.length?`<div class="tags">${m.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`:'<p class="muted">No tags yet.</p>'}</div><div class="detail-section"><h3>Your review</h3><p class="${m.review?'':'muted'}">${esc(m.review||'What did you think of this one?')}</p><button class="text-btn" data-edit="${m.id}">${m.review?'Edit review':'Write a review'}</button></div>`;}
function galleryPanel(m){return `<div class="detail-section"><div class="row between"><h3>Your saved images</h3><label class="btn primary file-label">${icon('plus')}Add images<input type="file" multiple accept="image/jpeg,image/png,image/webp" class="file-input" data-gallery-upload="${m.id}"></label></div><form data-gallery-link="${m.id}" class="add-inline" style="margin-top:16px"><input class="input" name="url" type="url" required placeholder="Or paste an HTTPS image link" aria-label="Image link"><button class="btn">Add</button></form>${m.gallery.length?`<div class="gallery">${m.gallery.map((g,i)=>`<figure><button class="gallery-open" data-view-image="${g.id}" aria-label="View ${esc(g.caption||'saved image')}">${picture(g.url,g.caption||'Saved image')}</button><figcaption>${esc(g.caption||'Untitled image')}</figcaption><div class="gallery-tools"><button data-caption="${g.id}" aria-label="Edit caption">${icon('edit')}</button><button data-move="${g.id}:-1" ${i===0?'disabled':''} aria-label="Move image earlier">${icon('up')}</button><button data-move="${g.id}:1" ${i===m.gallery.length-1?'disabled':''} aria-label="Move image later">${icon('down')}</button><button data-remove-image="${g.id}" aria-label="Delete image">${icon('trash')}</button></div></figure>`).join('')}</div>`:'<p class="muted" style="margin-top:25px">Panels, favourite scenes, cover art. Keep them here.</p>'}</div>`;}

let draft;
function editor(id){
  const m=mangaById(id);draft=m?structuredClone(m):{id:uid(),title:'',cover:'',rating:0,review:'',status:'Reading',chapter:0,total:0,categories:[],tags:[],gallery:[],created:Date.now(),updated:Date.now()};
  showDialog(m?'Edit manga':'Add manga',`<form id="manga-form"><div class="form-grid"><div class="field full"><label for="m-title">Title <span class="muted">(required)</span></label><input id="m-title" class="input" name="title" maxlength="200" required value="${esc(draft.title)}" placeholder="Manga title"></div><div class="field full"><span>Cover</span><div class="upload-layout"><div class="cover-preview" id="cover-preview">${draft.cover?picture(draft.cover,'Cover preview'):icon('image')}</div><div class="upload-buttons"><label class="btn file-label">${icon('upload')}Upload cover<input class="file-input" id="cover-upload" type="file" accept="image/jpeg,image/png,image/webp"></label><button class="text-btn" type="button" data-remove-cover>Remove cover</button></div></div><input name="coverURL" class="input" type="url" placeholder="Or paste a cover image link" aria-label="Cover image link" value="${draft.cover?.startsWith('https:')?esc(draft.cover):''}"></div><div class="field"><label for="m-status">Status</label><select id="m-status" class="input" name="status">${statuses.map(s=>`<option ${draft.status===s?'selected':''}>${s}</option>`).join('')}</select></div><div class="field"><label for="m-chapter">Current chapter</label><input id="m-chapter" class="input" name="chapter" type="number" min="0" step="0.1" value="${draft.chapter}"></div><div class="field"><label for="m-total">Total chapters <span class="muted small">(optional)</span></label><input id="m-total" class="input" name="total" type="number" min="0" step="0.1" value="${draft.total||''}" placeholder="Unknown"></div><div class="field"><span id="rating-label">Your rating</span><div class="rating-group" role="group" aria-labelledby="rating-label">${[1,2,3,4,5].map(n=>`<button type="button" class="rating-star ${draft.rating>=n?'on':''}" data-rate="${n}" aria-label="${n} out of 5" aria-pressed="${draft.rating===n}">${icon('star')}</button>`).join('')}<button type="button" class="text-btn small" data-clear-rating>Clear</button></div></div><div class="field full"><span>Categories</span><div class="selection-box" id="category-choices">${categoryChoices()}</div><div class="add-inline"><input class="input" id="new-category" maxlength="50" placeholder="New category" aria-label="New category"><button class="btn" type="button" data-draft-category>${icon('plus')}Add</button></div></div><div class="field full"><label for="m-tags">Tags</label><input class="input" id="m-tags" name="tags" value="${esc(draft.tags.join(', '))}" placeholder="Romance, beautiful art, slow burn"><small>Separate tags with commas.</small></div><div class="field full"><label for="m-review">Your review</label><textarea class="input" id="m-review" name="review" maxlength="20000" placeholder="Your thoughts on this manga…">${esc(draft.review)}</textarea></div><div class="field full"><span>Image gallery</span><p class="help">Save the manga, then open its Gallery to add images.</p></div></div><div class="form-actions">${m?`<button type="button" class="btn danger" data-delete-manga="${m.id}">${icon('trash')}Delete</button>`:''}<button type="button" class="btn" data-close>Cancel</button><button class="btn primary" type="submit">Save manga</button></div></form>`,{type:'editor',id:draft.id});
}
function categoryChoices(){const choices=[...new Set([...data.categories,...draft.categories])];return choices.length?choices.map(c=>`<label class="check-chip"><input type="checkbox" name="categories" value="${esc(c)}" ${draft.categories.includes(c)?'checked':''}>${esc(c)}</label>`).join(''):'<span class="muted small">Add your first category below.</span>';}
function updateStars(){modalRoot.querySelectorAll('[data-rate]').forEach(b=>{b.classList.toggle('on',Number(b.dataset.rate)<=draft.rating);b.setAttribute('aria-pressed',String(Number(b.dataset.rate)===draft.rating));});}
async function saveManga(form){
  const f=new FormData(form),title=String(f.get('title')).trim();if(!title)throw Error('Enter a title.');
  const coverInput=String(f.get('coverURL')).trim();if(coverInput&&!imageURL(coverInput))throw Error('Use an HTTPS image link for the cover.');
  const m={...draft,title,status:String(f.get('status')),chapter:Math.max(0,Number(f.get('chapter'))||0),total:Math.max(0,Number(f.get('total'))||0),cover:coverInput||draft.cover,categories:f.getAll('categories').map(String),tags:[...new Set(String(f.get('tags')).split(',').map(s=>s.trim()).filter(Boolean))],review:String(f.get('review')).trim(),updated:Date.now()};
  await change(next=>{const i=next.manga.findIndex(x=>x.id===m.id);if(i>=0)next.manga[i]=m;else next.manga.unshift(m);next.categories=[...new Set([...next.categories,...m.categories])];next.tags=[...new Set([...next.tags,...m.tags])];});
  render();detail(m.id);toast('Manga saved');
}

async function readImage(file,size=1600){
  if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Choose a JPG, PNG, or WebP image.');
  if(file.size>10*1024*1024)throw Error('Choose an image under 10 MB.');
  const bitmap=await createImageBitmap(file);const ratio=Math.min(1,size/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*ratio);canvas.height=Math.round(bitmap.height*ratio);const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();return canvas.toDataURL('image/jpeg',.86);
}
async function plus(id){const m=mangaById(id);if(!m)return;await change(next=>{const a=next.manga.find(x=>x.id===id);a.chapter=Math.round((a.chapter+1)*10)/10;a.updated=Date.now();});const context=dialogContext;render();if(context?.type==='detail')detail(id,context.tab);toast('Chapter updated');}
function confirmDialog(title,text,onConfirm){showDialog(title,`<p style="line-height:1.7">${esc(text)}</p><div class="form-actions"><button class="btn" data-close>Cancel</button><button class="btn primary" data-confirm>Confirm</button></div>`,{type:'confirm',onConfirm});}
function textDialog(title,value,onSave){showDialog(title,`<form id="text-form"><label class="field"><span>${esc(title)}</span><input name="text" class="input" required maxlength="200" value="${esc(value)}"></label><div class="form-actions"><button class="btn" type="button" data-close>Cancel</button><button class="btn primary">Save</button></div></form>`,{type:'text',onSave});}

root.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;try{
  if(b.dataset.page){page=b.dataset.page;render();window.scrollTo(0,0);}
  else if(b.hasAttribute('data-new'))editor();
  else if(b.dataset.open)detail(b.dataset.open);
  else if(b.dataset.plus)await plus(b.dataset.plus);
  else if(b.dataset.statusFilter){statusFilter=b.dataset.statusFilter;render();}
  else if(b.hasAttribute('data-show-planned')){page='library';statusFilter='Plan to Read';render();window.scrollTo(0,0);}
  else if(b.hasAttribute('data-dismiss-legacy')){await change(n=>delete n.legacy);render();}
  else if(b.dataset.accent){await change(n=>n.profile.accent=b.dataset.accent);render();}
  else if(b.hasAttribute('data-remove-photo')){await change(n=>n.profile.photo='');render();}
  else if(b.dataset.rename){const[type,index]=b.dataset.rename.split(':');const old=data[type][index];textDialog('Rename '+(type==='categories'?'category':'tag'),old,async value=>{if(!value.trim())throw Error('Enter a name.');if(value!==old&&data[type].includes(value))throw Error('That name already exists.');await change(n=>{n[type][index]=value;n.manga.forEach(m=>m[type]=m[type].map(v=>v===old?value:v));});closeDialog();render();toast('Renamed');});}
  else if(b.dataset.deleteGroup){const[type,index]=b.dataset.deleteGroup.split(':');const old=data[type][index];confirmDialog('Remove '+old+'?', 'Your manga will stay in your library.',async()=>{await change(n=>{n[type]=n[type].filter(v=>v!==old);n.manga.forEach(m=>m[type]=m[type].filter(v=>v!==old));});categoryFilter='All';tagFilter='All';closeDialog();render();toast('Removed');});}
  else if(b.hasAttribute('data-export')){const blob=new Blob([JSON.stringify(data)],{type:'application/json'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download='inklog-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);toast('Backup downloaded');}
}catch(err){fail(err);}});

root.addEventListener('input',e=>{if(e.target.id==='search'){query=e.target.value;document.getElementById('library-results').innerHTML=libraryResults();}});
root.addEventListener('change',async e=>{const el=e.target;try{
  if(el.id==='category-filter'){categoryFilter=el.value;document.getElementById('library-results').innerHTML=libraryResults();}
  else if(el.id==='tag-filter'){tagFilter=el.value;document.getElementById('library-results').innerHTML=libraryResults();}
  else if(el.id==='sort'){sort=el.value;document.getElementById('library-results').innerHTML=libraryResults();}
  else if(['theme','text-size','layout'].includes(el.id)){const k={'theme':'theme','text-size':'text','layout':'layout'}[el.id];await change(n=>n.profile[k]=el.value);render();}
  else if(el.id==='profile-photo'&&el.files[0]){const photo=await readImage(el.files[0],500);await change(n=>n.profile.photo=photo);render();toast('Profile photo saved');}
  else if(el.id==='import'&&el.files[0]){const file=el.files[0];if(file.size>150*1024*1024)throw Error('That backup is too large.');const next=validateBackup(JSON.parse(await file.text()));confirmDialog('Restore backup?', 'This will replace this device’s library and profile. Export a backup first if you want to keep them.',async()=>{await persist(next);closeDialog();page='reading';render();toast('Backup restored');});}
}catch(err){fail(err);el.value='';}});
root.addEventListener('submit',async e=>{e.preventDefault();try{
  if(e.target.id==='profile-form'){const name=String(new FormData(e.target).get('username')).trim();if(!name)throw Error('Enter a username.');await change(n=>n.profile.username=name);render();toast('Name saved');}
  else if(e.target.dataset.manager){const type=e.target.dataset.manager;const name=String(new FormData(e.target).get('name')).trim();if(!name)return;if(data[type].some(v=>v.toLowerCase()===name.toLowerCase()))throw Error('That name already exists.');await change(n=>n[type].push(name));render();toast('Added');}
}catch(err){fail(err);}});

modalRoot.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;try{
  if(b.hasAttribute('data-close')){if(dialogContext?.type==='editor'&&!window.confirm('Close without saving your changes?'))return;closeDialog();}
  else if(b.dataset.edit)editor(b.dataset.edit);
  else if(b.dataset.plus)await plus(b.dataset.plus);
  else if(b.dataset.detailTab)detail(dialogContext.id,b.dataset.detailTab);
  else if(b.dataset.rate){draft.rating=Number(b.dataset.rate);updateStars();}
  else if(b.hasAttribute('data-clear-rating')){draft.rating=0;updateStars();}
  else if(b.hasAttribute('data-remove-cover')){draft.cover='';document.getElementById('cover-preview').innerHTML=icon('image');modalRoot.querySelector('[name=coverURL]').value='';}
  else if(b.hasAttribute('data-draft-category')){const el=document.getElementById('new-category'),name=el.value.trim();if(!name)return;draft.categories=[...new Set([...modalRoot.querySelectorAll('[name=categories]:checked')].map(x=>x.value).concat(name))];document.getElementById('category-choices').innerHTML=categoryChoices();el.value='';}
  else if(b.dataset.deleteManga){const id=b.dataset.deleteManga,m=mangaById(id);confirmDialog('Delete '+m.title+'?', 'This also removes its review and gallery from this device.',async()=>{await change(n=>n.manga=n.manga.filter(m=>m.id!==id));closeDialog();render();toast('Manga deleted');});}
  else if(b.hasAttribute('data-confirm')){b.disabled=true;try{await dialogContext.onConfirm();}catch(err){b.disabled=false;throw err;}}
  else if(b.dataset.viewImage){const m=mangaById(dialogContext.id),g=m.gallery.find(x=>x.id===b.dataset.viewImage);showDialog(g.caption||'Saved image',`${picture(g.url,g.caption,'image-viewer')}<div class="form-actions"><button class="btn" data-back-gallery="${m.id}">Back to gallery</button></div>`,{type:'image',id:m.id});}
  else if(b.dataset.backGallery)detail(b.dataset.backGallery,'gallery');
  else if(b.dataset.caption){const id=dialogContext.id,g=mangaById(id).gallery.find(x=>x.id===b.dataset.caption);textDialog('Image caption',g.caption,async text=>{await change(n=>n.manga.find(m=>m.id===id).gallery.find(x=>x.id===g.id).caption=text);detail(id,'gallery');toast('Caption saved');});}
  else if(b.dataset.move){const id=dialogContext.id,[imageId,delta]=b.dataset.move.split(':');await change(n=>{const a=n.manga.find(m=>m.id===id).gallery,i=a.findIndex(g=>g.id===imageId),j=i+Number(delta);if(j>=0&&j<a.length)[a[i],a[j]]=[a[j],a[i]];});detail(id,'gallery');}
  else if(b.dataset.removeImage){const id=dialogContext.id,imageId=b.dataset.removeImage;confirmDialog('Delete this image?','The rest of your gallery will stay.',async()=>{await change(n=>{const m=n.manga.find(m=>m.id===id);m.gallery=m.gallery.filter(g=>g.id!==imageId);});detail(id,'gallery');toast('Image removed');});}
}catch(err){fail(err);}});

modalRoot.addEventListener('change',async e=>{const el=e.target;try{
  if(el.id==='cover-upload'&&el.files[0]){draft.cover=await readImage(el.files[0],1000);document.getElementById('cover-preview').innerHTML=picture(draft.cover,'Cover preview');modalRoot.querySelector('[name=coverURL]').value='';}
  else if(el.name==='coverURL'&&el.value.trim()){const url=imageURL(el.value.trim());if(!url)throw Error('Use an HTTPS image link.');document.getElementById('cover-preview').innerHTML=picture(url,'Cover preview');}
  else if(el.dataset.detailStatus){await change(n=>{const m=n.manga.find(x=>x.id===el.dataset.detailStatus);m.status=el.value;m.updated=Date.now();});render();toast('Status updated');}
  else if(el.dataset.detailChapter){const chapter=Number(el.value);if(!Number.isFinite(chapter)||chapter<0)throw Error('Enter a chapter number of 0 or more.');await change(n=>{const m=n.manga.find(x=>x.id===el.dataset.detailChapter);m.chapter=chapter;m.updated=Date.now();});render();toast('Chapter saved');}
  else if(el.dataset.galleryUpload){const id=el.dataset.galleryUpload,items=[];for(const file of el.files)items.push({id:uid(),url:await readImage(file),caption:''});await change(n=>n.manga.find(m=>m.id===id).gallery.push(...items));detail(id,'gallery');toast('Images saved');}
}catch(err){fail(err);}});
modalRoot.addEventListener('submit',async e=>{e.preventDefault();const form=e.target,submit=form.querySelector('[type=submit]')||form.querySelector('button:last-child');if(submit)submit.disabled=true;try{
  if(form.id==='manga-form')await saveManga(form);
  else if(form.id==='text-form')await dialogContext.onSave(String(new FormData(form).get('text')).trim());
  else if(form.dataset.galleryLink){const id=form.dataset.galleryLink,url=imageURL(String(new FormData(form).get('url')).trim());if(!url)throw Error('Use an HTTPS image link.');await change(n=>n.manga.find(m=>m.id===id).gallery.push({id:uid(),url,caption:''}));detail(id,'gallery');toast('Image link saved');}
}catch(err){fail(err);}finally{if(submit?.isConnected)submit.disabled=false;}});
document.addEventListener('keydown',e=>{if(!modalRoot.firstChild)return;if(e.key==='Escape'){if(dialogContext?.type==='editor'&&!window.confirm('Close without saving your changes?'))return;closeDialog();}if(e.key==='Tab'){const nodes=[...modalRoot.querySelectorAll('button:not(:disabled),input:not([type=hidden]),textarea,select,a[href]')].filter(n=>n.getClientRects().length&&getComputedStyle(n).opacity!=='0');const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}});
document.addEventListener('error',e=>{if(e.target.tagName==='IMG'){const img=e.target;img.style.display='none';if(img.parentElement.classList.contains('gallery-open'))img.parentElement.innerHTML='<span class="muted" style="display:block;padding:25px">Image unavailable</span>'; }},true);

function validateBackup(raw){
  if(raw?.version!==3||!Array.isArray(raw.manga)||!Array.isArray(raw.categories)||!Array.isArray(raw.tags)||!raw.profile)throw Error('Choose an Inklog backup exported from this version.');
  const next=fresh(),p=raw.profile;next.profile={username:String(p.username||'My shelf').slice(0,40),photo:imageURL(p.photo),theme:p.theme==='light'?'light':'dark',accent:['lavender','rose','sage'].includes(p.accent)?p.accent:'lavender',text:p.text==='large'?'large':'standard',layout:p.layout==='compact'?'compact':'comfortable'};
  const words=a=>[...new Set(a.filter(s=>typeof s==='string').map(s=>s.trim()).filter(Boolean))];
  next.categories=words(raw.categories);next.tags=words(raw.tags);
  next.manga=raw.manga.map(m=>{if(!m||typeof m.title!=='string'||!m.title.trim()||!Array.isArray(m.gallery))throw Error('This backup contains an invalid manga entry.');return {id:uid(),title:m.title.slice(0,200),cover:imageURL(m.cover),status:statuses.includes(m.status)?m.status:'Plan to Read',chapter:Math.max(0,Number(m.chapter)||0),total:Math.max(0,Number(m.total)||0),rating:Math.min(5,Math.max(0,Math.round(Number(m.rating)||0))),review:String(m.review||'').slice(0,20000),categories:words(m.categories||[]),tags:words(m.tags||[]),gallery:m.gallery.map(g=>({id:uid(),url:imageURL(g.url),caption:String(g.caption||'')})).filter(g=>g.url),created:Number(m.created)||Date.now(),updated:Number(m.updated)||Date.now()};});
  next.categories=words([...next.categories,...next.manga.flatMap(m=>m.categories)]);next.tags=words([...next.tags,...next.manga.flatMap(m=>m.tags)]);return next;
}
async function start(){root.innerHTML='<div class="loading">Opening your library…</div>';try{data=await openDB();if(!data){let old;try{old=JSON.parse(localStorage.getItem('inklog:v1'));}catch{}await persist(old?.library?migrate(old):fresh());}render();}catch(e){root.innerHTML='<div class="loading"><h1>Storage is unavailable</h1><p>Open Inklog in Safari or Chrome with browser storage enabled.</p></div>';console.error(e);}}
start();
