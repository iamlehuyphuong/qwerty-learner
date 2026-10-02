import { chromium } from 'playwright'

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`PAGE ERROR: ${msg.text()}`)
    }
  })

  page.on('pageerror', (error) => {
    console.log(`UNCAUGHT ERROR: ${error.message}`)
  })

  try {
    await page.goto('http://localhost:5002/analysis', { waitUntil: 'networkidle' })
    console.log('Navigated to /analysis')
  } catch (e) {
    console.error('Failed to navigate to /analysis', e)
  }

  try {
    await page.goto('http://localhost:5002/gallery', { waitUntil: 'networkidle' })
    console.log('Navigated to /gallery')
  } catch (e) {
    console.error('Failed to navigate to /gallery', e)
  }

  await browser.close()
})()
