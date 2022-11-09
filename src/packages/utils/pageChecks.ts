export const isHomePage = () => {
  return window.location.pathname === '/'
}

export const isBusinessPage = () => {
  return window.location.pathname.startsWith('/business')
}

export const isProd = () => {
  return (
    global.location.hostname === 'open.store' ||
    global.location.hostname === 'webflow-prod.open.store'
  )
}

export const URLs = {
  merchantOpenStore : 'https://merchant.open.store',
}
