require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api');
const axios = require('axios');
const cc = require('currency-codes');

const { defaultCurrencies } = require('./helpers/currencies');
const { getUserName } = require('./helpers/usefulFunctions');

const currencyInfo = {
  limitTime: false
}

const bot = new TelegramApi(process.env.BOT_TOKEN, { polling: true });

bot.setMyCommands([
  { command: '/start', description: 'Start bot' },
  { command: '/currency', description: 'Get currency info' }
])

bot.on('message', async ctx => {
  const { text, from } = ctx;
  const chatId = ctx.chat.id;
  const codeInfo = cc.code(text);

  if (text === '/start') {
    const userName = getUserName(from);

    return await bot.sendMessage(chatId, `Hello, ${userName}!`)
  }

  if (text === '/currency') {
    return await bot.sendMessage(chatId, 'Enter currency', defaultCurrencies)
  }

  if (!/^[A-Z]+$/i.test(text) || !codeInfo) {
    return await bot.sendMessage(chatId, 'Incorrect currency');
  }

  try {
    if (!currencyInfo.limitTime) {
      const response = await axios.get('https://api.monobank.ua/bank/currency');

      currencyInfo.list = response.data;
      currencyInfo.limitTime = true;
    } else {
      setTimeout(() => {
        currencyInfo.limitTime = false
      }, 1000 * 60 * 5);
    }

    const currency = await currencyInfo.list.find(elem => elem.currencyCodeA.toString() === codeInfo.number);

    if (!currency) {
      return await bot.sendMessage(chatId, 'Something wrong with currency data...')
    }

    return await bot.sendMessage(chatId,
      `Currency: ${codeInfo.currency}
Buy: ${currency.rateBuy}
Sell: ${currency.rateSell}`,
      {
        reply_markup: {
          remove_keyboard: true
        }
      });
  } catch (error) {
    console.log('error', currencyInfo.limitTime)
    console.log('error', error)
  }
})