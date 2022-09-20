export type Opts = {
  onLoad?: () => void
  attributes?: Record<string, string>
  defer?: boolean
}

export default function addScriptTag(
  id: string,
  src: string,
  opts: Opts = {},
): void {
  const scriptId = `srctagLoader${id}`

  // Don't inject same script twice.
  if (document.getElementById(scriptId)) {
    return
  }

  try {
    const scriptEl = document.createElement('script')
    scriptEl.id = scriptId
    scriptEl.type = 'text/javascript'
    scriptEl.async = true
    scriptEl.defer = !!opts.defer
    scriptEl.src = src

    if (opts.onLoad) {
      scriptEl.onload = opts.onLoad
    }
    if (opts.attributes) {
      for (const attrName of Object.keys(opts.attributes)) {
        scriptEl.setAttribute(attrName, opts.attributes[attrName])
      }
    }

    // Facebook style type of loader. Auto detects where to put new scripts to.
    const scriptAnchor = document.getElementsByTagName('script')[0]
    if (!scriptAnchor || !scriptAnchor.parentNode) {
      throw new Error('Missing script anchor tag')
    }

    scriptAnchor.parentNode.insertBefore(scriptEl, scriptAnchor)
  } catch (_err) {
    throw new Error(`Failed to add script tag with ID: '${id}'`)
  }
}
