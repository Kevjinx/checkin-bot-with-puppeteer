const puppeteer = require('puppeteer');
const dayjs = require('dayjs')
require('dotenv').config();
const email = process.env.GITHUB_EMAIL.toString()
const password = process.env.GITHUB_PASSWORD.toString()

const delay = (time) => {
  return new Promise(function(resolve) {
      setTimeout(resolve, time)
  });
}

const checkIn = async () => {
  console.log('start');
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://progress.appacademy.io/students/auth/github')
  console.log('signing up');
  await page.type('#login_field', email)
  await page.type('#password', password)
  await page.keyboard.press('Enter');
  console.log('signed in');
  await page.waitForNavigation(),
  await delay(5000)
  await page.waitForSelector('.zoom-github-links'),
  console.log('logged in');

  let i = 0
  setInterval(async () => {
    i++
    console.log(`Looking for the checkIn button, at ${dayjs().format('hh:mm:ss A')} for the ${i}th time`);
    try {
      if (await page.$('.student-check-in-form')) {
        await page.click('.student-check-in-form')
        let now = dayjs().format('hh:mm:ss A')
        console.log(`checked in at ${now}`);
        await page.screenshot({ path: `./screenshot/checkInAt${dayjs().format('hh:mm:ss')}.png`})
      }
    } catch(e) {}
  }, 120000);

}

checkIn()