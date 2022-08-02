import addScriptTag from './addScriptTag'

describe('addScriptTag', () => {
  afterEach(() => {
    // We need to cleanup jsdom after every test run.
    document.body.innerHTML = ''
  })

  it('should append script tag to dom', () => {
    // Requires another script tag to be present in the document.
    document.body.innerHTML = '<script type="text/javascript"></script>'

    addScriptTag('TestTag', 'https://example.com')

    const testTag = document.getElementById('srctagLoaderTestTag')
    expect(testTag).not.toBeNull()
    expect(testTag?.parentNode).toBe(document.body)
  })

  it('is not appending tag without any other scripts in document', () => {
    expect(() => {
      addScriptTag('TestTag', 'https://example.com')
    }).toThrow("Failed to add script tag with ID: 'TestTag'")

    const testTag = document.getElementById('srctagLoaderTestTag')
    expect(testTag).toBeNull()
  })

  it('sets additional attributes to script tag', () => {
    document.body.innerHTML = '<script type="text/javascript"></script>'
    addScriptTag('TestTag', 'https://example.com', {
      attributes: { name: 'jest', foo: 'bar123' },
    })

    const testTag = document.getElementById('srctagLoaderTestTag')
    expect(testTag?.getAttribute('name')).toBe('jest')
    expect(testTag?.getAttribute('foo')).toBe('bar123')
  })
})
