import { useEffect } from 'react'
import SITE from '../data/site'

/**
 * Custom hook to dynamically set the page title
 * @param pageTitle - The title for the current page (e.g., "Projects", "About")
 * @param includeAppName - Whether to append the site name (default: true)
 */
export function usePageTitle(pageTitle?: string, includeAppName: boolean = true) {
  useEffect(() => {
    if (pageTitle) {
      // Format: "Lex Ferguson | Page Title"
      document.title = includeAppName 
        ? `${SITE.titleShort} | ${pageTitle}`
        : pageTitle
    } else {
      // Use default site title
      document.title = SITE.title
    }
    
    // Update Open Graph meta tags dynamically
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', document.title)
    }
    
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle) {
      twitterTitle.setAttribute('content', document.title)
    }
  }, [pageTitle, includeAppName])
}
