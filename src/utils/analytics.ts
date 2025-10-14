import ReactGA from 'react-ga4'

const TRACKING_ID = 'G-GFJPNSXCQ4'

export const initGA = () => {
  ReactGA.initialize(TRACKING_ID, {
    gtagOptions: {
      send_page_view: false, // We'll manually track page views
    },
  })
}

export const logPageView = (path: string, title?: string) => {
  ReactGA.send({
    hitType: 'pageview',
    page: path,
    title: title || document.title,
  })
}

export const logEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  })
}

// Convenience functions for common events
export const logButtonClick = (buttonName: string) => {
  logEvent('Button', 'Click', buttonName)
}

export const logLinkClick = (linkName: string, destination: string) => {
  logEvent('Link', 'Click', `${linkName} -> ${destination}`)
}

export const logFormSubmit = (formName: string) => {
  logEvent('Form', 'Submit', formName)
}

export const logProjectView = (projectTitle: string) => {
  logEvent('Project', 'View', projectTitle)
}

export const logDownload = (fileName: string) => {
  logEvent('Download', 'Click', fileName)
}
