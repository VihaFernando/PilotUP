const GA_MEASUREMENT_ID = 'G-0K3CRYDW2F'

export function pageview(path) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
    })
  }
}

export function event(name, params = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params)
  }
}

export { GA_MEASUREMENT_ID }
