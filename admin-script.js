// Admin Dashboard JavaScript
document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar()
  initializeNavigation()
  initializeCharts()
  initializeMobileMenu()
  loadDashboardData()
})

// Sidebar functionality
function initializeSidebar() {
  const navItems = document.querySelectorAll(".nav-item")
  const contentSections = document.querySelectorAll(".content-section")

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault()

      // Remove active class from all nav items
      navItems.forEach((nav) => nav.classList.remove("active"))

      // Add active class to clicked item
      this.classList.add("active")

      // Hide all content sections
      contentSections.forEach((section) => section.classList.remove("active"))

      // Show selected section
      const targetSection = this.dataset.section + "Section"
      const section = document.getElementById(targetSection)
      if (section) {
        section.classList.add("active")
      }

      // Add click animation
      this.style.transform = "scale(0.95)"
      setTimeout(() => {
        this.style.transform = "scale(1)"
      }, 150)
    })
  })
}

// Navigation functionality
function initializeNavigation() {
  // Add smooth transitions
  const contentSections = document.querySelectorAll(".content-section")
  contentSections.forEach((section) => {
    section.style.transition = "all 0.3s ease"
  })
}

// Mobile menu functionality
function initializeMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const sidebar = document.getElementById("sidebar")
  const mainContent = document.getElementById("mainContent")

  mobileMenuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active")

    // Add overlay for mobile
    if (sidebar.classList.contains("active")) {
      const overlay = document.createElement("div")
      overlay.className = "sidebar-overlay"
      overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999;
            `
      document.body.appendChild(overlay)

      overlay.addEventListener("click", () => {
        sidebar.classList.remove("active")
        document.body.removeChild(overlay)
      })
    }
  })
}

// Chart initialization (placeholder)
function initializeCharts() {
  // This would typically use a charting library like Chart.js
  const chartPlaceholder = document.querySelector(".chart-placeholder")
  if (chartPlaceholder) {
    chartPlaceholder.innerHTML = `
            <div style="text-align: center; color: #666;">
                <i class="fas fa-chart-line" style="font-size: 3rem; margin-bottom: 10px;"></i>
                <p>Chart will be displayed here</p>
            </div>
        `
  }
}

// Load dashboard data
function loadDashboardData() {
  // Simulate loading data
  setTimeout(() => {
    animateCounters()
    loadRecentActivity()
  }, 500)
}

// Animate counter numbers
function animateCounters() {
  const counters = document.querySelectorAll(".stat-info h3")

  counters.forEach((counter) => {
    const target = counter.textContent
    const numericValue = Number.parseInt(target.replace(/[^0-9]/g, ""))

    if (numericValue) {
      let current = 0
      const increment = numericValue / 50
      const timer = setInterval(() => {
        current += increment
        if (current >= numericValue) {
          current = numericValue
          clearInterval(timer)
        }

        if (target.includes("$")) {
          counter.textContent = "$" + Math.floor(current).toLocaleString()
        } else if (target.includes("%")) {
          counter.textContent = Math.floor(current) + "%"
        } else {
          counter.textContent = Math.floor(current).toLocaleString()
        }
      }, 20)
    }
  })
}

// Load recent activity
function loadRecentActivity() {
  const activityList = document.querySelector(".activity-list")
  if (activityList) {
    // Add loading animation
    activityList.style.opacity = "0.5"

    setTimeout(() => {
      activityList.style.opacity = "1"

      // Add stagger animation to activity items
      const items = activityList.querySelectorAll(".activity-item")
      items.forEach((item, index) => {
        item.style.opacity = "0"
        item.style.transform = "translateX(-20px)"

        setTimeout(() => {
          item.style.transition = "all 0.4s ease"
          item.style.opacity = "1"
          item.style.transform = "translateX(0)"
        }, index * 100)
      })
    }, 1000)
  }
}

// Table functionality
function initializeTable() {
  const tableRows = document.querySelectorAll(".data-table tbody tr")

  tableRows.forEach((row) => {
    row.addEventListener("click", function () {
      // Remove active class from all rows
      tableRows.forEach((r) => r.classList.remove("active"))

      // Add active class to clicked row
      this.classList.add("active")
    })
  })
}

// Export functionality
function exportData() {
  // Simulate data export
  const exportBtn = document.querySelector(".btn-primary")
  const originalText = exportBtn.textContent

  exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...'
  exportBtn.disabled = true

  setTimeout(() => {
    exportBtn.textContent = originalText
    exportBtn.disabled = false
    alert("Data exported successfully!")
  }, 2000)
}

// Add event listeners for buttons
document.addEventListener("click", (e) => {
  if (e.target.textContent === "Export Data") {
    exportData()
  }

  if (e.target.classList.contains("btn-small")) {
    const action = e.target.textContent
    alert(`${action} action clicked`)
  }
})

// Real-time updates simulation
function startRealTimeUpdates() {
  setInterval(() => {
    // Update random stats
    const statCards = document.querySelectorAll(".stat-card")
    const randomCard = statCards[Math.floor(Math.random() * statCards.length)]
    const statValue = randomCard.querySelector("h3")

    if (statValue && statValue.textContent.includes("$")) {
      const currentValue = Number.parseInt(statValue.textContent.replace(/[^0-9]/g, ""))
      const newValue = currentValue + Math.floor(Math.random() * 100)
      statValue.textContent = "$" + newValue.toLocaleString()

      // Add flash animation
      randomCard.style.background = "#e8f5e8"
      setTimeout(() => {
        randomCard.style.background = "white"
      }, 1000)
    }
  }, 30000) // Update every 30 seconds
}

// Initialize real-time updates
setTimeout(startRealTimeUpdates, 5000)

// Responsive handling
function handleResize() {
  const sidebar = document.getElementById("sidebar")
  const mainContent = document.getElementById("mainContent")

  if (window.innerWidth <= 768) {
    sidebar.classList.remove("active")
    // Remove any existing overlays
    const overlay = document.querySelector(".sidebar-overlay")
    if (overlay) {
      document.body.removeChild(overlay)
    }
  }
}

window.addEventListener("resize", handleResize)

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === "success" ? "#27ae60" : type === "error" ? "#e74c3c" : "#3498db"};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Add CSS for notifications
const notificationStyles = document.createElement("style")
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`
document.head.appendChild(notificationStyles)

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  initializeTable()

  // Show welcome notification
  setTimeout(() => {
    showNotification("Welcome to the Admin Dashboard!", "success")
  }, 1000)
})
