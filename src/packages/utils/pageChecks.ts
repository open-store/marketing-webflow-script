export const isHomePage = () => {
    return window.location.pathname === '/'
}

export const isBusinessPage = () => {
    return window.location.pathname.startsWith('/business')
}
