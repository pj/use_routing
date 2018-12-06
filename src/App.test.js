import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {parseRoute} from './useRouting';
import puppeteer from 'puppeteer';

it('puppeteer test', async () => {
  const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser'});
  console.log(await browser.version());
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await browser.close();
});
