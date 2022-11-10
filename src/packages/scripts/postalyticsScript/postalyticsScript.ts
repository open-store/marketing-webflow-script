import { WebflowScript } from '../../types'

const postalyticsScript: WebflowScript = {
  requireFeatureFlag: 'webflow_script_postalytics_script',
  handler: () => {
    /*eslint-disable */
    var a
    var rc = new RegExp('_bn_d=([^;]+)')
    var rq = new RegExp('_bn_d=([^&#]*)', 'i')
    var aq = rq.exec(window.location.href)
    if (aq != null) a = aq
    else var ac = rc.exec(document.cookie)
    // @ts-ignore
    if (ac != null) a = ac
    if (a != null) {
      ;(function () {
        var pl = document.createElement('script')
        pl.type = 'text/javascript'
        pl.async = true
        pl.src =
          ('https:' == document.location.protocol
            ? 'https://app'
            : 'http://app') + '.postaladmin.com/plDataEmbed.js'
        var s = document.getElementsByTagName('script')[0]
        // @ts-ignore
        s.parentNode.insertBefore(pl, s)
      })()
    }
  },
}

export default postalyticsScript
