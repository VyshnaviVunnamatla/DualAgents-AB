// Function to create page URLs based on page name
export function createPageUrl(pageName) {
    const pageMap = {
      "Dashboard": "/",
      "History": "/history",
    };
    return pageMap[pageName] || "/";
  }
