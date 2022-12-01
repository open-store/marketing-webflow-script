import { WebflowScript } from '../../types'
import { isBlogPostPage } from '../../utils/pageChecks'

const createListItemFromHeading = (heading: JQuery<HTMLElement>) => {
  const newListItem = $('<li></li>')
  const newAnchor = $('<a>')
  const headingId = heading
    .html()
    .replace(/\s+/g, '-')
    .replace(/[°&/\\#,+()$~%.'":;*?<>{}]/g, '')
    .toLowerCase() // replaces spaces with hyphens, removes special characters and extra spaces from the headings, and applies lowercase in slugs
  newAnchor.html(heading.html())
  newAnchor.addClass('tocitem')
  newAnchor.attr('href', location.pathname + '#' + headingId)

  $(`<a id=${headingId} class=heading-anchor></a>`).insertBefore(heading)
  newListItem.append(newAnchor)
  return newListItem
}

const generateTOCFromHeadings: WebflowScript = {
  requireFeatureFlag: 'webflow_script_generate_toc_from_headings',
  handler: () => {
    const tocBlock = $('#toc')
    // Only shows H3s in TOC if window has sufficient width
    const shouldShowH3s = ($(window).width() ?? 0) >= 1280

    if (!isBlogPostPage() || tocBlock.length === 0) {
      console.log('Skipping generateTOCFromHeadings')
      return
    }

    const h2s = $('h2')

    if (h2s.length > 0) {
      const tocList = $('<ul></ul>')
      tocList.addClass('toc-list')

      h2s.each(function () {
        const h2 = $(this)
        const h2ListItem = createListItemFromHeading(h2)
        const h3s = h2.nextUntil('h2').filter('h3')
        if (h3s.length > 0 && shouldShowH3s) {
          const h3ListContainer = $('<ul></ul>')
          h3ListContainer.addClass(['toc-list', 'toc-sub-list'])
          h3s.each(function () {
            const h3 = $(this)
            const h3Anchor = createListItemFromHeading(h3)
            h3ListContainer.append(h3Anchor)
          })

          h2ListItem.append(h3ListContainer)
        }

        tocList.append(h2ListItem)
      })

      tocBlock.append(tocList)
    }
  },
}

export default generateTOCFromHeadings
