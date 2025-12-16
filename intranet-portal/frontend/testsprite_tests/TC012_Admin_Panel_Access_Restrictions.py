import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:5174", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Input non-admin user credentials and attempt login.
        frame = context.pages[-1]
        # Input user ID for non-admin user
        elem = frame.locator('xpath=html/body/div/div[2]/div/div[2]/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('00001')
        

        frame = context.pages[-1]
        # Input password for non-admin user
        elem = frame.locator('xpath=html/body/div/div[2]/div/div[2]/div[2]/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Admin123!')
        

        frame = context.pages[-1]
        # Click login button to submit non-admin user credentials
        elem = frame.locator('xpath=html/body/div/div[2]/div/div[2]/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Clear the username input field and input admin username, then input password and login.
        frame = context.pages[-1]
        # Focus on username input field to clear it
        elem = frame.locator('xpath=html/body/div/div[2]/div/div[2]/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Input admin username
        elem = frame.locator('xpath=html/body/div/div[2]/div/div[2]/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('00001')
        

        frame = context.pages[-1]
        # Input admin password
        elem = frame.locator('xpath=html/body/div/div[2]/div/div[2]/div[2]/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Admin123!')
        

        frame = context.pages[-1]
        # Click login button to submit admin credentials
        elem = frame.locator('xpath=html/body/div/div[2]/div/div[2]/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Clear the username field properly, input admin username '00001' and password 'Admin123!', then click login button.
        frame = context.pages[-1]
        # Focus on username input field to clear it
        elem = frame.locator('xpath=html/body/div/div[2]/div/div[2]/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Input admin username
        elem = frame.locator('xpath=html/body/div/div[2]/div/div[2]/div[2]/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('00001')
        

        frame = context.pages[-1]
        # Input admin password
        elem = frame.locator('xpath=html/body/div/div[2]/div/div[2]/div[2]/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Admin123!')
        

        frame = context.pages[-1]
        # Click login button to submit admin credentials
        elem = frame.locator('xpath=html/body/div/div[2]/div/div[2]/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Select 'Sistem Yönetimi' unit to access the admin panel and perform management operations.
        frame = context.pages[-1]
        # Select 'Sistem Yönetimi' unit to enter admin panel
        elem = frame.locator('xpath=html/body/div/div[2]/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Try clicking on other units or the logout button to see if any navigation occurs, or report the issue if no navigation is possible.
        frame = context.pages[-1]
        # Click 'Bilgi İşlem' unit button to test navigation
        elem = frame.locator('xpath=html/body/div/div[2]/div/div[2]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Click 'Test Birimi' unit button to test navigation
        elem = frame.locator('xpath=html/body/div/div[2]/div/div[2]/button[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Perform user management operations by clicking on 'Kullanıcı Yönetimi' (User Management) menu item.
        frame = context.pages[-1]
        # Click on 'Kullanıcı Yönetimi' (User Management) to manage users
        elem = frame.locator('xpath=html/body/div/div/div/div[2]/div/div[2]/div[3]/div[2]/ul/li/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click 'Yeni Kullanıcı' (New User) button to add a new user and verify creation functionality.
        frame = context.pages[-1]
        # Click 'Yeni Kullanıcı' button to add a new user
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[2]/div[2]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Fill in the new user details: Ad, Soyad, Sicil No, Ünvân, and Şifre, then save the new user.
        frame = context.pages[-1]
        # Input first name 'Test'
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[2]/form/div[2]/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('Test')
        

        frame = context.pages[-1]
        # Input last name 'User'
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[2]/form/div[2]/div/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('User')
        

        frame = context.pages[-1]
        # Input Sicil No '99999'
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[2]/form/div[2]/div/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('99999')
        

        frame = context.pages[-1]
        # Click 'Ünvân' dropdown to select a title
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[2]/form/div[2]/div/div[4]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Try to select the Ünvan dropdown by clicking it and then manually clicking the first option if possible, then save the new user.
        frame = context.pages[-1]
        # Click 'Ünvan' dropdown to open options
        elem = frame.locator('xpath=html/body/div/div/main/div/div/div[2]/form/div[2]/div/div[4]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        try:
            await expect(frame.locator('text=Access Granted to Admin Panel').first).to_be_visible(timeout=1000)
        except AssertionError:
            raise AssertionError("Test failed: Non-admin user was able to access the admin panel or admin operations did not complete successfully as per the test plan.")
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    