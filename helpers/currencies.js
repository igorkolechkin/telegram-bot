module.exports = {
  defaultCurrencies: {
    reply_markup: JSON.stringify({
      keyboard: [
        [{text: 'USD', callback_data: 'USD'}, {text: 'EUR', callback_data: 'EUR'}]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    })
  }
}