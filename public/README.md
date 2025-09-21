# Client-Side POST Request Sender/Receiver with Vercel Function Backend

This project provides a client-side web application for sending POST requests and displaying responses, integrated with a simple Vercel serverless function for data handling. It is built using HTML, Tailwind CSS, and vanilla JavaScript for the frontend.

## Features

*   **Request Sender:** A form to send POST requests to a configurable Vercel function API.
*   **Data Receiver/Display:** A page (`receive.html`) to fetch and display all previously stored data from the Vercel function.
*   Data is managed by a Vercel serverless function.
*   Displays stored JSON data with new entries at the top.
*   Clean, modern UI with an improved Tailwind CSS design.
*   Configurable backend API URL.

## How to View It

1.  **Save the files:** Save all the provided files into a single folder. Note that the Vercel function files are in an `api/` subdirectory.
2.  **Deploy to Vercel (Backend & Frontend):**
    *   Create a new project on Vercel and connect it to your Git repository (e.g., GitHub).
    *   Ensure the `vercel.json` file is at the root of your repository, and the `api/posts.js` file is present.
    *   Vercel will automatically detect and deploy the static frontend assets from the `public/` directory and the serverless function from `api/posts.js`.
    *   Your function endpoint will be accessible at `https://your-vercel-app-name.vercel.app/api/posts`.
    *   **Note:** The Vercel function in this example uses an in-memory array for data storage. This means the data is **ephemeral** and will reset if the function goes cold or the server instance is reloaded. For persistent data, you would need to integrate with an external database service.
3.  **Local Development:**
    *   Make sure you have Node.js installed.
    *   Install Vercel CLI globally: `npm install -g vercel`.
    *   Navigate to your project's root directory in your terminal.
    *   Run `npm start` (or `vercel dev`) to start a local development server. This will serve your `public` directory and expose your functions at `/api/posts` locally.
4.  Navigate between `index.html` (Send Request) and `receive.html` (Receive Data) using the header navigation.

## How to Personalize It

### 1. Change Page Titles and Site Headers

*   Open `config.json`.
*   Modify the `pageTitle`, `siteHeader`, `postSectionTitle`, and `receivePageTitle` values to your desired text.

    ```json
    {
      "pageTitle": "Your Custom Page Title",
      "siteHeader": "Your Awesome Site Header",
      "postSectionTitle": "Send Your Data Here",
      "receivePageTitle": "View Incoming Data"
    }
    ```

### 2. Update Backend API URL

*   Open `config.json`.
*   The `backendApiUrl` value defines the endpoint where the frontend will send and retrieve data.
*   If you deploy your Vercel app to a different URL or custom domain, ensure this value correctly points to `/api/posts` relative to your site's root.

    ```json
    {
      "backendApiUrl": "/api/posts" // This is the relative path for Vercel functions
    }
    ```

### 3. Configure Form Fields (HTML and `config.json`)

The input fields for the POST request form are defined directly in `index.html`. `config.json` also contains a `formFields` array which `script.js` uses to validate and collect data from the frontend.

*   **To add or remove form fields:**
    1.  **Modify `index.html`:** Add or remove HTML `<div class="flex flex-col">...</div>` blocks within the `<form id="post-form">` section. Ensure each input/textarea has a `name` attribute that matches the name you want to use for the data key, and an `id` attribute.

        Example of an HTML field structure:
        ```html
        <div class="flex flex-col">
          <label for="your_field_name" class="text-gray-700 font-medium mb-1">Your Field Label*</label>
          <input type="text" id="your_field_name" name="your_field_name" class="mt-1 p-3 border ..." placeholder="Placeholder text" required>
        </div>
        ```

    2.  **Update `config.json`:** For each field you have in `index.html` that you want to be included in the data payload sent to the backend, add a corresponding entry to the `formFields` array in `config.json`.

        Example `config.json` entry:
        ```json
        {
          "formFields": [
            // ... existing fields ...
            { "label": "Your Field Label", "name": "your_field_name", "type": "text", "placeholder": "Placeholder text", "required": true }
          ]
        }
        ```
        The `script.js` relies on this array to know which fields to look for and include in the JSON payload that gets sent to the backend.

*   **To change properties of existing fields (e.g., label, placeholder, required state):**
    *   Modify the `label` text and `placeholder` attribute directly in `index.html`.
    *   Adjust the `required` attribute in `index.html` (e.g., add `required` for mandatory fields).
    *   Update the corresponding `label`, `placeholder`, and `required` properties within the `formFields` array in `config.json` for consistency.

### 4. Customize Styling

*   This project uses Tailwind CSS. You can modify the existing Tailwind classes directly in `index.html` and `receive.html` to change colors, fonts, spacing, etc.
*   Custom CSS for gradients is embedded in the `<style>` tags. You can modify these for different color schemes.

### 5. Adjust JavaScript Logic (`script.js`)

*   Open `script.js`.
*   On the `index.html` page, the form submission now sends a `fetch` POST request to the `backendApiUrl` configured in `config.json`.
*   On `receive.html`, `script.js` sends a `fetch` GET request to `backendApiUrl` to retrieve all stored data from the backend, sorts it by timestamp (newest first), and renders it dynamically on the page.
*   The "Clear All Data" button now sends a `fetch` DELETE request to `backendApiUrl` to clear all data on the backend.

### 6. Toggle "Receive Data" Navigation Tab

*   Open `config.json`.
*   To remove the "Receive Data" tab from the navigation header on `index.html`, set `showReceiveTab` to `false`:

    ```json
    {
      "showReceiveTab": false
    }
    ```

## Backend (Vercel Serverless Function)

*   The backend logic is implemented as a Vercel serverless function (`api/posts.js`).
*   It exposes `POST /api/posts`, `GET /api/posts`, and `DELETE /api/posts` endpoints.
*   It uses an **in-memory array** to store data. **This data is not persistent** and will reset when the function's instance is reloaded by Vercel (e.g., due to inactivity or new deployments).
*   **CORS is enabled** to allow requests from any origin.

## License

This work is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1).
