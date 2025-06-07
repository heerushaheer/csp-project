// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Elements references
    const welcomePage = document.getElementById('welcomePage');
    const mainApp = document.getElementById('mainApp');
    const enterBtn = document.getElementById('enterBtn');
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const filterBtn = document.getElementById('filterBtn');
    const searchInput = document.getElementById('searchInput');
    const resourcesGrid = document.getElementById('resourcesGrid');
    const classList = document.getElementById('classList');
    const subjectList = document.getElementById('subjectList');
  
    const userWelcome = document.getElementById('userWelcome');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
  
    // Modals
    const loginModal = document.getElementById('loginModal');
    const closeLoginBtn = loginModal.querySelector('.close-btn');
    const loginForm = document.getElementById('loginForm');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
  
    const signupModal = document.getElementById('signupModal');
    const closeSignupBtn = signupModal.querySelector('.close-btn');
    const signupForm = document.getElementById('signupForm');
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupClass = document.getElementById('signupClass');
  
    // Dashboard elements
    const dashboardToggleBtn = document.getElementById('dashboardToggleBtn');
    const dashboard = document.getElementById('dashboard');
    const closeDashboardBtn = document.getElementById('closeDashboardBtn');
    const dashboardTabs = dashboard.querySelectorAll('.dashboard-tab');
    const dashboardContent = document.getElementById('dashboardContent');
  
    // Resources data - static for demo
    const resources = [
      // ... (same resources array from your earlier data)
      { id: 1,class: 6, subject:'Mathematics', title: 'Basic Arithmetic E-book', description: 'Learn addition, subtraction, multiplication, division.', link: 'https://www.free-ebooks.net/education/Basic-Arithmetic.pdf', type: 'pdf' },
      // ... all resources as before including videos, links, etc.
      { id: 23,class: null, subject:null, title: 'CK-12 Foundation', description: 'Explore a wide range of free educational content.', link: 'https://www.ck12.org/student/', type: 'link' }
    ];
  
    let currentUser = null;
  
    // Utility: Save and get user data from localStorage
    function saveUser(user) {
      if (!user || !user.email) return;
      localStorage.setItem(`user_${user.email}`, JSON.stringify(user));
    }
    function getUser(email) {
      const stored = localStorage.getItem(`user_${email}`);
      return stored ? JSON.parse(stored) : null;
    }
  
    // Save bookmarks & progress
    function saveBookmarks() {
      if(!currentUser) return;
      localStorage.setItem(`bookmarks_${currentUser.email}`, JSON.stringify(currentUser.bookmarks || []));
    }
    function loadBookmarks() {
      if(!currentUser) return [];
      const saved = localStorage.getItem(`bookmarks_${currentUser.email}`);
      currentUser.bookmarks = saved ? JSON.parse(saved) : [];
      return currentUser.bookmarks;
    }
  
    function saveProgress(progress) {
      if(!currentUser) return;
      localStorage.setItem(`progress_${currentUser.email}`, JSON.stringify(progress));
    }
    function loadProgress() {
      if(!currentUser) return null;
      const saved = localStorage.getItem(`progress_${currentUser.email}`);
      return saved ? JSON.parse(saved) : null;
    }
  
    // Filter helper
    function getFilters() {
      const selectedClasses = Array.from(classList.querySelectorAll('input[type=checkbox]:checked')).map(cb => Number(cb.dataset.class));
      const selectedSubjects = Array.from(subjectList.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.dataset.subject);
      return { selectedClasses, selectedSubjects };
    }
  
    // Filtering function
    function filterResources(search = '') {
      search = search.toLowerCase().trim();
      let filtered;
      if(currentUser){
        filtered = resources.filter(r => {
          if(r.class === null && r.subject === null) return !search || r.title.toLowerCase().includes(search) || r.description.toLowerCase().includes(search);
          if(r.class === currentUser.class && currentUser.subjects.includes(r.subject)) {
            return !search || r.title.toLowerCase().includes(search) || r.description.toLowerCase().includes(search);
          }
          return false;
        });
      } else {
        const { selectedClasses, selectedSubjects } = getFilters();
        filtered = resources.filter(r => {
          if(r.class === null && r.subject === null) return true;
          if(selectedClasses.length === 0 && selectedSubjects.length === 0) return true;
          return selectedClasses.includes(r.class) && selectedSubjects.includes(r.subject);
        });
        if(search){
          filtered = filtered.filter(r => r.title.toLowerCase().includes(search) || r.description.toLowerCase().includes(search));
        }
      }
      displayResources(filtered);
    }
  
    // Display filtered resources
    function displayResources(resourcesList) {
      resourcesGrid.innerHTML = '';
      if(resourcesList.length === 0){
        resourcesGrid.innerHTML = `<p style="color: #666;">No resources found matching your criteria.</p>`;
        return;
      }
  
      resourcesList.forEach(resource => {
        const card = document.createElement('article');
        card.className = 'resource-card';
        card.tabIndex = 0;
  
        const h3 = document.createElement('h3');
        h3.textContent = resource.title;
        card.appendChild(h3);
  
        const pDesc = document.createElement('p');
        pDesc.textContent = resource.description;
        card.appendChild(pDesc);
  
        if(resource.class !== null && resource.subject !== null){
          const info = document.createElement('p');
          info.className = 'resource-info';
          info.textContent = `Class ${resource.class} | Subject: ${resource.subject}`;
          card.appendChild(info);
        }
  
        // Bookmark toggle for logged-in users
        const linksDiv = document.createElement('div');
        linksDiv.className = 'resource-links';
  
        if(currentUser){
          const bookmarkBtn = document.createElement('button');
          bookmarkBtn.className = 'bookmark-toggle';
          bookmarkBtn.type = 'button';
          bookmarkBtn.setAttribute('aria-label', 'Toggle bookmark for resource');
          bookmarkBtn.textContent = isBookmarked(resource.id) ? '★' : '☆';
          bookmarkBtn.addEventListener('click', () => {
            toggleBookmark(resource);
            bookmarkBtn.textContent = isBookmarked(resource.id) ? '★' : '☆';
          });
          linksDiv.appendChild(bookmarkBtn);
        }
  
        const resourceLink = document.createElement(resource.type === 'pdf' ? 'a' : 'a');
        resourceLink.href = resource.link;
        resourceLink.target = '_blank';
        resourceLink.rel = 'noopener noreferrer';
        resourceLink.textContent = resource.type === 'pdf' ? 'Download PDF' : (resource.type === 'video' ? 'Watch Video' : 'Visit');
        if(resource.type === 'pdf') resourceLink.setAttribute('download', '');
        linksDiv.appendChild(resourceLink);
  
        card.appendChild(linksDiv);
        resourcesGrid.appendChild(card);
      });
    }
  
    // Bookmark helpers
    function toggleBookmark(resource){
      if(!currentUser) return alert('Please log in to bookmark resources.');
      if(!currentUser.bookmarks) currentUser.bookmarks = [];
      const idx = currentUser.bookmarks.findIndex(b => b.id === resource.id);
      if(idx === -1){
        currentUser.bookmarks.push(resource);
      } else {
        currentUser.bookmarks.splice(idx, 1);
      }
      saveBookmarks();
    }
    function isBookmarked(id){
      return currentUser?.bookmarks?.some(b => b.id === id);
    }
  
    // --- UI update for login state ---
    function updateUIForLoginState(){
      if(currentUser){
        userWelcome.hidden = false;
        userNameDisplay.textContent = currentUser.name;
        loginBtn.hidden = true;
        signupBtn.hidden = true;
        logoutBtn.hidden = false;
  
        // Lock filters to user prefs
        classList.querySelectorAll('input[type=checkbox]').forEach(input => {
          input.checked = (parseInt(input.dataset.class) === currentUser.class);
          input.disabled = true;
        });
        subjectList.querySelectorAll('input[type=checkbox]').forEach(input => {
          input.checked = currentUser.subjects.includes(input.dataset.subject);
          input.disabled = true;
        });
        filterBtn.disabled = true;
  
        filterResources();
      }
      else {
        userWelcome.hidden = true;
        userNameDisplay.textContent = '';
        loginBtn.hidden = false;
        signupBtn.hidden = false;
        logoutBtn.hidden = true;
  
        // Unlock filters
        classList.querySelectorAll('input[type=checkbox]').forEach(input => {
          input.checked = false;
          input.disabled = false;
        });
        subjectList.querySelectorAll('input[type=checkbox]').forEach(input => {
          input.checked = false;
          input.disabled = false;
        });
        filterBtn.disabled = false;
  
        filterResources();
      }
    }
  
    // --- Login and Signup modal controls ---
    function openModal(modal){
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const firstField = modal.querySelector('input, select, button');
      if(firstField) firstField.focus();
    }
    function closeModal(modal){
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  
    // Open modals
    loginBtn.addEventListener('click', () => openModal(loginModal));
    signupBtn.addEventListener('click', () => openModal(signupModal));
    // Close modals
    closeLoginBtn.addEventListener('click', () => closeModal(loginModal));
    closeSignupBtn.addEventListener('click', () => closeModal(signupModal));
    // Click outside modal closes it
    loginModal.addEventListener('click', e => { if(e.target===loginModal) closeModal(loginModal); });
    signupModal.addEventListener('click', e => { if(e.target===signupModal) closeModal(signupModal); });
  
    // Login form submit
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = loginEmailInput.value.trim().toLowerCase();
      const password = loginPasswordInput.value;
      if(!email || !password) return alert('Please provide email and password.');
      const user = getUser(email);
      if(!user) return alert('No user found. Please sign up.');
      if(user.password !== password) return alert('Incorrect password.');
      currentUser = user;
      loadBookmarks();
      closeModal(loginModal);
      updateUIForLoginState();
      alert(`Welcome back, ${currentUser.name}!`);
    });
  
    // Signup form submit
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = signupName.value.trim();
      const email = signupEmail.value.trim().toLowerCase();
      const password = signupPassword.value;
      const classVal = parseInt(signupClass.value);
      const subjects = Array.from(signupForm.querySelectorAll('input[name="subjects"]:checked')).map(cb => cb.value);
      if(!name || !email || !password || !classVal || subjects.length === 0){
        return alert('Complete all fields and select at least one subject.');
      }
      if(getUser(email)) return alert('User already exists. Please login.');
      const newUser = {
        name,
        email,
        password,
        class: classVal,
        subjects,
        bookmarks: [],
        prefClasses: [classVal],
        prefSubjects: subjects
      };
      saveUser(newUser);
      currentUser = newUser;
      closeModal(signupModal);
      updateUIForLoginState();
      alert(`Welcome, ${name}! Your account was created.`);
    });
  
    // Logout
    logoutBtn.addEventListener('click', () => {
      currentUser = null;
      updateUIForLoginState();
      hideDashboard();
    });
  
    // Filter sidebar toggle
    menuToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('hidden');
      mainContent.classList.toggle('shifted-sidebar');
      menuToggleBtn.setAttribute('aria-expanded', !sidebar.classList.contains('hidden'));
    });
  
    // Dashboard toggle
    dashboardToggleBtn.addEventListener('click', () => {
      // Close sidebar if open
      if(!sidebar.classList.contains('hidden')){
        sidebar.classList.add('hidden');
        mainContent.classList.remove('shifted-sidebar');
        menuToggleBtn.setAttribute('aria-expanded', false);
      }
      toggleDashboard();
    });
  
    closeDashboardBtn.addEventListener('click', hideDashboard);
  
    // Dashboard tab logic
    dashboardTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        switchDashboardTab(tab.dataset.tab);
      });
    });
  
    // Switch dashboard content tab
    function switchDashboardTab(tabName) {
      dashboardTabs.forEach(tab => {
        const active = tab.dataset.tab === tabName;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', active);
        tab.tabIndex = active ? 0 : -1;
      });
      dashboardContent.innerHTML = '';
      if(tabName === 'profile') renderProfileTab();
      else if(tabName === 'bookmarks') renderBookmarksTab();
      else if(tabName === 'progress') renderProgressTab();
      else if(tabName === 'settings') renderSettingsTab();
    }
  
    // Render profile tab content
    function renderProfileTab() {
      if(!currentUser){
        dashboardContent.textContent = 'Please log in or sign up to view profile information.';
        return;
      }
      dashboardContent.innerHTML = `
        <h3>Profile Information</h3>
        <p><strong>Name:</strong> ${currentUser.name}</p>
        <p><strong>Email:</strong> ${currentUser.email}</p>
        <p><strong>Class:</strong> ${currentUser.class}th Grade</p>
        <p><strong>Subjects:</strong> ${currentUser.subjects.join(', ')}</p>
      `;
    }
  
    // Render bookmarks tab content
    function renderBookmarksTab() {
      if(!currentUser){
        dashboardContent.textContent = 'Please log in or sign up to view your bookmarks.';
        return;
      }
      loadBookmarks();
      if(!currentUser.bookmarks.length){
        dashboardContent.textContent = 'No bookmarks found.';
        return;
      }
      dashboardContent.innerHTML = '<h3>Your Bookmarked Resources</h3>';
      const container = document.createElement('div');
      currentUser.bookmarks.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bookmark-item';
        div.innerHTML = `<strong>${item.title}</strong><br/><a href="${item.link}" target="_blank" rel="noopener noreferrer">Open Resource</a>`;
        container.appendChild(div);
      });
      dashboardContent.appendChild(container);
    }
  
    // Render progress tab content
    function renderProgressTab() {
      if(!currentUser){
        dashboardContent.textContent = 'Please log in or sign up to view progress.';
        return;
      }
      const prog = loadProgress();
      if(!prog){
        dashboardContent.textContent = 'No progress recorded yet.';
        return;
      }
      dashboardContent.innerHTML = `
        <h3>Your Progress</h3>
        <p><strong>Completed:</strong> ${prog.completed}</p>
        <p><strong>Total:</strong> ${prog.total}</p>
        <p>${prog.details}</p>
      `;
    }
  
    // Render settings tab content
    function renderSettingsTab() {
      if(!currentUser){
        dashboardContent.textContent = 'Please log in or sign up to access settings.';
        return;
      }
      const prefClasses = currentUser.prefClasses || [];
      const prefSubjects = currentUser.prefSubjects || [];
      dashboardContent.innerHTML = `
        <h3>Settings</h3>
        <form id="settingsForm" class="settings-form" aria-label="Settings form">
          <label for="currentPassword">Current Password</label>
          <input type="password" id="currentPassword" name="currentPassword" required />
          <label for="newPassword">New Password</label>
          <input type="password" id="newPassword" name="newPassword" required />
          <label for="confirmPassword">Confirm New Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required />
          <label for="changeEmail">Change Email</label>
          <input type="email" id="changeEmail" name="changeEmail" value="${currentUser.email}" required />
          <fieldset>
            <legend>Preferred Classes</legend>
            <label><input type="checkbox" name="prefClasses" value="6" ${prefClasses.includes(6) ? 'checked' : ''}/>6th Grade</label>
            <label><input type="checkbox" name="prefClasses" value="7" ${prefClasses.includes(7) ? 'checked' : ''}/>7th Grade</label>
            <label><input type="checkbox" name="prefClasses" value="8" ${prefClasses.includes(8) ? 'checked' : ''}/>8th Grade</label>
            <label><input type="checkbox" name="prefClasses" value="9" ${prefClasses.includes(9) ? 'checked' : ''}/>9th Grade</label>
            <label><input type="checkbox" name="prefClasses" value="10" ${prefClasses.includes(10) ? 'checked' : ''}/>10th Grade</label>
          </fieldset>
          <fieldset>
            <legend>Preferred Subjects</legend>
            <label><input type="checkbox" name="prefSubjects" value="Mathematics" ${prefSubjects.includes('Mathematics') ? 'checked' : ''}/>Mathematics</label>
            <label><input type="checkbox" name="prefSubjects" value="Science" ${prefSubjects.includes('Science') ? 'checked' : ''}/>Science</label>
            <label><input type="checkbox" name="prefSubjects" value="English" ${prefSubjects.includes('English') ? 'checked' : ''}/>English</label>
            <label><input type="checkbox" name="prefSubjects" value="History" ${prefSubjects.includes('History') ? 'checked' : ''}/>History</label>
            <label><input type="checkbox" name="prefSubjects" value="Geography" ${prefSubjects.includes('Geography') ? 'checked' : ''}/>Geography</label>
          </fieldset>
          <button type="submit" class="save-btn">Save Changes</button>
        </form>
      `;
      const settingsForm = document.getElementById('settingsForm');
      settingsForm.addEventListener('submit', e => {
        e.preventDefault();
        const currentPass = settingsForm.currentPassword.value.trim();
        const newPass = settingsForm.newPassword.value.trim();
        const confirmPass = settingsForm.confirmPassword.value.trim();
        const newEmail = settingsForm.changeEmail.value.trim();
        const selectedClasses = Array.from(settingsForm.querySelectorAll('input[name="prefClasses"]:checked')).map(cb => Number(cb.value));
        const selectedSubjects = Array.from(settingsForm.querySelectorAll('input[name="prefSubjects"]:checked')).map(cb => cb.value);
  
        if(currentPass !== currentUser.password) return alert('Current password incorrect.');
        if(newPass !== confirmPass) return alert('New passwords do not match.');
        if(!newEmail) return alert('Email cannot be empty.');
  
        currentUser.password = newPass;
        currentUser.email = newEmail;
        currentUser.prefClasses = selectedClasses;
        currentUser.prefSubjects = selectedSubjects;
  
        saveUser(currentUser);
        alert('Settings saved successfully.');
  
        updateUIForLoginState();
      });
    }
  
    // Dashboard toggle handler
    function toggleDashboard(){
      const shown = !dashboard.classList.contains('hidden');
      if(shown){
        hideDashboard();
      } else {
        showDashboard();
      }
    }
    function showDashboard(){
      dashboard.classList.remove('hidden');
      dashboard.setAttribute('aria-hidden', 'false');
      dashboardToggleBtn.setAttribute('aria-expanded', 'true');
      switchDashboardTab('profile');
      dashboard.focus();
    }
    function hideDashboard(){
      dashboard.classList.add('hidden');
      dashboard.setAttribute('aria-hidden', 'true');
      dashboardToggleBtn.setAttribute('aria-expanded', 'false');
    }
  
    // Enter button: open main app, hide welcome page
    enterBtn.addEventListener('click', () => {
      welcomePage.classList.add('hidden');
      mainApp.classList.remove('hidden');
      updateUIForLoginState();
      searchInput.focus();
    });
  
    // Filters
    filterBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterResources();
      sidebar.classList.add('hidden');
      mainContent.classList.remove('shifted-sidebar');
      menuToggleBtn.setAttribute('aria-expanded', 'false');
    });
  
    // Search filtering live
    searchInput.addEventListener('input', () => {
      filterResources(searchInput.value);
    });
  
    // Initialize
    filterResources();
    updateUIForLoginState();
  });
  