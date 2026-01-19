/**
 * GET QUOTATION FORM - JavaScript Logic
 * 
 * Features:
 * - Multi-step form with progress tracking
 * - Dynamic budget slider with INR formatting
 * - Conditional file upload
 * - Form validation
 * - Google Forms submission
 * - Success/Error modal handling
 */

(function() {
  'use strict';

  // ==================== CONFIGURATION ====================
  // PHP Backend endpoint
  const SUBMIT_URL = '../php/submit-quotation.php';

  // ==================== STATE MANAGEMENT ====================
  const formState = {
    currentStep: 1,
    totalSteps: 5,
    data: {
      projectType: '',
      budget: '5000000',
      hasPlans: 'no',
      planFile: null,
      startDate: '',
      fullName: '',
      email: '',
      phone: '',
      city: '',
      consultation: false
    },
    isSubmitting: false
  };

  // ==================== DOM ELEMENTS ====================
  const elements = {
    form: document.getElementById('quotationForm'),
    sections: document.querySelectorAll('.form-section'),
    progressBar: document.getElementById('progressBar'),
    progressSteps: document.querySelectorAll('.progress-step'),
    budget: document.getElementById('budget'),
    budgetValue: document.getElementById('budgetValue'),
    hasPlansRadios: document.querySelectorAll('input[name="hasPlans"]'),
    fileUploadSection: document.getElementById('fileUploadSection'),
    planFile: document.getElementById('planFile'),
    fileName: document.getElementById('fileName'),
    submitBtn: document.getElementById('submitBtn'),
    successModal: document.getElementById('successModal'),
    errorModal: document.getElementById('errorModal'),
    closeModalBtn: document.getElementById('closeModal'),
    retryBtn: document.getElementById('retryBtn')
  };

  // ==================== INITIALIZATION ====================
  function init() {
    if (!elements.form) return;

    // Debug: Check if budget element exists
    console.log('=== INIT DEBUG ===');
    console.log('Budget element:', elements.budget);
    console.log('Budget value element:', elements.budgetValue);
    
    if (elements.budget) {
      console.log('Budget ID:', elements.budget.id);
      console.log('Budget Value:', elements.budget.value);
    }
    if (elements.budgetValue) {
      console.log('BudgetValue ID:', elements.budgetValue.id);
      console.log('BudgetValue textContent:', elements.budgetValue.textContent);
    }

    setupEventListeners();
    setMinimumDate();
    updateBudgetDisplay();
    console.log('=== INIT COMPLETE ===');
  }

  // ==================== EVENT LISTENERS ====================
  function setupEventListeners() {
    // Budget slider - ensure it's listening
    if (elements.budget) {
      const handleChange = function(e) {
        console.log('Budget slider input event:', e.target.value);
        const value = e.target.value;
        formState.data.budget = value;
        updateBudgetDisplay();
      };
      
      elements.budget.addEventListener('input', handleChange, false);
      elements.budget.addEventListener('change', handleChange, false);
      console.log('✓ Budget slider listeners attached');
    } else {
      console.error('✗ Budget slider element NOT FOUND');
    }

    // Has Plans radio buttons
    elements.hasPlansRadios.forEach(radio => {
      radio.addEventListener('change', handleHasPlansChange);
    });

    // File input
    elements.planFile.addEventListener('change', handleFileSelect);
    setupFileDragDrop();

    // Navigation buttons
    document.querySelectorAll('.btn-next').forEach(btn => {
      btn.addEventListener('click', handleNext);
    });

    document.querySelectorAll('.btn-prev').forEach(btn => {
      btn.addEventListener('click', handlePrev);
    });

    // Form submission
    elements.form.addEventListener('submit', handleSubmit);

    // Modal buttons
    elements.closeModalBtn.addEventListener('click', closeSuccessModal);
    elements.retryBtn.addEventListener('click', closeErrorModal);

    // Form field validation on blur
    document.querySelectorAll('.form-control, input[type="text"], input[type="email"], input[type="tel"], input[type="date"]').forEach(input => {
      input.addEventListener('blur', validateField);
      input.addEventListener('input', validateField);
    });

    // Enable/disable submit button based on validation
    elements.form.addEventListener('change', updateSubmitButton);
    elements.form.addEventListener('input', updateSubmitButton);
  }

  // ==================== BUDGET SLIDER ====================
  function handleBudgetChange(e) {
    const value = e.target.value;
    console.log('✓ Slider changed to:', value);
    formState.data.budget = value;
    updateBudgetDisplay();
  }

  function updateBudgetDisplay() {
    const budget = parseInt(formState.data.budget) || 5000000;
    const formatted = formatINR(budget);
    console.log('Displaying:', formatted);
    if (elements.budgetValue) {
      elements.budgetValue.textContent = formatted;
    } else {
      console.error('budgetValue element not found!');
    }
  }

  function formatINR(num) {
    if (!num || isNaN(num)) return '50,00,000';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).replace('₹', '').trim();
  }

  // ==================== HAS PLANS HANDLING ====================
  function handleHasPlansChange(e) {
    const value = e.target.value;
    formState.data.hasPlans = value;

    if (value === 'yes') {
      elements.fileUploadSection.style.display = 'block';
      elements.planFile.required = true;
    } else {
      elements.fileUploadSection.style.display = 'none';
      elements.planFile.required = false;
      elements.planFile.value = '';
      formState.data.planFile = null;
      elements.fileName.classList.remove('show');
    }
  }

  // ==================== FILE UPLOAD HANDLING ====================
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      showError('fileError', validation.message);
      elements.planFile.value = '';
      return;
    }

    formState.data.planFile = file;
    displayFileName(file.name);
    clearError('fileError');
  }

  function validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        message: 'File size must be less than 10MB'
      };
    }

    // Check file type
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext) && !allowedTypes.includes(file.type)) {
      return {
        valid: false,
        message: 'Only PDF, JPG, and PNG files are allowed'
      };
    }

    return { valid: true };
  }

  function displayFileName(name) {
    elements.fileName.textContent = '✓ ' + name;
    elements.fileName.classList.add('show');
  }

  function setupFileDragDrop() {
    const label = document.querySelector('.file-upload-label');
    if (!label) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      label.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
      label.addEventListener(eventName, () => {
        label.style.borderColor = 'var(--primary)';
        label.style.background = 'rgba(139, 181, 143, 0.1)';
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      label.addEventListener(eventName, () => {
        label.style.borderColor = 'rgba(139, 181, 143, 0.3)';
        label.style.background = 'rgba(139, 181, 143, 0.02)';
      });
    });

    label.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        elements.planFile.files = files;
        handleFileSelect({ target: { files } });
      }
    });
  }

  // ==================== FORM NAVIGATION ====================
  function handleNext(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    const nextStep = parseInt(btn.dataset.next);

    if (validateCurrentStep()) {
      goToStep(nextStep);
    }
  }

  function handlePrev(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    const prevStep = parseInt(btn.dataset.prev);
    goToStep(prevStep);
  }

  function goToStep(step) {
    if (step < 1 || step > formState.totalSteps) return;

    // Hide current section
    document.querySelector('.form-section.active').classList.remove('active');

    // Show new section
    formState.currentStep = step;
    const newSection = document.querySelector(`.form-section[data-section="${step}"]`);
    newSection.classList.add('active');

    // Update progress
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateProgress() {
    const percent = (formState.currentStep / formState.totalSteps) * 100;
    elements.progressBar.style.width = percent + '%';

    elements.progressSteps.forEach((step, index) => {
      const stepNum = index + 1;
      step.classList.remove('active', 'completed');

      if (stepNum === formState.currentStep) {
        step.classList.add('active');
      } else if (stepNum < formState.currentStep) {
        step.classList.add('completed');
      }
    });
  }

  function setMinimumDate() {
    const dateInput = document.getElementById('startDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }
  }

  // ==================== VALIDATION ====================
  function validateCurrentStep() {
    const section = document.querySelector(`.form-section[data-section="${formState.currentStep}"]`);
    const inputs = section.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!validateField({ target: input })) {
        isValid = false;
      }
    });

    return isValid;
  }

  function validateField(e) {
    const input = e.target;
    const value = input.value.trim();
    const fieldName = input.name;
    const errorElement = document.getElementById(fieldName + 'Error');

    if (!errorElement) return true;

    let error = '';

    if (input.hasAttribute('required') && !value) {
      error = 'This field is required';
    } else {
      switch (fieldName) {
        case 'email':
          if (value && !isValidEmail(value)) {
            error = 'Please enter a valid email address';
          }
          break;
        case 'phone':
          if (value && !isValidPhone(value)) {
            error = 'Please enter a valid phone number';
          }
          break;
        case 'fullName':
          if (value && value.length < 3) {
            error = 'Name must be at least 3 characters';
          }
          break;
        case 'startDate':
          if (value) {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
              error = 'Please select today or a future date';
            }
          }
          break;
      }
    }

    if (error) {
      showError(fieldName + 'Error', error);
      input.classList.add('error');
      return false;
    } else {
      clearError(fieldName + 'Error');
      input.classList.remove('error');
      return true;
    }
  }

  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function isValidPhone(phone) {
    const regex = /^[\d\s\-\+\(\)]+$/;
    return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = message;
    }
  }

  function clearError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = '';
    }
  }

  function updateSubmitButton() {
    const allRequired = document.querySelectorAll('input[required], select[required], textarea[required]');
    let allValid = true;

    allRequired.forEach(input => {
      if (!input.value.trim()) {
        allValid = false;
      }
    });

    elements.submitBtn.disabled = !allValid;
  }

  // ==================== FORM SUBMISSION ====================
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateAllFields()) {
      showErrorModal('Please fix the errors in your form');
      return;
    }

    formState.isSubmitting = true;
    elements.submitBtn.classList.add('loading');
    elements.submitBtn.disabled = true;

    try {
      await submitToGoogleForms();
      showSuccessModal();
      resetForm();
    } catch (error) {
      console.error('Submission error:', error);
      showErrorModal('Failed to submit your quotation. Please try again.');
    } finally {
      formState.isSubmitting = false;
      elements.submitBtn.classList.remove('loading');
      elements.submitBtn.disabled = false;
    }
  }

  function validateAllFields() {
    const inputs = elements.form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
      if (input.hasAttribute('required') && !validateField({ target: input })) {
        isValid = false;
      }
    });

    return isValid;
  }

  async function submitToGoogleForms() {
    /**
     * PHP BACKEND SUBMISSION
     * Submits form data to PHP backend with MySQL database storage
     */

    // Capture current values from form fields before submitting
    const formElement = elements.form;
    formState.data.projectType = formElement.projectType?.value || '';
    formState.data.fullName = formElement.fullName?.value || '';
    formState.data.email = formElement.email?.value || '';
    formState.data.phone = formElement.phone?.value || '';
    formState.data.city = formElement.city?.value || '';
    formState.data.startDate = formElement.startDate?.value || '';
    formState.data.consultation = formElement.consultation?.checked || false;

    const formData = new FormData();

    // Add form fields
    formData.append('projectType', formState.data.projectType);
    formData.append('budget', formState.data.budget);
    formData.append('hasPlans', formState.data.hasPlans);
    formData.append('startDate', formState.data.startDate);
    formData.append('fullName', formState.data.fullName);
    formData.append('email', formState.data.email);
    formData.append('phone', formState.data.phone);
    formData.append('city', formState.data.city);
    formData.append('consultation', formState.data.consultation ? 'true' : 'false');

    // Add file if present
    if (formState.data.planFile) {
      formData.append('planFile', formState.data.planFile);
    }

    // Debug: Log form data
    console.log('Submitting form data:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await fetch(SUBMIT_URL, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    return result;
  }

  function resetForm() {
    elements.form.reset();
    formState.data = {
      projectType: '',
      budget: '5000000',
      hasPlans: 'no',
      planFile: null,
      startDate: '',
      fullName: '',
      email: '',
      phone: '',
      city: '',
      consultation: false
    };
    formState.currentStep = 1;
    goToStep(1);
  }

  // ==================== MODAL HANDLING ====================
  function showSuccessModal() {
    elements.successModal.classList.add('open');
  }

  function closeSuccessModal() {
    elements.successModal.classList.remove('open');
    window.location.href = '../html/d1.html';
  }

  function showErrorModal(message) {
    document.getElementById('errorMessage').textContent = message;
    elements.errorModal.classList.add('open');
  }

  function closeErrorModal() {
    elements.errorModal.classList.remove('open');
  }

  // ==================== INITIALIZATION ON DOM READY ====================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
