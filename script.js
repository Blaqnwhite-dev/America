// Global variables
let selectedAmount = 0
let selectedFrequency = "once"
const currentStep = "donation"

// DOM elements
const amountButtons = document.querySelectorAll(".amount-btn")
const customAmountInput = document.getElementById("customAmount")
const frequencyButtons = document.querySelectorAll(".frequency-btn")
const cardPaymentBtn = document.getElementById("cardPaymentBtn")
const donationForm = document.getElementById("donationForm")
const paymentProcess = document.getElementById("paymentProcess")
const navTabs = document.querySelectorAll(".nav-tab")
const tabContents = document.querySelectorAll(".tab-content")

// Authentication elements
const authModal = document.getElementById("authModal")
const signInLink = document.getElementById("signInLink")
const signUpLink = document.getElementById("signUpLink")
const signInForm = document.getElementById("signInForm")
const signUpForm = document.getElementById("signUpForm")
const switchToSignUp = document.getElementById("switchToSignUp")
const switchToSignIn = document.getElementById("switchToSignIn")
const closeModal = document.querySelector(".close")

// Initialize event listeners
document.addEventListener("DOMContentLoaded", () => {
  initializeAmountButtons()
  initializeFrequencyButtons()
  initializePaymentFlow()
  initializeAuthentication()
  initializeAnimations()

  // Add real-time validation for country dropdown
  const countrySelect = document.getElementById("country")
  if (countrySelect) {
    countrySelect.addEventListener("change", function () {
      if (this.value) {
        this.classList.add("valid")
        this.classList.remove("invalid")
        this.style.borderColor = "#27ae60"
      } else {
        this.classList.remove("valid")
        this.style.borderColor = "#ddd"
      }
    })
  }

  // Add real-time validation for all required fields
  const requiredFields = ["email", "firstName", "lastName", "address", "city", "state", "zipCode"]
  requiredFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId)
    if (field) {
      field.addEventListener("blur", function () {
        if (this.value.trim()) {
          if (fieldId === "email" && !validateEmail(this.value)) {
            this.classList.add("invalid")
            this.classList.remove("valid")
            this.style.borderColor = "#e74c3c"
          } else {
            this.classList.add("valid")
            this.classList.remove("invalid")
            this.style.borderColor = "#27ae60"
          }
        } else {
          this.classList.remove("valid", "invalid")
          this.style.borderColor = "#ddd"
        }
      })
    }
  })
})

// Amount selection functionality
function initializeAmountButtons() {
  amountButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      amountButtons.forEach((btn) => btn.classList.remove("selected"))

      // Add active class to clicked button
      this.classList.add("selected")

      // Set selected amount
      selectedAmount = Number.parseInt(this.dataset.amount)

      // Clear custom amount input
      customAmountInput.value = ""

      // Add animation
      this.style.transform = "scale(0.95)"
      setTimeout(() => {
        this.style.transform = "scale(1)"
      }, 150)
    })
  })

  // Custom amount input
  customAmountInput.addEventListener("input", function () {
    // Remove active class from all amount buttons
    amountButtons.forEach((btn) => btn.classList.remove("selected"))

    // Set selected amount
    selectedAmount = Number.parseInt(this.value) || 0
  })
}

// Frequency selection functionality
function initializeFrequencyButtons() {
  frequencyButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      frequencyButtons.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      // Set selected frequency
      selectedFrequency = this.dataset.frequency

      // Add animation
      this.style.transform = "scale(0.95)"
      setTimeout(() => {
        this.style.transform = "scale(1)"
      }, 150)
    })
  })
}

// Payment flow functionality with step validation
function initializePaymentFlow() {
  cardPaymentBtn.addEventListener("click", () => {
    if (selectedAmount === 0) {
      alert("Please select an amount first.")
      return
    }

    // Hide donation form and show payment process
    donationForm.classList.add("hidden")
    paymentProcess.classList.remove("hidden")

    // Update selected amount display
    document.getElementById("selectedAmountDisplay").textContent = selectedAmount
    document.getElementById("selectedFrequency").textContent = selectedFrequency === "once" ? "One-time" : "Monthly"
    document.getElementById("finalAmount").textContent = selectedAmount

    // Reset navigation state
    resetNavigationState()

    // Add slide animation
    paymentProcess.style.opacity = "0"
    paymentProcess.style.transform = "translateX(50px)"
    setTimeout(() => {
      paymentProcess.style.opacity = "1"
      paymentProcess.style.transform = "translateX(0)"
    }, 100)
  })

  // Navigation tabs with validation
  navTabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault()
      const targetTab = this.dataset.tab

      // Check if user can access this tab
      if (!canAccessTab(targetTab)) {
        showTabError(targetTab)
        return
      }

      switchTab(targetTab)
    })
  })

  // Initialize navigation state
  resetNavigationState()
}

// Reset navigation state
function resetNavigationState() {
  // Enable only the first tab
  navTabs.forEach((tab, index) => {
    const tabName = tab.dataset.tab
    if (tabName === "amount") {
      tab.classList.remove("disabled")
      tab.classList.add("active")
    } else {
      tab.classList.add("disabled")
      tab.classList.remove("active")
    }
  })

  // Show only amount tab content
  tabContents.forEach((content) => {
    content.classList.remove("active")
  })
  document.getElementById("amountTab").classList.add("active")

  // Reset completion status
  window.tabCompletionStatus = {
    amount: false,
    details: false,
    payment: false,
  }
}

// Check if user can access a specific tab
function canAccessTab(tabName) {
  const completionStatus = window.tabCompletionStatus || {}

  switch (tabName) {
    case "amount":
      return true // Always accessible
    case "details":
      return completionStatus.amount === true
    case "payment":
      return completionStatus.amount === true && completionStatus.details === true
    default:
      return false
  }
}

// Show error when trying to access locked tab
function showTabError(tabName) {
  let message = ""

  switch (tabName) {
    case "details":
      message = "Please complete the amount selection first."
      break
    case "payment":
      if (!window.tabCompletionStatus.amount) {
        message = "Please complete the amount selection first."
      } else if (!window.tabCompletionStatus.details) {
        message = "Please complete your details first."
      }
      break
  }

  // Show error notification
  showNotification(message, "error")
}

// Updated switchTab function with completion tracking
function switchTab(tabName) {
  // Remove active class from all tabs and contents
  navTabs.forEach((tab) => tab.classList.remove("active"))
  tabContents.forEach((content) => content.classList.remove("active"))

  // Add active class to selected tab and content
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active")
  document.getElementById(`${tabName}Tab`).classList.add("active")

  // Special handling for amount tab
  if (tabName === "amount") {
    donationForm.classList.remove("hidden")
    paymentProcess.classList.add("hidden")
  }
}

// Validate and complete amount step
function completeAmountStep() {
  if (selectedAmount === 0) {
    showNotification("Please select an amount before continuing.", "error")
    return false
  }

  // Mark amount step as completed
  window.tabCompletionStatus.amount = true

  // Enable details tab
  const detailsTab = document.querySelector('[data-tab="details"]')
  detailsTab.classList.remove("disabled")
  detailsTab.classList.add("completed")

  // Add checkmark to completed tab
  if (!detailsTab.querySelector(".checkmark")) {
    const checkmark = document.createElement("i")
    checkmark.className = "fas fa-check checkmark"
    detailsTab.appendChild(checkmark)
  }

  // Switch to details tab
  switchTab("details")
  showNotification("Amount confirmed! Please fill in your details.", "success")
  return true
}

// Validate and complete details step
function completeDetailsStep() {
  const requiredFields = ["email", "firstName", "lastName", "address", "city", "state", "zipCode", "country"]
  let isValid = true
  let firstInvalidField = null

  requiredFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId)
    if (!field.value.trim()) {
      field.style.borderColor = "#e74c3c"
      field.classList.add("error-shake")
      field.classList.add("invalid")
      field.classList.remove("valid")
      if (!firstInvalidField) firstInvalidField = field
      isValid = false
    } else {
      field.style.borderColor = "#27ae60"
      field.classList.remove("error-shake")
      field.classList.add("valid")
      field.classList.remove("invalid")
    }
  })

  // Email validation
  const emailField = document.getElementById("email")
  if (emailField.value && !validateEmail(emailField.value)) {
    emailField.style.borderColor = "#e74c3c"
    emailField.classList.add("error-shake")
    emailField.classList.add("invalid")
    emailField.classList.remove("valid")
    isValid = false
    if (!firstInvalidField) firstInvalidField = emailField
  }

  if (!isValid) {
    showNotification("Please fill in all required fields correctly.", "error")
    if (firstInvalidField) {
      firstInvalidField.focus()
      firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" })
    }
    return false
  }

  // Mark details step as completed
  window.tabCompletionStatus.details = true

  // Enable payment tab
  const paymentTab = document.querySelector('[data-tab="payment"]')
  paymentTab.classList.remove("disabled")
  paymentTab.classList.add("completed")

  // Add checkmark to completed tab
  if (!paymentTab.querySelector(".checkmark")) {
    const checkmark = document.createElement("i")
    checkmark.className = "fas fa-check checkmark"
    paymentTab.appendChild(checkmark)
  }

  // Switch to payment tab
  switchTab("payment")
  showNotification("Details saved! Please enter your payment information.", "success")
  return true
}

// Show notification function
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === "success" ? "#27ae60" : type === "error" ? "#e74c3c" : "#3498db"};
    color: white;
    border-radius: 8px;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    max-width: 300px;
    font-weight: 500;
  `

  // Add icon based on type
  const icon =
    type === "success" ? "fas fa-check-circle" : type === "error" ? "fas fa-exclamation-circle" : "fas fa-info-circle"

  notification.innerHTML = `<i class="${icon}" style="margin-right: 8px;"></i>${message}`

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 4000)
}

// Process donation
function processDonation() {
  // Validate form
  const requiredFields = [
    "email",
    "firstName",
    "lastName",
    "address",
    "city",
    "state",
    "zipCode",
    "country",
    "cardNumber",
    "expiryDate",
    "cvv",
    "cardName",
  ]
  let isValid = true

  requiredFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId)
    if (!field.value.trim()) {
      field.style.borderColor = "#e74c3c"
      isValid = false
    } else {
      field.style.borderColor = "#ddd"
    }
  })

  if (!isValid) {
    alert("Please fill in all required fields.")
    return
  }

  // Simulate payment processing
  const donateBtn = document.querySelector(".donate-btn")
  donateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'
  donateBtn.disabled = true

  setTimeout(() => {
    alert(
      `Thank you for your donation of $${selectedAmount}! Your contribution will help fund our Liberty Van operation.`,
    )

    // Reset form
    resetForm()

    donateBtn.innerHTML = `Donate $<span id="finalAmount">${selectedAmount}</span>`
    donateBtn.disabled = false
  }, 3000)
}

// Reset form
function resetForm() {
  selectedAmount = 0
  selectedFrequency = "once"

  // Reset buttons
  amountButtons.forEach((btn) => btn.classList.remove("selected"))
  frequencyButtons.forEach((btn) => btn.classList.remove("active"))
  frequencyButtons[0].classList.add("active")

  // Clear inputs
  document.querySelectorAll("input").forEach((input) => {
    input.value = ""
    input.style.borderColor = "#ddd"
  })

  // Show donation form
  donationForm.classList.remove("hidden")
  paymentProcess.classList.add("hidden")

  // Reset tabs
  switchTab("amount")
}

// Authentication functionality
function initializeAuthentication() {
  // Open modal
  signInLink.addEventListener("click", (e) => {
    e.preventDefault()
    authModal.style.display = "block"
    signInForm.classList.remove("hidden")
    signUpForm.classList.add("hidden")
  })

  signUpLink.addEventListener("click", (e) => {
    e.preventDefault()
    authModal.style.display = "block"
    signUpForm.classList.remove("hidden")
    signInForm.classList.add("hidden")
  })

  // Switch forms
  switchToSignUp.addEventListener("click", (e) => {
    e.preventDefault()
    signInForm.classList.add("hidden")
    signUpForm.classList.remove("hidden")
  })

  switchToSignIn.addEventListener("click", (e) => {
    e.preventDefault()
    signUpForm.classList.add("hidden")
    signInForm.classList.remove("hidden")
  })

  // Close modal
  closeModal.addEventListener("click", () => {
    authModal.style.display = "none"
  })

  window.addEventListener("click", (e) => {
    if (e.target === authModal) {
      authModal.style.display = "none"
    }
  })

  // Handle form submissions
  signInForm.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault()
    // Simulate login
    setTimeout(() => {
      alert("Login successful! Redirecting to admin dashboard...")
      window.location.href = "admin.html"
    }, 1000)
  })

  signUpForm.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault()
    // Simulate registration
    setTimeout(() => {
      alert("Registration successful! Please sign in.")
      signUpForm.classList.add("hidden")
      signInForm.classList.remove("hidden")
    }, 1000)
  })
}

// Initialize animations
function initializeAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".amount-btn, .frequency-btn, .payment-btn").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = "all 0.6s ease"
    observer.observe(el)
  })
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validateCardNumber(cardNumber) {
  // Basic card number validation (Luhn algorithm would be better)
  return cardNumber.replace(/\s/g, "").length >= 13
}

// Add input formatting
document.addEventListener("DOMContentLoaded", () => {
  // Format card number input
  const cardNumberInput = document.getElementById("cardNumber")
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", function () {
      const value = this.value.replace(/\s/g, "").replace(/[^0-9]/gi, "")
      const formattedValue = value.match(/.{1,4}/g)?.join(" ") || value
      this.value = formattedValue
    })
  }

  // Format expiry date input
  const expiryInput = document.getElementById("expiryDate")
  if (expiryInput) {
    expiryInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, "")
      if (value.length >= 2) {
        value = value.substring(0, 2) + "/" + value.substring(2, 4)
      }
      this.value = value
    })
  }

  // Replace the continue button click in amount tab
  const amountContinueBtn = document.querySelector("#amountTab .continue-btn")
  if (amountContinueBtn) {
    amountContinueBtn.onclick = () => completeAmountStep()
  }

  // Replace the continue button click in details tab
  const detailsContinueBtn = document.querySelector("#detailsTab .continue-btn")
  if (detailsContinueBtn) {
    detailsContinueBtn.onclick = () => completeDetailsStep()
  }
})
