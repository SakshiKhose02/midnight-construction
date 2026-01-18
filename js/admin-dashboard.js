/**
 * ADMIN DASHBOARD - JavaScript
 */

(function() {
  'use strict';

  // ==================== CONFIGURATION ====================
  const API_URL = '../php/admin-api.php';

  // ==================== STATE ====================
  const state = {
    currentView: 'overview',
    currentPage: 1,
    totalPages: 1,
    filters: {
      status: 'all',
      search: ''
    },
    quotations: [],
    stats: {}
  };

  // ==================== DOM ELEMENTS ====================
  const elements = {
    loginScreen: document.getElementById('loginScreen'),
    dashboard: document.getElementById('dashboard'),
    loginForm: document.getElementById('loginForm'),
    loginError: document.getElementById('loginError'),
    logoutBtn: document.getElementById('logoutBtn'),
    userName: document.getElementById('userName'),
    navItems: document.querySelectorAll('.nav-item'),
    views: document.querySelectorAll('.view'),
    pageTitle: document.getElementById('pageTitle'),
    pageSubtitle: document.getElementById('pageSubtitle'),
    
    // Stats
    totalQuotations: document.getElementById('totalQuotations'),
    pendingQuotations: document.getElementById('pendingQuotations'),
    contactedQuotations: document.getElementById('contactedQuotations'),
    totalBudget: document.getElementById('totalBudget'),
    pendingBadge: document.getElementById('pendingBadge'),
    
    // Tables
    recentQuotations: document.getElementById('recentQuotations'),
    quotationsTable: document.getElementById('quotationsTable'),
    
    // Filters
    statusFilter: document.getElementById('statusFilter'),
    searchInput: document.getElementById('searchInput'),
    refreshBtn: document.getElementById('refreshBtn'),
    
    // Pagination
    pagination: document.getElementById('pagination'),
    prevPage: document.getElementById('prevPage'),
    nextPage: document.getElementById('nextPage'),
    pageInfo: document.getElementById('pageInfo'),
    
    // Modal
    quotationModal: document.getElementById('quotationModal'),
    quotationDetails: document.getElementById('quotationDetails')
  };

  // ==================== INITIALIZATION ====================
  function init() {
    checkAuth();
    setupEventListeners();
  }

  // ==================== EVENT LISTENERS ====================
  function setupEventListeners() {
    // Login
    elements.loginForm.addEventListener('submit', handleLogin);
    
    // Logout
    elements.logoutBtn.addEventListener('click', handleLogout);
    
    // Navigation
    elements.navItems.forEach(item => {
      item.addEventListener('click', handleNavigation);
    });
    
    // Filters
    if (elements.statusFilter) {
      elements.statusFilter.addEventListener('change', handleFilterChange);
    }
    
    if (elements.searchInput) {
      let searchTimeout;
      elements.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => handleSearchChange(e), 500);
      });
    }
    
    if (elements.refreshBtn) {
      elements.refreshBtn.addEventListener('click', () => loadQuotations());
    }
    
    // Pagination
    if (elements.prevPage) {
      elements.prevPage.addEventListener('click', () => changePage(state.currentPage - 1));
    }
    
    if (elements.nextPage) {
      elements.nextPage.addEventListener('click', () => changePage(state.currentPage + 1));
    }
  }

  // ==================== AUTHENTICATION ====================
  async function checkAuth() {
    try {
      const response = await fetch(`${API_URL}?action=check-auth`);
      const result = await response.json();
      
      if (result.authenticated) {
        showDashboard(result.user);
      } else {
        showLogin();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      showLogin();
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
      const response = await fetch(`${API_URL}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const result = await response.json();
      
      if (result.success) {
        showDashboard(result.user);
      } else {
        showError(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('Login failed. Please try again.');
    }
  }

  async function handleLogout() {
    try {
      await fetch(`${API_URL}?action=logout`);
      location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      location.reload();
    }
  }

  function showLogin() {
    elements.loginScreen.classList.remove('hidden');
    elements.dashboard.classList.add('hidden');
  }

  function showDashboard(user) {
    elements.loginScreen.classList.add('hidden');
    elements.dashboard.classList.remove('hidden');
    elements.userName.textContent = user.full_name || user.username;
    
    loadStats();
    loadRecentQuotations();
  }

  function showError(message) {
    elements.loginError.textContent = message;
    elements.loginError.classList.add('show');
    setTimeout(() => {
      elements.loginError.classList.remove('show');
    }, 5000);
  }

  // ==================== NAVIGATION ====================
  function handleNavigation(e) {
    e.preventDefault();
    const view = e.currentTarget.dataset.view;
    if (view) {
      switchView(view);
    }
  }

  window.switchView = function(view) {
    state.currentView = view;
    
    // Update nav
    elements.navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.view === view);
    });
    
    // Update views
    elements.views.forEach(v => {
      v.classList.toggle('active', v.id === `${view}View`);
    });
    
    // Update title
    const titles = {
      overview: { title: 'Overview', subtitle: 'Welcome back!' },
      quotations: { title: 'Quotations', subtitle: 'Manage all quotation requests' },
      settings: { title: 'Settings', subtitle: 'Configure your dashboard' }
    };
    
    elements.pageTitle.textContent = titles[view].title;
    elements.pageSubtitle.textContent = titles[view].subtitle;
    
    // Load data for view
    if (view === 'quotations') {
      loadQuotations();
    }
  };

  // ==================== STATS ====================
  async function loadStats() {
    try {
      const response = await fetch(`${API_URL}?action=get-stats`);
      const result = await response.json();
      
      if (result.success) {
        state.stats = result.stats;
        updateStatsUI();
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  function updateStatsUI() {
    const { total, pending, contacted, totalBudget } = state.stats;
    
    elements.totalQuotations.textContent = total || 0;
    elements.pendingQuotations.textContent = pending || 0;
    elements.contactedQuotations.textContent = contacted || 0;
    elements.totalBudget.textContent = formatCurrency(totalBudget || 0);
    elements.pendingBadge.textContent = pending || 0;
  }

  // ==================== QUOTATIONS ====================
  async function loadRecentQuotations() {
    try {
      const response = await fetch(`${API_URL}?action=get-quotations&limit=5`);
      const result = await response.json();
      
      if (result.success) {
        renderRecentTable(result.data);
      }
    } catch (error) {
      console.error('Failed to load recent quotations:', error);
      elements.recentQuotations.innerHTML = '<p class="error">Failed to load quotations</p>';
    }
  }

  async function loadQuotations() {
    try {
      elements.quotationsTable.innerHTML = '<div class="loading">Loading...</div>';
      
      const params = new URLSearchParams({
        action: 'get-quotations',
        page: state.currentPage,
        status: state.filters.status,
        search: state.filters.search
      });
      
      const response = await fetch(`${API_URL}?${params}`);
      const result = await response.json();
      
      if (result.success) {
        state.quotations = result.data;
        state.totalPages = result.pagination.pages;
        renderQuotationsTable(result.data);
        updatePagination(result.pagination);
      }
    } catch (error) {
      console.error('Failed to load quotations:', error);
      elements.quotationsTable.innerHTML = '<p class="error">Failed to load quotations</p>';
    }
  }

  function renderRecentTable(quotations) {
    if (!quotations || quotations.length === 0) {
      elements.recentQuotations.innerHTML = '<p style="text-align:center;padding:2rem;color:#6c757d;">No recent quotations</p>';
      return;
    }

    const html = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Project Type</th>
            <th>Budget</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${quotations.map(q => `
            <tr onclick="viewQuotation(${q.id})" style="cursor: pointer;">
              <td>#${q.id}</td>
              <td>${q.full_name}</td>
              <td>${q.project_type}</td>
              <td>${formatCurrency(q.budget)}</td>
              <td><span class="status-badge status-${q.status}">${q.status}</span></td>
              <td>${formatDate(q.created_at)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    elements.recentQuotations.innerHTML = html;
  }

  function renderQuotationsTable(quotations) {
    if (!quotations || quotations.length === 0) {
      elements.quotationsTable.innerHTML = '<p style="text-align:center;padding:2rem;color:#6c757d;">No quotations found</p>';
      return;
    }

    const html = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Project Type</th>
            <th>Budget</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${quotations.map(q => `
            <tr>
              <td>#${q.id}</td>
              <td>${q.full_name}</td>
              <td>${q.email}</td>
              <td>${q.phone}</td>
              <td>${q.project_type}</td>
              <td>${formatCurrency(q.budget)}</td>
              <td><span class="status-badge status-${q.status}">${q.status}</span></td>
              <td>${formatDate(q.created_at)}</td>
              <td class="action-buttons">
                <button class="btn-action btn-view" onclick="viewQuotation(${q.id})">
                  <i class="fas fa-eye"></i> View
                </button>
                <button class="btn-action btn-delete" onclick="deleteQuotation(${q.id})">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    elements.quotationsTable.innerHTML = html;
  }

  // ==================== QUOTATION DETAIL ====================
  window.viewQuotation = async function(id) {
    try {
      const response = await fetch(`${API_URL}?action=get-quotation&id=${id}`);
      const result = await response.json();
      
      if (result.success) {
        showQuotationModal(result.data);
      }
    } catch (error) {
      console.error('Failed to load quotation:', error);
      alert('Failed to load quotation details');
    }
  };

  function showQuotationModal(quotation) {
    const html = `
      <div class="detail-grid">
        <div class="detail-item">
          <label>Quotation ID</label>
          <div class="value">#${quotation.id}</div>
        </div>
        <div class="detail-item">
          <label>Status</label>
          <div class="value">
            <select onchange="updateQuotationStatus(${quotation.id}, this.value)" class="filter-select" style="border: 2px solid #dee2e6;">
              <option value="pending" ${quotation.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="contacted" ${quotation.status === 'contacted' ? 'selected' : ''}>Contacted</option>
              <option value="quoted" ${quotation.status === 'quoted' ? 'selected' : ''}>Quoted</option>
              <option value="completed" ${quotation.status === 'completed' ? 'selected' : ''}>Completed</option>
              <option value="cancelled" ${quotation.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </div>
        </div>
        <div class="detail-item">
          <label>Full Name</label>
          <div class="value">${quotation.full_name}</div>
        </div>
        <div class="detail-item">
          <label>Email</label>
          <div class="value">${quotation.email}</div>
        </div>
        <div class="detail-item">
          <label>Phone</label>
          <div class="value">${quotation.phone}</div>
        </div>
        <div class="detail-item">
          <label>City</label>
          <div class="value">${quotation.city}</div>
        </div>
        <div class="detail-item">
          <label>Project Type</label>
          <div class="value">${quotation.project_type}</div>
        </div>
        <div class="detail-item">
          <label>Budget</label>
          <div class="value">${formatCurrency(quotation.budget)}</div>
        </div>
        <div class="detail-item">
          <label>Has Plans</label>
          <div class="value">${quotation.has_plans === 'yes' ? 'Yes' : 'No'}</div>
        </div>
        <div class="detail-item">
          <label>Start Date</label>
          <div class="value">${quotation.start_date || 'Not specified'}</div>
        </div>
        <div class="detail-item">
          <label>Consultation</label>
          <div class="value">${quotation.consultation === 'yes' ? 'Yes' : 'No'}</div>
        </div>
        <div class="detail-item">
          <label>Created At</label>
          <div class="value">${formatDateTime(quotation.created_at)}</div>
        </div>
        ${quotation.plan_file ? `
          <div class="detail-item">
            <label>Plan File</label>
            <div class="value">
              <a href="../php/uploads/${quotation.plan_file}" target="_blank" style="color: var(--primary);">
                <i class="fas fa-file-download"></i> Download Plan
              </a>
            </div>
          </div>
        ` : ''}
        <div class="detail-item full-width">
          <label>Notes</label>
          <textarea id="notesInput" class="search-input" style="width:100%;min-height:100px;padding:0.75rem;">${quotation.notes || ''}</textarea>
          <button onclick="saveNote(${quotation.id})" class="btn-secondary" style="margin-top:0.5rem;">Save Notes</button>
        </div>
      </div>
    `;
    
    elements.quotationDetails.innerHTML = html;
    elements.quotationModal.classList.add('open');
  }

  window.closeQuotationModal = function() {
    elements.quotationModal.classList.remove('open');
  };

  window.updateQuotationStatus = async function(id, status) {
    try {
      const response = await fetch(`${API_URL}?action=update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      
      const result = await response.json();
      
      if (result.success) {
        loadStats();
        if (state.currentView === 'quotations') {
          loadQuotations();
        } else {
          loadRecentQuotations();
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  window.saveNote = async function(id) {
    const note = document.getElementById('notesInput').value;
    
    try {
      const response = await fetch(`${API_URL}?action=add-note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, note })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Note saved successfully');
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Failed to save note');
    }
  };

  window.deleteQuotation = async function(id) {
    if (!confirm('Are you sure you want to delete this quotation?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}?action=delete-quotation&id=${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        loadStats();
        loadQuotations();
      }
    } catch (error) {
      console.error('Failed to delete quotation:', error);
      alert('Failed to delete quotation');
    }
  };

  // ==================== FILTERS & PAGINATION ====================
  function handleFilterChange(e) {
    state.filters.status = e.target.value;
    state.currentPage = 1;
    loadQuotations();
  }

  function handleSearchChange(e) {
    state.filters.search = e.target.value;
    state.currentPage = 1;
    loadQuotations();
  }

  function changePage(page) {
    if (page < 1 || page > state.totalPages) return;
    state.currentPage = page;
    loadQuotations();
  }

  function updatePagination(pagination) {
    elements.pageInfo.textContent = `Page ${pagination.page} of ${pagination.pages}`;
    elements.prevPage.disabled = pagination.page <= 1;
    elements.nextPage.disabled = pagination.page >= pagination.pages;
    elements.pagination.classList.remove('hidden');
  }

  // ==================== HELPERS ====================
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // ==================== INITIALIZATION ====================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
