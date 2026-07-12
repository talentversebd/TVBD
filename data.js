/*===== DEFAULT STATE =====*/
const DEFAULT_STATE = {
  admin: { u: "admin", p: "1234" },
  home: {
    badge: "Bangladesh's Premier Olympiad Hub",
    title: "Where [Talent] Meets Opportunity",
    sub: "Connecting ambitious students with national & international olympiads, competitions, and academic excellence programs across Bangladesh.",
    b1: "Explore Olympiads",
    b2: "Learn More",
    odesc: "Discover upcoming olympiads and competitions designed to elevate your potential.",
    s1n: "50+", s1l: "Olympiads Listed",
    s2n: "10K+", s2l: "Students Reached",
    s3n: "64", s3l: "Districts Covered",
    quote: '"Every child in Bangladesh deserves to know about the opportunity that awaits their talent."',
    fdesc: "TalentVerse Bangladesh is the country's most dedicated platform for olympiad information, resources, and community — bridging the gap between aspiring students and world-class competition opportunities.",
    femail: "talentversebd@gmail.com",
    fphone: "+880 1634-428536",
    faddr: "Dhaka, Bangladesh"
  },
  olympiads: [],
  gallery: [],
  news: []
};

/*===== LOAD STATE =====*/
let state;
try {
  const saved = localStorage.getItem('tv_bd_data');
  state = saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_STATE));
} catch(e) {
  state = JSON.parse(JSON.stringify(DEFAULT_STATE));
}

/*===== SAVE STATE =====*/
function save() {
  try {
    localStorage.setItem('tv_bd_data', JSON.stringify(state));
  } catch(e) {
    console.error('Save failed:', e);
  }
  if(typeof renderAll === 'function') renderAll();
}

/*===== RESET STATE =====*/
function resetState() {
  if(confirm("Are you sure? This will delete ALL data!")) {
    localStorage.removeItem('tv_bd_data');
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    save();
    toast("Data reset successfully!");
  }
}

/*===== GET HOME DATA =====*/
function getHome() {
  return state.home;
}

/*===== OLYMPIAD CRUD =====*/
function getOlympiads() {
  return state.olympiads || [];
}

function addOlympiad(o) {
  state.olympiads.push(o);
  save();
}

function updateOlympiad(i, o) {
  state.olympiads[i] = o;
  save();
}

function deleteOlympiadData(i) {
  state.olympiads.splice(i, 1);
  save();
}

/*===== GALLERY CRUD =====*/
function getGallery() {
  return state.gallery || [];
}

function addGallery(g) {
  state.gallery.push(g);
  save();
}

function updateGallery(i, g) {
  state.gallery[i] = g;
  save();
}

function deleteGalleryData(i) {
  state.gallery.splice(i, 1);
  save();
}

/*===== NEWS CRUD =====*/
function getNews() {
  return state.news || [];
}

function addNews(n) {
  state.news.push(n);
  save();
}

function updateNews(i, n) {
  state.news[i] = n;
  save();
}

function deleteNewsData(i) {
  state.news.splice(i, 1);
  save();
}

/*===== ADMIN CRUD =====*/
function checkLogin(u, p) {
  return u === state.admin.u && p === state.admin.p;
}

function updateAdmin(u, p) {
  state.admin.u = u;
  if(p) state.admin.p = p;
  save();
}

function updateHome(data) {
  state.home = { ...state.home, ...data };
  save();
}