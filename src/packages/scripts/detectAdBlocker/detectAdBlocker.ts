export const isAdBlockerDetected = () =>
  new Promise<boolean>((resolve) => {
    const script = document.createElement('script')
    script.setAttribute('src', '/sailthru.js')
    script.setAttribute('type', 'text/javascript')
    script.onerror = () => resolve(true)
    script.onload = () => resolve(false)
    document.head.appendChild(script)
  })

export default isAdBlockerDetected
