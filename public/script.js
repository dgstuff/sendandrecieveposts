let siteConfig = {};
function initializeUI(config) {
  const pageTitleElement = document.getElementById('page-title');
  const siteHeaderElement = document.getElementById('site-header');
  const postSectionTitleElement = document.getElementById('post-section-title');
  const receiveSectionTitle = document.getElementById('receive-section-title');
  const currentYearElement = document.getElementById('current-year');
  const navReceiveTab = document.getElementById('nav-receive-tab');
  if (pageTitleElement) pageTitleElement.textContent = config.pageTitle;
  if (siteHeaderElement) siteHeaderElement.textContent = config.siteHeader;
  if (postSectionTitleElement) postSectionTitleElement.textContent = config.postSectionTitle;
  if (receiveSectionTitle) receiveSectionTitle.textContent = config.receivePageTitle;
  if (currentYearElement) currentYearElement.textContent = new Date().getFullYear();
  if (navReceiveTab && config.showReceiveTab === false) {
    navReceiveTab.style.display = 'none';
  }
}
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('./config.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    siteConfig = await response.json();
    console.log('Site configuration loaded:', siteConfig);
    initializeUI(siteConfig);
    if (document.getElementById('post-form')) {
      const postForm = document.getElementById('post-form');
      const responseContainer = document.getElementById('response-container');
      const responseData = document.getElementById('response-data');
      postForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(postForm);
        const data = {};
        siteConfig.formFields.forEach(field => {
          const value = formData.get(field.name);
          if (value !== null) {
            data[field.name] = value;
          }
        });
        try {
          const res = await fetch(siteConfig.backendApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Backend error: ${res.status} ${res.statusText} - ${errorText}`);
          }
          const result = await res.json();
          responseContainer.classList.remove('hidden');
          responseData.innerHTML = `\n          <p class="text-2xl text-green-700 font-semibold mb-4">Request successfully sent and stored!</p>\n          <p class="text-lg text-gray-600 mb-6">You can view all received data on the <a href="./receive.html" class="text-indigo-600 hover:underline">Receive Data page</a>.</p>\n          <h3 class="text-2xl font-semibold text-indigo-800 mb-4">Sent Data:</h3>\n          <pre class="whitespace-pre-wrap text-lg text-gray-700 bg-white p-6 rounded-xl overflow-x-auto border border-indigo-100 shadow-inner">${JSON.stringify(result, null, 2)}</pre>\n        `;
          postForm.reset();
        } catch (error) {
          console.error('Error sending POST request:', error);
          responseContainer.classList.remove('hidden');
          responseData.innerHTML = `<p class="text-red-600 font-semibold text-xl">Error: ${error.message}</p><p class="text-lg text-gray-600 mt-4">Please ensure the backend server is running and accessible at ${siteConfig.backendApiUrl}.</p>`;
        }
      });
    }
    if (document.getElementById('received-data-display')) {
      const displayContentContainer = document.getElementById('display-content-container');
      const clearAllDataButton = document.getElementById('clear-all-data');
      async function renderReceivedData() {
        displayContentContainer.innerHTML = '';
        try {
          const res = await fetch(siteConfig.backendApiUrl);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const existingRequests = await res.json();
          if (existingRequests.length === 0) {
            displayContentContainer.innerHTML = `\n              <p class="text-xl text-gray-700">No data received yet. Send a request from the <a href="./index.html" class="text-indigo-600 hover:underline">Send Request page</a>.</p>\n            `;
            return;
          }
          existingRequests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          existingRequests.forEach(request => {
            const requestBlock = document.createElement('div');
            requestBlock.className = 'mb-10 p-8 bg-white rounded-xl shadow-md border border-gray-100';
            requestBlock.innerHTML = `\n              <h4 class="text-2xl font-semibold text-indigo-800 mb-4">Request ID: ${request.id}</h4>\n              <p class="text-lg text-gray-500 mb-6">Timestamp: ${new Date(request.timestamp).toLocaleString()}</p>\n              <pre class="whitespace-pre-wrap text-lg text-gray-700 bg-indigo-50 p-6 rounded-lg overflow-x-auto border border-indigo-100">${JSON.stringify(request, null, 2)}</pre>\n            `;
            displayContentContainer.appendChild(requestBlock);
          });
        } catch (error) {
          console.error('Error fetching received data:', error);
          displayContentContainer.innerHTML = `<p class="text-red-600 font-semibold text-xl">Error loading data: ${error.message}</p><p class="text-lg text-gray-600 mt-4">Please ensure the backend server is running and accessible at ${siteConfig.backendApiUrl}.</p>`;
        }
      }
      renderReceivedData();
      if (clearAllDataButton) {
        clearAllDataButton.addEventListener('click', async () => {
          if (confirm('Are you sure you want to clear all stored data? This action cannot be undone.')) {
            try {
              const res = await fetch(siteConfig.backendApiUrl, {
                method: 'DELETE'
              });
              if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Backend error: ${res.status} ${res.statusText} - ${errorText}`);
              }
              alert('All stored data has been cleared!');
              renderReceivedData();
            } catch (error) {
              console.error('Error clearing data:', error);
              alert(`Failed to clear data: ${error.message}`);
            }
          }
        });
      }
    }
  } catch (error) {
    console.error('Failed to load site configuration or initial data:', error);
    document.body.innerHTML = `<div class="text-center text-red-600 text-3xl font-bold p-10">Error: Failed to load configuration or data. Please check console and ensure backend is running.</div>`;
  }
});
