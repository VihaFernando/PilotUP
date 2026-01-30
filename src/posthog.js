import posthog from 'posthog-js'

const key = import.meta.env.VITE_POSTHOG_KEY
if (key) {
    posthog.init(key, {
        api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
        autocapture: true,
        capture_pageview: true,
    })
} else {
    console.warn('PostHog: No VITE_POSTHOG_KEY in env – analytics disabled')
}

export default posthog