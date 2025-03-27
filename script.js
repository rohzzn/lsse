// Global state
const state = {
    data: {
      zoom: [],
      firefox: [],
      webex: []
    },
    view: 'month', // 'month' or 'year'
    activeApp: 'all', // 'all', 'zoom', 'firefox', 'webex'
    year: 2022,
    month: 0, // 0-based (January is 0)
    selectedDay: null,
    selectedMonthIndex: null,
    selectedFeatures: []
  };
  
  // App colors
  const colors = {
    zoom: '#0E71EB',    // Blue
    firefox: '#FF7139', // Orange
    webex: '#1BE4B6',   // Teal
    combined: '#6E56CF' // Purple for combined view
  };
  
  // DOM elements
  const elements = {
    loadingOverlay: document.getElementById('loadingOverlay'),
    
    // View buttons
    monthViewBtn: document.getElementById('monthViewBtn'),
    yearViewBtn: document.getElementById('yearViewBtn'),
    
    // App buttons
    allAppsBtn: document.getElementById('allAppsBtn'),
    zoomBtn: document.getElementById('zoomBtn'),
    firefoxBtn: document.getElementById('firefoxBtn'),
    webexBtn: document.getElementById('webexBtn'),
    
    // Month view
    monthlyView: document.getElementById('monthlyView'),
    monthYearLabel: document.getElementById('monthYearLabel'),
    prevMonthBtn: document.getElementById('prevMonthBtn'),
    nextMonthBtn: document.getElementById('nextMonthBtn'),
    monthlyGrid: document.getElementById('monthlyGrid'),
    dayFeaturesList: document.getElementById('dayFeaturesList'),
    
    // Year view
    yearlyView: document.getElementById('yearlyView'),
    yearLabel: document.getElementById('yearLabel'),
    prevYearBtn: document.getElementById('prevYearBtn'),
    nextYearBtn: document.getElementById('nextYearBtn'),
    yearlyGrid: document.getElementById('yearlyGrid'),
    monthFeaturesList: document.getElementById('monthFeaturesList'),
    
    // Summary
    totalFeatures: document.getElementById('totalFeatures'),
    appBreakdown: document.getElementById('appBreakdown'),
    yearStats: document.getElementById('yearStats'),
    categoriesContainer: document.getElementById('categoriesContainer'),
    categoryStats: document.getElementById('categoryStats'),
    
    // Legend
    heatGradient: document.getElementById('heatGradient')
  };
  
  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const shortMonthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  // Initialize the application
  async function init() {
    try {
      // Show loading overlay
      elements.loadingOverlay.classList.remove('hidden');
      
      // Load data
      await loadData();
      
      // Setup event listeners
      setupEventListeners();
      
      // Initial render
      updateUI();
      
      // Hide loading overlay
      elements.loadingOverlay.classList.add('hidden');
    } catch (error) {
      console.error('Initialization error:', error);
      alert('Failed to initialize the application. Please check the console for details.');
    }
  }
  
  // Load Excel data
  async function loadData() {
    try {
      // Load Zoom data
      const zoomData = await fetchExcel('data/Zoom.xlsx');
      state.data.zoom = processReleaseData(zoomData);
      
      // Load Firefox data
      const firefoxData = await fetchExcel('data/Firefox.xlsx');
      state.data.firefox = processReleaseData(firefoxData);
      
      // Load Webex data
      const webexData = await fetchExcel('data/Webex.xlsx');
      state.data.webex = processReleaseData(webexData);
      
      console.log('Data loaded successfully', state.data);
    } catch (error) {
      console.error('Error loading data:', error);
      throw new Error('Failed to load Excel data');
    }
  }
  
  // Fetch and parse Excel file
  async function fetchExcel(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { cellDates: true });
      
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      return XLSX.utils.sheet_to_json(worksheet);
    } catch (error) {
      console.error(`Error fetching Excel file ${url}:`, error);
      throw error;
    }
  }
  
  // Process release data from Excel
  function processReleaseData(data) {
    return data.map(item => {
      const releaseDate = new Date(item["Release Date"]);
      return {
        date: releaseDate,
        year: releaseDate.getFullYear(),
        month: releaseDate.getMonth(),
        day: releaseDate.getDate(),
        description: item["Feature Description"],
        category: item["Group / Category"] || "Uncategorized"
      };
    });
  }
  
  // Setup event listeners
  function setupEventListeners() {
    // View switchers
    elements.monthViewBtn.addEventListener('click', () => {
      state.view = 'month';
      state.selectedDay = null;
      state.selectedFeatures = [];
      updateUI();
    });
    
    elements.yearViewBtn.addEventListener('click', () => {
      state.view = 'year';
      state.selectedMonthIndex = null;
      state.selectedFeatures = [];
      updateUI();
    });
    
    // App switchers
    elements.allAppsBtn.addEventListener('click', () => {
      state.activeApp = 'all';
      state.selectedDay = null;
      state.selectedMonthIndex = null;
      state.selectedFeatures = [];
      updateUI();
    });
    
    elements.zoomBtn.addEventListener('click', () => {
      state.activeApp = 'zoom';
      state.selectedDay = null;
      state.selectedMonthIndex = null;
      state.selectedFeatures = [];
      updateUI();
    });
    
    elements.firefoxBtn.addEventListener('click', () => {
      state.activeApp = 'firefox';
      state.selectedDay = null;
      state.selectedMonthIndex = null;
      state.selectedFeatures = [];
      updateUI();
    });
    
    elements.webexBtn.addEventListener('click', () => {
      state.activeApp = 'webex';
      state.selectedDay = null;
      state.selectedMonthIndex = null;
      state.selectedFeatures = [];
      updateUI();
    });
    
    // Month navigation
    elements.prevMonthBtn.addEventListener('click', () => {
      if (state.month === 0) {
        state.year--;
        state.month = 11;
      } else {
        state.month--;
      }
      state.selectedDay = null;
      state.selectedFeatures = [];
      updateUI();
    });
    
    elements.nextMonthBtn.addEventListener('click', () => {
      if (state.month === 11) {
        state.year++;
        state.month = 0;
      } else {
        state.month++;
      }
      state.selectedDay = null;
      state.selectedFeatures = [];
      updateUI();
    });
    
    // Year navigation
    elements.prevYearBtn.addEventListener('click', () => {
      state.year--;
      state.selectedMonthIndex = null;
      state.selectedFeatures = [];
      updateUI();
    });
    
    elements.nextYearBtn.addEventListener('click', () => {
      state.year++;
      state.selectedMonthIndex = null;
      state.selectedFeatures = [];
      updateUI();
    });
  }
  
  // Update the UI based on current state
  function updateUI() {
    // Update active buttons
    updateActiveButtons();
    
    // Update view visibility
    updateViewVisibility();
    
    // Update month/year labels
    elements.monthYearLabel.textContent = `${monthNames[state.month]} ${state.year}`;
    elements.yearLabel.textContent = state.year.toString();
    
    // Update heat gradient color
    updateHeatGradient();
    
    // Render appropriate view
    if (state.view === 'month') {
      renderMonthView();
    } else {
      renderYearView();
    }
    
    // Update summary statistics
    renderSummaryStats();
  }
  
  // Update active state of buttons
  function updateActiveButtons() {
    // View buttons
    elements.monthViewBtn.classList.toggle('active', state.view === 'month');
    elements.yearViewBtn.classList.toggle('active', state.view === 'year');
    
    // App buttons
    elements.allAppsBtn.classList.toggle('active', state.activeApp === 'all');
    elements.zoomBtn.classList.toggle('active', state.activeApp === 'zoom');
    elements.firefoxBtn.classList.toggle('active', state.activeApp === 'firefox');
    elements.webexBtn.classList.toggle('active', state.activeApp === 'webex');
  }
  
  // Update view visibility
  function updateViewVisibility() {
    elements.monthlyView.classList.toggle('hidden', state.view !== 'month');
    elements.yearlyView.classList.toggle('hidden', state.view !== 'year');
  }
  
  // Update heat gradient color
  function updateHeatGradient() {
    const colorKey = state.activeApp === 'all' ? 'combined' : state.activeApp;
    const color = colors[colorKey];
    const rgbColor = hexToRgb(color);
    
    elements.heatGradient.style.background = `linear-gradient(to right, rgba(${rgbColor}, 0.2), rgba(${rgbColor}, 1))`;
  }
  
  // Render month view
  function renderMonthView() {
    // Get calendar data
    const calendarData = generateCalendarData();
    
    // Clear grid
    elements.monthlyGrid.innerHTML = '';
    
    // Add day headers
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'day-header';
      dayHeader.textContent = day;
      elements.monthlyGrid.appendChild(dayHeader);
    });
    
    // Calculate first day of month and days in month
    const firstDayOfMonth = new Date(state.year, state.month, 1).getDay();
    const daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
    
    // Find maximum value for scaling color intensity
    const maxValue = Math.max(
      1, // minimum to avoid division by zero
      ...Object.values(calendarData).map(day => 
        state.activeApp === 'all' ? day.total : day.apps[state.activeApp]
      )
    );
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'day-cell empty';
      elements.monthlyGrid.appendChild(emptyCell);
    }
    
    // Add cells for each day in month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = calendarData[day] || { total: 0, apps: { zoom: 0, firefox: 0, webex: 0 } };
      const value = state.activeApp === 'all' ? dayData.total : dayData.apps[state.activeApp];
      const intensity = value / maxValue;
      const colorKey = state.activeApp === 'all' ? 'combined' : state.activeApp;
      const bgcolor = intensity > 0 
        ? `rgba(${hexToRgb(colors[colorKey])}, ${Math.min(0.2 + intensity * 0.8, 1)})`
        : 'white';
      
      const dayCell = document.createElement('div');
      dayCell.className = 'day-cell';
      dayCell.style.backgroundColor = bgcolor;
      
      // Add selected class if this day is selected
      if (day === state.selectedDay) {
        dayCell.classList.add('selected');
      }
      
      // Day number
      const dayNumber = document.createElement('div');
      dayNumber.className = 'day-number';
      dayNumber.textContent = day;
      dayCell.appendChild(dayNumber);
      
      // Feature count
      if (value > 0) {
        const dayCount = document.createElement('div');
        dayCount.className = 'day-count';
        dayCount.textContent = value;
        dayCell.appendChild(dayCount);
        
        // App indicators
        const indicators = document.createElement('div');
        indicators.className = 'day-indicators';
        
        if (dayData.apps.zoom > 0 && (state.activeApp === 'all' || state.activeApp === 'zoom')) {
          const zoomDot = document.createElement('span');
          zoomDot.className = 'app-indicator-dot';
          zoomDot.style.backgroundColor = colors.zoom;
          indicators.appendChild(zoomDot);
        }
        
        if (dayData.apps.firefox > 0 && (state.activeApp === 'all' || state.activeApp === 'firefox')) {
          const firefoxDot = document.createElement('span');
          firefoxDot.className = 'app-indicator-dot';
          firefoxDot.style.backgroundColor = colors.firefox;
          indicators.appendChild(firefoxDot);
        }
        
        if (dayData.apps.webex > 0 && (state.activeApp === 'all' || state.activeApp === 'webex')) {
          const webexDot = document.createElement('span');
          webexDot.className = 'app-indicator-dot';
          webexDot.style.backgroundColor = colors.webex;
          indicators.appendChild(webexDot);
        }
        
        dayCell.appendChild(indicators);
      }
      
      // Click handler
      dayCell.addEventListener('click', () => {
        handleDayClick(day);
      });
      
      elements.monthlyGrid.appendChild(dayCell);
    }
    
    // Update day features list
    if (state.selectedDay !== null) {
      renderDayFeatures();
    } else {
      elements.dayFeaturesList.classList.add('hidden');
    }
  }
  
  // Render year view
  function renderYearView() {
    // Clear grid
    elements.yearlyGrid.innerHTML = '';
    
    // Process monthly data
    const monthlyFeatures = [];
    for (let month = 0; month < 12; month++) {
      monthlyFeatures[month] = getFeaturesForMonth(month);
    }
    
    // Create month cards
    for (let month = 0; month < 12; month++) {
      const features = monthlyFeatures[month];
      
      // Count features by app
      const appCounts = {
        zoom: features.filter(f => f.app === 'Zoom').length,
        firefox: features.filter(f => f.app === 'Firefox').length,
        webex: features.filter(f => f.app === 'Webex').length
      };
      
      // Create month card
      const monthCard = document.createElement('div');
      monthCard.className = 'month-card';
      
      // Add selected class if this month is selected
      if (month === state.selectedMonthIndex) {
        monthCard.classList.add('selected');
      }
      
      // Month header
      const header = document.createElement('div');
      header.className = 'month-header';
      
      const monthName = document.createElement('span');
      monthName.className = 'month-name';
      monthName.textContent = shortMonthNames[month];
      
      const featureCount = document.createElement('span');
      featureCount.className = 'month-count';
      featureCount.textContent = features.length;
      
      header.appendChild(monthName);
      header.appendChild(featureCount);
      monthCard.appendChild(header);
      
      // Month grid (simplified from the detailed calendar logic)
      const monthGrid = document.createElement('div');
      monthGrid.className = 'month-grid';
      
      // Group features by week
      const weeklyData = {};
      features.forEach(feature => {
        const date = new Date(feature.date);
        const weekNum = Math.floor(date.getDate() / 7);
        
        if (!weeklyData[weekNum]) {
          weeklyData[weekNum] = { count: 0, apps: {} };
        }
        
        weeklyData[weekNum].count++;
        weeklyData[weekNum].apps[feature.app.toLowerCase()] = (weeklyData[weekNum].apps[feature.app.toLowerCase()] || 0) + 1;
      });
      
      // Find max count for scaling
      const maxCount = Math.max(1, ...Object.values(weeklyData).map(week => week.count));
      
      // Create week cells
      for (let week = 0; week < 5; week++) {
        const weekData = weeklyData[week] || { count: 0, apps: {} };
        const intensity = weekData.count / maxCount;
        const colorKey = state.activeApp === 'all' ? 'combined' : state.activeApp;
        const bgcolor = intensity > 0 
          ? `rgba(${hexToRgb(colors[colorKey])}, ${Math.min(0.2 + intensity * 0.8, 1)})`
          : 'white';
        
        const weekCell = document.createElement('div');
        weekCell.className = 'week-cell';
        weekCell.style.backgroundColor = bgcolor;
        
        if (weekData.count > 0) {
          weekCell.textContent = weekData.count;
        }
        
        monthGrid.appendChild(weekCell);
      }
      
      monthCard.appendChild(monthGrid);
      
      // Month footer with app counts
      if (features.length > 0) {
        const footer = document.createElement('div');
        footer.className = 'month-footer';
        
        if (appCounts.zoom > 0 && (state.activeApp === 'all' || state.activeApp === 'zoom')) {
          const zoomCount = document.createElement('div');
          zoomCount.className = 'month-app-count';
          
          const zoomDot = document.createElement('span');
          zoomDot.className = 'month-app-dot';
          zoomDot.style.backgroundColor = colors.zoom;
          
          zoomCount.appendChild(zoomDot);
          zoomCount.appendChild(document.createTextNode(appCounts.zoom));
          footer.appendChild(zoomCount);
        }
        
        if (appCounts.firefox > 0 && (state.activeApp === 'all' || state.activeApp === 'firefox')) {
          const firefoxCount = document.createElement('div');
          firefoxCount.className = 'month-app-count';
          
          const firefoxDot = document.createElement('span');
          firefoxDot.className = 'month-app-dot';
          firefoxDot.style.backgroundColor = colors.firefox;
          
          firefoxCount.appendChild(firefoxDot);
          firefoxCount.appendChild(document.createTextNode(appCounts.firefox));
          footer.appendChild(firefoxCount);
        }
        
        if (appCounts.webex > 0 && (state.activeApp === 'all' || state.activeApp === 'webex')) {
          const webexCount = document.createElement('div');
          webexCount.className = 'month-app-count';
          
          const webexDot = document.createElement('span');
          webexDot.className = 'month-app-dot';
          webexDot.style.backgroundColor = colors.webex;
          
          webexCount.appendChild(webexDot);
          webexCount.appendChild(document.createTextNode(appCounts.webex));
          footer.appendChild(webexCount);
        }
        
        monthCard.appendChild(footer);
      }
      
      // Click handler
      monthCard.addEventListener('click', () => {
        handleMonthClick(month);
      });
      
      elements.yearlyGrid.appendChild(monthCard);
    }
    
    // Update month features list
    if (state.selectedMonthIndex !== null) {
      renderMonthFeatures();
    } else {
      elements.monthFeaturesList.classList.add('hidden');
    }
  }
  
  // Generate calendar data for current month
  function generateCalendarData() {
    const calendar = {};
    
    // Function to get datasets based on active app selection
    const getActiveDatasets = () => {
      if (state.activeApp === 'all') {
        return Object.entries(state.data);
      } else {
        return [[state.activeApp, state.data[state.activeApp]]];
      }
    };
    
    // Count features by date
    const activeDatasets = getActiveDatasets();
    activeDatasets.forEach(([app, releases]) => {
      releases.forEach(release => {
        const date = release.date;
        
        // Skip if date is not in selected year/month
        if (date.getFullYear() !== state.year || date.getMonth() !== state.month) {
          return;
        }
        
        const day = date.getDate();
        
        if (!calendar[day]) {
          calendar[day] = { total: 0, apps: { zoom: 0, firefox: 0, webex: 0 } };
        }
        
        calendar[day].total++;
        calendar[day].apps[app]++;
      });
    });
    
    return calendar;
  }
  
  // Handle day click in month view
  function handleDayClick(day) {
    if (state.selectedDay === day) {
      // Clear selection if clicking the same day again
      state.selectedDay = null;
      state.selectedFeatures = [];
      elements.dayFeaturesList.classList.add('hidden');
    } else {
      state.selectedDay = day;
      state.selectedFeatures = getFeaturesForDay(day);
      renderDayFeatures();
    }
    
    // Re-render the month view to update selected state
    renderMonthView();
  }
  
  // Handle month click in year view
  function handleMonthClick(monthIndex) {
    if (state.selectedMonthIndex === monthIndex) {
      // Clear selection if clicking the same month again
      state.selectedMonthIndex = null;
      state.selectedFeatures = [];
      elements.monthFeaturesList.classList.add('hidden');
    } else {
      state.selectedMonthIndex = monthIndex;
      state.selectedFeatures = getFeaturesForMonth(monthIndex);
      renderMonthFeatures();
    }
    
    // Re-render the year view to update selected state
    renderYearView();
  }
  
  // Get features for a specific day
  function getFeaturesForDay(day) {
    const features = [];
    const exactDate = new Date(state.year, state.month, day);
    const dateStr = exactDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    // Function to filter features by exact date
    const filterByExactDate = (feature) => {
      if (!feature.date) return false;
      const featureDate = new Date(feature.date);
      return featureDate.toISOString().split('T')[0] === dateStr;
    };
    
    // Add features from selected applications
    if (state.activeApp === 'all' || state.activeApp === 'zoom') {
      state.data.zoom.filter(filterByExactDate).forEach(feature => {
        features.push({
          app: 'Zoom',
          color: colors.zoom,
          category: feature.category,
          description: feature.description,
          date: feature.date
        });
      });
    }
    
    if (state.activeApp === 'all' || state.activeApp === 'firefox') {
      state.data.firefox.filter(filterByExactDate).forEach(feature => {
        features.push({
          app: 'Firefox',
          color: colors.firefox,
          description: feature.description,
          date: feature.date
        });
      });
    }
    
    if (state.activeApp === 'all' || state.activeApp === 'webex') {
      state.data.webex.filter(filterByExactDate).forEach(feature => {
        features.push({
          app: 'Webex',
          color: colors.webex,
          description: feature.description,
          date: feature.date
        });
      });
    }
    
    return features;
  }
  
  // Get features for a specific month
  function getFeaturesForMonth(monthIndex) {
    const features = [];
    
    // Filter function for month
    const filterByMonth = (feature) => {
      if (!feature.date) return false;
      const featureDate = new Date(feature.date);
      return featureDate.getFullYear() === state.year && featureDate.getMonth() === monthIndex;
    };
    
    // Add features from selected applications
    if (state.activeApp === 'all' || state.activeApp === 'zoom') {
      state.data.zoom.filter(filterByMonth).forEach(feature => {
        features.push({
          app: 'Zoom',
          color: colors.zoom,
          date: feature.date,
          category: feature.category,
          description: feature.description
        });
      });
    }
    
    if (state.activeApp === 'all' || state.activeApp === 'firefox') {
      state.data.firefox.filter(filterByMonth).forEach(feature => {
        features.push({
          app: 'Firefox',
          color: colors.firefox,
          date: feature.date,
          description: feature.description
        });
      });
    }
    
    if (state.activeApp === 'all' || state.activeApp === 'webex') {
      state.data.webex.filter(filterByMonth).forEach(feature => {
        features.push({
          app: 'Webex',
          color: colors.webex,
          date: feature.date,
          description: feature.description
        });
      });
    }
    
    // Sort by date
    return features.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  
  // Render features for selected day
  function renderDayFeatures() {
    // Update container visibility
    elements.dayFeaturesList.classList.remove('hidden');
    
    // Create features list
    elements.dayFeaturesList.innerHTML = `
      <div class="features-header">
        <h4 class="features-title">
          Features Released on ${monthNames[state.month]} ${state.selectedDay}, ${state.year}
        </h4>
        <span class="features-count">
          ${state.selectedFeatures.length} feature${state.selectedFeatures.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div class="features-list" id="dayFeatureItems">
        ${state.selectedFeatures.length > 0 ? '' : '<p class="no-features">No features released on this day</p>'}
      </div>
    `;
    
    // Get container for feature items
    const featuresContainer = document.getElementById('dayFeatureItems');
    
    // Add feature items
    state.selectedFeatures.forEach((feature, index) => {
      const featureItem = document.createElement('div');
      featureItem.className = 'feature-item';
      
      const featureHeader = document.createElement('div');
      featureHeader.className = 'feature-header';
      
      // App indicator
      const appIndicator = document.createElement('div');
      appIndicator.className = 'feature-app';
      
      const appDot = document.createElement('span');
      appDot.className = 'feature-app-dot';
      appDot.style.backgroundColor = feature.color;
      
      appIndicator.appendChild(appDot);
      appIndicator.appendChild(document.createTextNode(feature.app));
      
      featureHeader.appendChild(appIndicator);
      
      // Category (if available)
      if (feature.category) {
        const categoryTag = document.createElement('span');
        categoryTag.className = 'feature-category';
        categoryTag.textContent = feature.category;
        featureHeader.appendChild(categoryTag);
      }
      
      featureItem.appendChild(featureHeader);
      
      // Description
      const description = document.createElement('p');
      description.className = 'feature-description';
      description.textContent = feature.description;
      
      featureItem.appendChild(description);
      featuresContainer.appendChild(featureItem);
    });
  }
  
  // Render features for selected month
  function renderMonthFeatures() {
    // Update container visibility
    elements.monthFeaturesList.classList.remove('hidden');
    
    // Create features list
    elements.monthFeaturesList.innerHTML = `
      <div class="features-header">
        <h4 class="features-title">
          Features Released in ${monthNames[state.selectedMonthIndex]} ${state.year}
        </h4>
        <div style="display: flex; align-items: center; gap: 16px;">
          <span class="features-count">
            ${state.selectedFeatures.length} feature${state.selectedFeatures.length !== 1 ? 's' : ''}
          </span>
          <button class="view-month-btn" id="viewMonthBtn">
            View in Monthly Calendar
          </button>
        </div>
      </div>
      <div class="features-list" id="monthFeatureItems">
        ${state.selectedFeatures.length > 0 ? '' : '<p class="no-features">No features released this month</p>'}
      </div>
    `;
    
    // Add event listener to the view month button
    const viewMonthBtn = document.getElementById('viewMonthBtn');
    if (viewMonthBtn) {
      viewMonthBtn.addEventListener('click', () => {
        state.month = state.selectedMonthIndex;
        state.view = 'month';
        state.selectedDay = null;
        state.selectedFeatures = [];
        updateUI();
      });
    }
    
    // Get container for feature items
    const featuresContainer = document.getElementById('monthFeatureItems');
    
    // Add feature items
    state.selectedFeatures.forEach((feature, index) => {
      const featureItem = document.createElement('div');
      featureItem.className = 'feature-item';
      
      const featureHeader = document.createElement('div');
      featureHeader.className = 'feature-header';
      
      // App indicator
      const appIndicator = document.createElement('div');
      appIndicator.className = 'feature-app';
      
      const appDot = document.createElement('span');
      appDot.className = 'feature-app-dot';
      appDot.style.backgroundColor = feature.color;
      
      appIndicator.appendChild(appDot);
      appIndicator.appendChild(document.createTextNode(feature.app));
      
      featureHeader.appendChild(appIndicator);
      
      // Category (if available)
      if (feature.category) {
        const categoryTag = document.createElement('span');
        categoryTag.className = 'feature-category';
        categoryTag.textContent = feature.category;
        featureHeader.appendChild(categoryTag);
      }
      
      // Date
      const dateDisplay = document.createElement('span');
      dateDisplay.className = 'feature-date';
      dateDisplay.textContent = new Date(feature.date).toLocaleDateString();
      featureHeader.appendChild(dateDisplay);
      
      featureItem.appendChild(featureHeader);
      
      // Description
      const description = document.createElement('p');
      description.className = 'feature-description';
      description.textContent = feature.description;
      
      featureItem.appendChild(description);
      featuresContainer.appendChild(featureItem);
    });
  }
  
  // Render summary statistics
  function renderSummaryStats() {
    const stats = getFeatureStats();
    
    // Update total features
    elements.totalFeatures.textContent = stats.totalFeatures;
    
    // Update app breakdown
    elements.appBreakdown.innerHTML = '';
    
    const addAppIndicator = (app, count) => {
      if (count > 0 && (state.activeApp === 'all' || state.activeApp === app)) {
        const indicator = document.createElement('div');
        indicator.className = 'app-indicator';
        
        const dot = document.createElement('span');
        dot.className = 'app-dot';
        dot.style.backgroundColor = colors[app];
        
        indicator.appendChild(dot);
        indicator.appendChild(document.createTextNode(`${count} ${app.charAt(0).toUpperCase() + app.slice(1)}`));
        
        elements.appBreakdown.appendChild(indicator);
      }
    };
    
    addAppIndicator('zoom', stats.byApp.zoom);
    addAppIndicator('firefox', stats.byApp.firefox);
    addAppIndicator('webex', stats.byApp.webex);
    
    // Update year stats
    elements.yearStats.innerHTML = '';
    
    Object.entries(stats.byYear).forEach(([year, count]) => {
      if (count > 0) {
        const yearBar = document.createElement('div');
        yearBar.className = 'year-bar';
        
        const yearLabel = document.createElement('span');
        yearLabel.className = 'year-label';
        yearLabel.textContent = year;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = `${(count / stats.totalFeatures) * 100}%`;
        progressFill.style.backgroundColor = state.activeApp === 'all' ? colors.combined : colors[state.activeApp];
        
        const countLabel = document.createElement('span');
        countLabel.className = 'year-count';
        countLabel.textContent = count;
        
        progressBar.appendChild(progressFill);
        yearBar.appendChild(yearLabel);
        yearBar.appendChild(progressBar);
        yearBar.appendChild(countLabel);
        
        elements.yearStats.appendChild(yearBar);
      }
    });
    
    // Update categories (for Zoom only)
    if (state.activeApp === 'zoom') {
      elements.categoriesContainer.style.display = 'block';
      
      const topCategories = getTopCategories();
      elements.categoryStats.innerHTML = '';
      
      topCategories.forEach(cat => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        
        const categoryName = document.createElement('span');
        categoryName.className = 'category-name';
        categoryName.textContent = cat.category;
        
        const categoryCount = document.createElement('span');
        categoryCount.className = 'category-count';
        categoryCount.textContent = cat.count;
        
        categoryItem.appendChild(categoryName);
        categoryItem.appendChild(categoryCount);
        
        elements.categoryStats.appendChild(categoryItem);
      });
    } else {
      elements.categoriesContainer.style.display = 'none';
    }
  }
  
  // Get feature statistics
  function getFeatureStats() {
    const stats = {
      totalFeatures: 0,
      byApp: {
        zoom: 0,
        firefox: 0,
        webex: 0
      },
      byYear: {
        2022: 0,
        2023: 0,
        2024: 0
      }
    };
    
    // Filter by active app
    const appsToInclude = state.activeApp === 'all' 
      ? ['zoom', 'firefox', 'webex'] 
      : [state.activeApp];
    
    appsToInclude.forEach(app => {
      state.data[app].forEach(feature => {
        stats.totalFeatures++;
        stats.byApp[app]++;
        
        if (feature.date) {
          const year = new Date(feature.date).getFullYear();
          if (stats.byYear[year] !== undefined) {
            stats.byYear[year]++;
          }
        }
      });
    });
    
    return stats;
  }
  
  // Get top categories for Zoom
  function getTopCategories() {
    // Count features by category
    const categoryCounts = {};
    
    state.data.zoom.forEach(feature => {
      if (feature.category) {
        if (!categoryCounts[feature.category]) {
          categoryCounts[feature.category] = 0;
        }
        categoryCounts[feature.category]++;
      }
    });
    
    // Sort by count and take top 5
    return Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
  }
  
  // Convert hex color to RGB
  function hexToRgb(hex) {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  }
  
  // Initialize the application when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', init);