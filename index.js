require('dotenv').config();
const TelegramApi = require('node-telegram-bot-api');
const usefulFn = require('./helpers/usefulFunctions');
const {gameOptions, gameOptionsAgain} = require('./helpers/options')

const bot = new TelegramApi(process.env.BOT_TOKEN, { polling: true });

const chatInfo = {};

const gameLogic = async (chatId) => {
  chatInfo.randomNumber = usefulFn.randomNumber();

  await bot.sendMessage(chatId,'Guess the number from 1 to 10', gameOptions);
}

bot.setMyCommands([
  {command: '/start', description: 'Start bot'},
  {command: '/game', description: 'Play game'}
])

bot.on('message', async ctx => {
  const { text, from } = ctx;
  const chatId = ctx.chat.id;

  if (text === '/start') {
    chatInfo.username = usefulFn.getUserName(from);

    await bot.sendMessage(chatId, '👋');
    return bot.sendMessage(chatId, `Is your name ${chatInfo.username}?`);
  }

  if (text === '/game') {
    return gameLogic(chatId);
  }

  return bot.sendMessage(chatId, 'I not understand you..')
})

bot.on('callback_query', async ctx => {
  const data = ctx.data;
  const chatId = ctx.message.chat.id;

  if (data === '/again') {
    return gameLogic(chatId);
  }

  if (data === chatInfo.randomNumber) {
    return await bot.sendMessage(chatId, `You guessed the number! ${chatInfo.randomNumber}`, gameOptionsAgain);
  } else {
    return await bot.sendMessage(chatId, `Try once more. Number: ${chatInfo.randomNumber}`, gameOptionsAgain);
  }
})