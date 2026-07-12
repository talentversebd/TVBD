/*===== ADMIN OPEN/CLOSE =====*/
function openAdmin() {
  window.location.href = 'admin.html';
}

function closeAdmin() {
  window.location.href = 'index.html';
}

function doLogout() {
  sessionStorage.removeItem('tv_admin_logged');
  window.location.href = 'index.html';
}

/*===== LOGIN CHECK =====*/
function checkAdminAuth() {
  const logged = sessionStorage.getItem('tv_admin_logged');
  if(!logged) {
    document.getElementById('adm-login').classList.remove('hidden');
    document.getElementById('adm-shell').style.display = 'none';
  } else {
    document.getElementById('adm-login').classList.add('hidden');
    document.getElementById('adm-shell').style.display = 'flex';
    renderAdminAll();
  }
}

function doLogin() {
  const u = document.getElementById('lu').value.trim();
  const p = document.getElementById('lp').value;
  const err = document.getElementById('lerr');

  if(!u || !p) {
    err.classList.add('show');
    err.textContent = "Please fill in all fields.";
    setTimeout(() => err.classList.remove('show'), 3000);
    return;
  }

  if(checkLogin(u, p)) {
    sessionStorage.setItem('tv_admin_logged', '1');
    document.getElementById('adm-login').classList.add('hidden');
    document.getElementById('adm-shell').style.display = 'flex';
    renderAdminAll();
    toast("Welcome back, Admin! 👋");
  } else {
    err.classList.add('show');
    err.textContent = "Incorrect username or password.";
    setTimeout(() => err.classList.remove('show'), 3000);
  }
}

/*===== SIDEBAR =====*/
function openSidebar() {
  document.getElementById('adm-sb').classList.add('open');
  document.getElementById('sb-ov').classList.add('open');
}

function closeSidebar() {
  document.getElementById('adm-sb').classList.remove('open');
  document.getElementById('sb-ov').classList.remove('open');
}

/*===== NAVIGATION =====*/
function goSec(btn) {
  const secId = btn.getAttribute('data-sec');

  // Sections
  document.querySelectorAll('.adm-sec').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById(secId);
  if(sec) sec.classList.add('active');

  // Nav Buttons
  document.querySelectorAll('.adm-nb').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Page Title
  const titles = {
    'dash': 'Dashboard',
    'home-ed': 'Home Page Editor',
    'olymp-adm': 'Manage Olympiads',
    'gal-adm': 'Gallery Manager',
    'news-adm': 'News Updates',
    'set-adm': 'System Settings'
  };
  const ptitle = document.getElementById('adm-ptitle');
  if(ptitle) ptitle.textContent = titles[secId] || secId;

  // Topbar Actions
  const actions = document.getElementById('adm-topbar-actions');
  if(actions) {
    actions.innerHTML = '';
    if(secId === 'home-ed') {
      actions.innerHTML = `<button class="save-btn" onclick="saveHomeEditor()">💾 Save Changes</button>`;
    } else if(secId === 'set-adm') {
      actions.innerHTML = `<button class="save-btn" onclick="saveAdminSettings()">💾 Save Settings</button>`;
    } else if(secId === 'olymp-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="openOlympiadForm()">+ Add Olympiad</button>`;
    } else if(secId === 'gal-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="openGalleryForm()">+ Add Media</button>`;
    } else if(secId === 'news-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="openNewsForm()">+ Add News</button>`;
    }
  }

  // Close sidebar on mobile
  if(window.innerWidth <= 700) closeSidebar();
}

/*===== RENDER ADMIN ALL =====*/
function renderAdminAll() {
  renderDashboard();
  renderOlympiadTable();
  renderGalleryTable();
  renderNewsTable();
  loadHomeEditor();
  loadSettings();
}

/*===== DASHBOARD =====*/
function renderDashboard() {
  const olympiads = getOlympiads();
  const gallery = getGallery();
  const news = getNews();

  const active = olympiads.filter(o => o.status === 'active').length;
  const upcoming = olympiads.filter(o => o.status === 'upcoming').length;
  const past = olympiads.filter(o => o.status === 'past').length;

  const stats = document.getElementById('db-stats');
  if(stats) {
    stats.innerHTML = `
      <div class="stat-card">
        <div class="sl">Total Olympiads</div>
        <div class="sv">${olympiads.length}</div>
      </div>
      <div class="stat-card">
        <div class="sl">Active Now</div>
        <div class="sv">${active}</div>
      </div>
      <div class="stat-card">
        <div class="sl">Upcoming</div>
        <div class="sv">${upcoming}</div>
      </div>
      <div class="stat-card">
        <div class="sl">Past Events</div>
        <div class="sv">${past}</div>
      </div>
      <div class="stat-card">
        <div class="sl">Gallery Items</div>
        <div class="sv">${gallery.length}</div>
      </div>
      <div class="stat-card">
        <div class="sl">News Posts</div>
        <div class="sv">${news.length}</div>
      </div>`;
  }

  // Recent Olympiads
  const recent = document.getElementById('db-recent');
  if(recent) {
    if(olympiads.length === 0) {
      recent.innerHTML = `<tr class="empty-row"><td colspan="3">No olympiads added yet</td></tr>`;
    } else {
      recent.innerHTML = '';
      olympiads.slice(-5).reverse().forEach(o => {
        recent.innerHTML += `
          <tr>
            <td>${o.title}</td>
            <td><span class="bs bs-${o.status}">${o.status}</span></td>
            <td>${o.date || 'TBA'}</td>
          </tr>`;
      });
    }
  }
}

/*===== OLYMPIAD TABLE =====*/
function renderOlympiadTable() {
  const tbody = document.getElementById('otbl');
  if(!tbody) return;

  const olympiads = getOlympiads();
  if(olympiads.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No olympiads yet. Click "+ Add Olympiad" to get started.</td></tr>`;
    return;
  }

  tbody.innerHTML = '';
  olympiads.forEach((o, i) => {
    tbody.innerHTML += `
      <tr>
        <td>
          ${o.img
            ? `<img src="${o.img}" class="thumb" alt="cover">`
            : `<div class="thumb" style="background:var(--card2);display:flex;align-items:center;justify-content:center;font-size:1.2rem">🏆</div>`}
        </td>
        <td>${o.title}</td>
        <td>${o.cat}</td>
        <td>${o.date || 'TBA'}</td>
        <td><span class="bs bs-${o.status}">${o.status}</span></td>
        <td class="tbl-acts">
          <button class="e-btn" onclick="editOlympiad(${i})">Edit</button>
          <button class="d-btn" onclick="deleteOlympiad(${i})">Delete</button>
        </td>
      </tr>`;
  });
}

/*===== GALLERY TABLE =====*/
function renderGalleryTable() {
  const tbody = document.getElementById('gtbl');
  if(!tbody) return;

  const gallery = getGallery();
  if(gallery.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="4">No media yet. Click "+ Add Media" to get started.</td></tr>`;
    return;
  }

  tbody.innerHTML = '';
  gallery.forEach((g, i) => {
    tbody.innerHTML += `
      <tr>
        <td>
          ${g.type === 'video'
            ? `<div class="thumb" style="background:var(--card2);display:flex;align-items:center;justify-content:center;font-size:1.5rem">🎥</div>`
            : `<img src="${g.url}" class="thumb" alt="${g.cap}">`}
        </td>
        <td>${g.cap || '—'}</td>
        <td>${g.type}</td>
        <td class="tbl-acts">
          <button class="e-btn" onclick="editGallery(${i})">Edit</button>
          <button class="d-btn" onclick="deleteGallery(${i})">Delete</button>
        </td>
      </tr>`;
  });
}

/*===== NEWS TABLE =====*/
function renderNewsTable() {
  const tbody = document.getElementById('ntbl');
  if(!tbody) return;

  const news = getNews();
  if(news.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="3">No news yet. Click "+ Add News" to get started.</td></tr>`;
    return;
  }

  tbody.innerHTML = '';
  news.forEach((n, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${n.title}</td>
        <td>${n.date}</td>
        <td class="tbl-acts">
          <button class="e-btn" onclick="editNews(${i})">Edit</button>
          <button class="d-btn" onclick="deleteNews(${i})">Delete</button>
        </td>
      </tr>`;
  });
}

/*===== HOME EDITOR =====*/
function loadHomeEditor() {
  const h = getHome();
  const fields = {
    'he-badge': h.badge, 'he-title': h.title,
    'he-sub': h.sub, 'he-b1': h.b1, 'he-b2': h.b2,
    'he-odesc': h.odesc, 'he-s1n': h.s1n, 'he-s1l': h.s1l,
    'he-s2n': h.s2n, 'he-s2l': h.s2l, 'he-s3n': h.s3n,
    'he-s3l': h.s3l, 'he-quote': h.quote, 'he-fdesc': h.fdesc,
    'he-femail': h.femail, 'he-fphone': h.fphone, 'he-faddr': h.faddr
  };
  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if(el) el.value = val || '';
  });
}

function saveHomeEditor() {
  const data = {
    badge: document.getElementById('he-badge')?.value || '',
    title: document.getElementById('he-title')?.value || '',
    sub: document.getElementById('he-sub')?.value || '',
    b1: document.getElementById('he-b1')?.value || '',
    b2: document.getElementById('he-b2')?.value || '',
    odesc: document.getElementById('he-odesc')?.value || '',
    s1n: document.getElementById('he-s1n')?.value || '',
    s1l: document.getElementById('he-s1l')?.value || '',
    s2n: document.getElementById('he-s2n')?.value || '',
    s2l: document.getElementById('he-s2l')?.value || '',
    s3n: document.getElementById('he-s3n')?.value || '',
    s3l: document.getElementById('he-s3l')?.value || '',
    quote: document.getElementById('he-quote')?.value || '',
    fdesc: document.getElementById('he-fdesc')?.value || '',
    femail: document.getElementById('he-femail')?.value || '',
    fphone: document.getElementById('he-fphone')?.value || '',
    faddr: document.getElementById('he-faddr')?.value || ''
  };
  updateHome(data);
  toast("Home page updated successfully! ✅");
}

/*===== SETTINGS =====*/
function loadSettings() {
  const u = document.getElementById('set-u');
  if(u) u.value = state.admin.u || '';
}

function saveAdminSettings() {
  const u = document.getElementById('set-u')?.value.trim();
  const p = document.getElementById('set-p')?.value;
  if(!u) return toast("Username cannot be empty!", true);
  updateAdmin(u, p);
  if(document.getElementById('set-p')) document.getElementById('set-p').value = '';
  toast("Settings saved successfully! ✅");
}

/*===== FORM MODAL =====*/
function openFM(id) {
  const el = document.getElementById(id);
  if(el) el.classList.add('open');
}

function closeFM(id) {
  const el = document.getElementById(id);
  if(el) el.classList.remove('open');
}

/*===== OLYMPIAD FORM =====*/
function openOlympiadForm() {
  document.getElementById('ofm-title').textContent = "Add Olympiad";
  document.getElementById('of-eid').value = "";
  const fields = ['of-t','of-dt','of-rd','of-v','of-pr','of-el','of-fe','of-rl','of-ds','of-fd','of-iu'];
  fields.forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
  document.getElementById('of-cat').value = 'Mathematics';
  document.getElementById('of-st').value = 'upcoming';
  document.getElementById('of-iprev').innerHTML = '';
  openFM('ofm');
}

function editOlympiad(i) {
  const o = getOlympiads()[i];
  if(!o) return;
  document.getElementById('ofm-title').textContent = "Edit Olympiad";
  document.getElementById('of-eid').value = i;
  document.getElementById('of-t').value = o.title || '';
  document.getElementById('of-cat').value = o.cat || 'Mathematics';
  document.getElementById('of-st').value = o.status || 'upcoming';
  document.getElementById('of-dt').value = o.date || '';
  document.getElementById('of-rd').value = o.deadline || '';
  document.getElementById('of-v').value = o.venue || '';
  document.getElementById('of-pr').value = o.prize || '';
  document.getElementById('of-el').value = o.eligibility || '';
  document.getElementById('of-fe').value = o.fee || '';
  document.getElementById('of-rl').value = o.regLink || '';
  document.getElementById('of-ds').value = o.desc || '';
  document.getElementById('of-fd').value = o.fullDesc || '';
  document.getElementById('of-iu').value = o.img || '';
  document.getElementById('of-iprev').innerHTML = o.img ? `<img src="${o.img}">` : '';
  openFM('ofm');
}

function saveOlympiad() {
  const title = document.getElementById('of-t').value.trim();
  const desc = document.getElementById('of-ds').value.trim();
  if(!title) return toast("Title is required!", true);
  if(!desc) return toast("Short description is required!", true);

  const o = {
    title,
    desc,
    cat: document.getElementById('of-cat').value,
    status: document.getElementById('of-st').value,
    date: document.getElementById('of-dt').value,
    deadline: document.getElementById('of-rd').value,
    venue: document.getElementById('of-v').value,
    prize: document.getElementById('of-pr').value,
    eligibility: document.getElementById('of-el').value,
    fee: document.getElementById('of-fe').value,
    regLink: document.getElementById('of-rl').value,
    fullDesc: document.getElementById('of-fd').value,
    img: document.getElementById('of-iu').value
  };

  const eid = document.getElementById('of-eid').value;
  if(eid === '') addOlympiad(o);
  else updateOlympiad(parseInt(eid), o);

  renderOlympiadTable();
  renderDashboard();
  closeFM('ofm');
  toast("Olympiad saved successfully! ✅");
}

function deleteOlympiad(i) {
  if(!confirm("Are you sure you want to delete this olympiad?")) return;
  deleteOlympiadData(i);
  renderOlympiadTable();
  renderDashboard();
  toast("Olympiad deleted.");
}

/*===== GALLERY FORM =====*/
function openGalleryForm() {
  document.getElementById('gfm-title').textContent = "Add Media";
  document.getElementById('gf-eid').value = '';
  document.getElementById('gf-cap').value = '';
  document.getElementById('gf-type').value = 'image';
  document.getElementById('gf-url').value = '';
  document.getElementById('gf-prev').innerHTML = '';
  openFM('gfm');
}

function editGallery(i) {
  const g = getGallery()[i];
  if(!g) return;
  document.getElementById('gfm-title').textContent = "Edit Media";
  document.getElementById('gf-eid').value = i;
  document.getElementById('gf-cap').value = g.cap || '';
  document.getElementById('gf-type').value = g.type || 'image';
  document.getElementById('gf-url').value = g.url || '';
  document.getElementById('gf-prev').innerHTML = g.type === 'video'
    ? `<div style="font-size:2rem;padding:10px">🎥</div>`
    : `<img src="${g.url}">`;
  openFM('gfm');
}

function saveGallery() {
  const url = document.getElementById('gf-url').value.trim();
  if(!url) return toast("URL or file is required!", true);

  const g = {
    cap: document.getElementById('gf-cap').value.trim(),
    type: document.getElementById('gf-type').value,
    url
  };

  const eid = document.getElementById('gf-eid').value;
  if(eid === '') addGallery(g);
  else updateGallery(parseInt(eid), g);

  renderGalleryTable();
  renderDashboard();
  closeFM('gfm');
  toast("Media saved successfully! ✅");
}

function deleteGallery(i) {
  if(!confirm("Delete this media?")) return;
  deleteGalleryData(i);
  renderGalleryTable();
  renderDashboard();
  toast("Media deleted.");
}

/*===== NEWS FORM =====*/
function openNewsForm() {
  document.getElementById('nfm-title').textContent = "Add News";
  document.getElementById('nf-eid').value = '';
  document.getElementById('nf-t').value = '';
  document.getElementById('nf-b').value = '';
  document.getElementById('nf-d').value = new Date().toISOString().split('T')[0];
  openFM('nfm');
}

function editNews(i) {
  const n = getNews()[i];
  if(!n) return;
  document.getElementById('nfm-title').textContent = "Edit News";
  document.getElementById('nf-eid').value = i;
  document.getElementById('nf-t').value = n.title || '';
  document.getElementById('nf-d').value = n.date || '';
  document.getElementById('nf-b').value = n.body || '';
  openFM('nfm');
}

function saveNews() {
  const title = document.getElementById('nf-t').value.trim();
  const body = document.getElementById('nf-b').value.trim();
  if(!title) return toast("Headline is required!", true);
  if(!body) return toast("News body is required!", true);

  const n = {
    title,
    body,
    date: document.getElementById('nf-d').value
  };

  const eid = document.getElementById('nf-eid').value;
  if(eid === '') addNews(n);
  else updateNews(parseInt(eid), n);

  renderNewsTable();
  renderDashboard();
  closeFM('nfm');
  toast("News saved successfully! ✅");
}

function deleteNews(i) {
  if(!confirm("Delete this news?")) return;
  deleteNewsData(i);
  renderNewsTable();
  renderDashboard();
  toast("News deleted.");
}

/*===== FILE UPLOAD PREVIEW =====*/
function prevOImg(input) {
  if(!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('of-iu').value = e.target.result;
    document.getElementById('of-iprev').innerHTML = `<img src="${e.target.result}">`;
  };
  reader.readAsDataURL(input.files[0]);
}

function prevGFile(input) {
  if(!input.files || !input.files[0]) return;
  const isVideo = input.files[0].type.includes('video');
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('gf-url').value = e.target.result;
    document.getElementById('gf-type').value = isVideo ? 'video' : 'image';
    document.getElementById('gf-prev').innerHTML = isVideo
      ? `<div style="font-size:2rem;padding:10px">🎥 Video Uploaded</div>`
      : `<img src="${e.target.result}">`;
  };
  reader.readAsDataURL(input.files[0]);
}