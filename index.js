const { App } = require('@slack/bolt')
const brits = require('./brits')

const app = new App({
  socketMode: true,
  token:      process.env.BOT_TOKEN,
  appToken:   process.env.APP_TOKEN,
});

const countryName = d => `*${d.country}*` + (d.previously ? ` (formerly _${d.previously}_)` : '')

const dispatch = async (msg, say) => {
  if (msg.match(/fun fact/, 'i')) {
    await say(brits.funFact())
  }

  if (msg.match(/next/, 'i')) {
    const h = brits.nextHoliday()
    await say(`${countryName(h)} celebrates its indepedence from the crown on *${brits.prettyDate(h.date)}* :tada:`)
  }

  if (msg.match(/just celebrated/, 'i')) {
    const h = brits.lastHoliday()
    await say(`${countryName(h)} just celebrated their indepedence on *${brits.prettyDate(h.date)}* :confetti_ball:`)
  }
}

app.message('', async ({ message, say }) => {
  await dispatch(message.text, say)
});

app.event('app_mention', async ({ event, say }) => {
  await dispatch(event.text, say)
});

(async () => {
  await app.start()
  console.log('🇬🇧 BritBot started - God Save the Queen!')
})()
