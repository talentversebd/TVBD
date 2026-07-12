/*===== SCROLL HEADER =====*/
window.addEventListener('scroll', () => {
  const header = document.getElementById('site-header');
  if(!header) return;
  if(window.scrollY > 50) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

/*===== MOBILE NAV =====*/
function toggleMobileNav() {
  const nav = document.getElementById('hnav');
  if(nav) nav.classList.toggle('open');
}

// Close nav when link clicked
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.h-nav a').forEach(a => {
    a.addEventListener('click', () => {
      const nav = document.getElementById('hnav');
      if(nav) nav.classList.remove('open');
    });
  });
});

/*===== TOAST =====*/
function toast(msg, isErr = false) {
  const t = document.getElementById('toast');
  const ico = document.getElementById('t-ico');
  const tmsg = document.getElementById('t-msg');
  if(!t) return;
  if(ico) ico.textContent = isErr ? '❌' : '✅';
  if(tmsg) tmsg.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/*===== SMOOTH SCROLL =====*/
function scrollToSection(id) {
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({ behavior: 'smooth' });
}

/*===== CONTACT FORM =====*/
function submitContact(e) {
  if(e) e.preventDefault();

  const name = document.getElementById('cf-name')?.value.trim();
  const email = document.getElementById('cf-email')?.value.trim();
  const subject = document.getElementById('cf-subject')?.value.trim();
  const message = document.getElementById('cf-message')?.value.trim();

  if(!name) return toast("Please enter your name!", true);
  if(!email) return toast("Please enter your email!", true);
  if(!isValidEmail(email)) return toast("Please enter a valid email!", true);
  if(!message) return toast("Please enter your message!", true);

  // Create mailto link
  const mailtoLink = `mailto:${getHome().femail}?subject=${encodeURIComponent(subject || 'Contact from ' + name)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message)}`;
  window.location.href = mailtoLink;

  toast("Opening your email client... ✅");

  // Reset form
  if(document.getElementById('cf-name')) document.getElementById('cf-name').value = '';
  if(document.getElementById('cf-email')) document.getElementById('cf-email').value = '';
  if(document.getElementById('cf-subject')) document.getElementById('cf-subject').value = '';
  if(document.getElementById('cf-message')) document.getElementById('cf-message').value = '';
}

/*===== EMAIL VALIDATION =====*/
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/*===== SEARCH/FILTER OLYMPIADS =====*/
function filterOlympiads(query, status) {
  const grid = document.getElementById('olymp-grid');
  if(!grid) return;

  const olympiads = getOlympiads();
  grid.innerHTML = '';

  const filtered = olympiads.filter(o => {
    const matchQuery = !query ||
      o.title.toLowerCase().includes(query.toLowerCase()) ||
      o.cat.toLowerCase().includes(query.toLowerCase()) ||
      o.desc.toLowerCase().includes(query.toLowerCase());
    const matchStatus = !status || status === 'all' || o.status === status;
    return matchQuery && matchStatus;
  });

  if(filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="ei">🔍</div>
        <p>No olympiads found matching your search.</p>
      </div>`;
    return;
  }

  filtered.forEach((o, i) => {
    const realIndex = olympiads.indexOf(o);
    const card = document.createElement('div');
    card.className = 'o-card';
    card.onclick = () => openModal(realIndex);
    card.innerHTML = `
      ${o.img
        ? `<img src="${o.img}" class="o-card-img" alt="${o.title}">`
        : `<div class="o-card-noimg">🏆</div>`}
      <div class="o-card-badge">${o.status}</div>
      <div class="o-card-body">
        <h3 class="o-card-title">${o.title}</h3>
        <div class="o-chips">
          <span class="chip">📅 ${o.date || 'TBA'}</span>
          <span class="chip">🏷️ ${o.cat}</span>
          ${o.venue ? `<span class="chip">📍 ${o.venue}</span>` : ''}
        </div>
        <p class="o-card-desc">${o.desc}</p>
        <button class="rm-btn">Read More</button>
      </div>`;
    grid.appendChild(card);
  });
}

/*===== KEYBOARD EVENTS =====*/
document.addEventListener('keydown', e => {
  // Close modal on ESC
  if(e.key === 'Escape') {
    const modal = document.getElementById('o-modal');
    const lb = document.getElementById('lb');
    if(modal && modal.classList.contains('open')) closeModal();
    if(lb && lb.classList.contains('open')) closeLB();
  }
});

/*===== FOOTER DYNAMIC DATA =====*/
function renderFooter() {
  const h = getHome();
  const femail = document.getElementById('f-email');
  const fphone = document.getElementById('f-phone');
  const faddr = document.getElementById('f-addr');
  const fdesc = document.getElementById('f-desc');

  if(femail) { femail.textContent = h.femail; femail.href = 'mailto:' + h.femail; }
  if(fphone) { fphone.textContent = h.fphone; fphone.href = 'tel:' + h.fphone; }
  if(faddr) faddr.textContent = h.faddr;
  if(fdesc) fdesc.textContent = h.fdesc;
}

/*===== PAGE INIT =====*/
document.addEventListener('DOMContentLoaded', () => {
  // Set active nav
  setActiveNav();

  // Render footer
  renderFooter();

  // Page specific init
  const page = window.location.pathname.split('/').pop() || 'index.html';

  if(page === 'index.html' || page === '') {
    renderHome();
    renderOlympiads();
    renderGallery();
    renderNews();
  } else if(page === 'olympiads.html') {
    renderOlympiads();
  } else if(page === 'gallery.html') {
    renderGallery();
  } else if(page === 'news.html') {
    renderNews();
  } else if(page === 'contact.html') {
    renderHome(); // Load contact info
  } else if(page === 'admin.html') {
    checkAdminAuth();
  }
});

/*===== ENTER KEY LOGIN =====*/
document.addEventListener('keydown', e => {
  if(e.key === 'Enter') {
    const lu = document.getElementById('lu');
    const lp = document.getElementById('lp');
    if(document.activeElement === lu || document.activeElement === lp) {
      doLogin();
    }
  }
});

/*===== COPY TO CLIPBOARD =====*/
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    toast("Copied to clipboard! ✅");
  }).catch(() => {
    toast("Failed to copy.", true);
  });
}

/*===== BACK TO TOP =====*/
function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/hide back to top button
window.addEventListener('scroll', () => {
  const btn = document.getElementById('back-to-top');
  if(!btn) return;
  if(window.scrollY > 400) btn.style.display = 'flex';
  else btn.style.display = 'none';
});