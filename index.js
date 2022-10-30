require("dotenv").config();
const { chromium } = require("playwright");
const cron = require("node-cron");

async function doMyAttendance(login = false) {
  console.log(`Your domain is ${process.env.COMPANY_DOMAIN}`)
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(process.env.COMPANY_DOMAIN);
  await page.fill("#username", process.env.EMAIL);
  await page.fill("#password", process.env.PASSWORD);
  await page.click("button");

  if (login) {
    await page.click("text=Sign In");
    setTimeout(async () => {
      await browser.close(); 
    }, 15000);
  } else {
    await page.click("text=Sign Out");
    setTimeout(async () => {
      await browser.close(); 
    }, 15000);
  }
}

/* 
Login: Monday - Friday at 10:45 am => 45 10 * * 1-5
Logout: Monday - Friday at 9:00 pm => 0 21 * * 1-5
*/

 async function begin() {

  cron.schedule("45 10 * * 1-5", async function () {
    console.log("Logging...");
    await doMyAttendance(true);
  });

  cron.schedule("0 21 * * 1-5", async function () {
    console.log("Log outing...");
    await doMyAttendance();
  });
}

begin();
