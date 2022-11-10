import { WebflowScript } from '../../types'

const bingScript: WebflowScript = {
  requireFeatureFlag: 'webflow_script_bing_script',
  handler: () => {
    /*eslint-disable */
    ;(function (w, d, t, r, u) {
      // @ts-ignore
      var f,
        // @ts-ignore
        n,
        i
        // @ts-ignore
      ;(w[u] = w[u] || []),
        (f = function () {
          var o = { ti: '52009730' }
          // @ts-ignore
          ;(o.q = w[u]), (w[u] = new UET(o)), w[u].push('pageLoad')
        }),
        (n = d.createElement(t)),
        // @ts-ignore
        (n.src = r),
        // @ts-ignore
        (n.async = 1),
        // @ts-ignore
        (n.onload = n.onreadystatechange =
          function () {
            // @ts-ignore
            var s = this.readyState
            ;(s && s !== 'loaded' && s !== 'complete') ||
              // @ts-ignore
              (f(), (n.onload = n.onreadystatechange = null))
          }),
        (i = d.getElementsByTagName(t)[0]),
        // @ts-ignore
        i.parentNode.insertBefore(n, i)
    })(window, document, 'script', '//bat.bing.com/bat.js', 'uetq')
    /*eslint-enable */
  },
}

export default bingScript
