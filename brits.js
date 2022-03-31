//const today = () => new Date('2022-07-10')
const today = () => new Date()

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const monthDay = d => d.getMonth() * 100 + d.getDate()
const byMonthAndDay = (a, b) => monthDay(a) > monthDay(b) ? 1 : -1
const afterToday = d => monthDay(d) > monthDay(today())
const beforeToday = d => monthDay(d) < monthDay(today())
const isToday = d => monthDay(d) == monthDay(today())

const dates = require('./dates').sort((a, b) => byMonthAndDay(a.date, b.date))
const rdates = [...dates].reverse()

const bucket = (list, fn) => {
  let d = {}
  list.forEach(item => {
    const k = fn(item)
    d[k] = (d[k] || 0) + 1
  })
  return d
}

const highest = bucket => {
  let r = []
  let max = null
  for (let k in bucket) {
    if (!max || bucket[k] > max) {
      max = bucket[k]
      r = [k]
    } else if (bucket[k] == max) {
      r.push(k)
    }
  }
  return { max, keys: r }
}

const nextHoliday = () => dates.find(d => afterToday(d.date)) || dates[0]
const thisHoliday = () => dates.find(d => isToday(d.date))
const lastHoliday = () => rdates.find(d => beforeToday(d.date)) || dates[0]

const countryName = d => (d.iso ? `:flag-${d.iso.toLowerCase()}: ` : '') + `*${d.country}*` + (d.previously ? ` (formerly _${d.previously}_)` : '')

/*
console.dir(nextHoliday())
console.dir(thisHoliday())
console.dir(lastHoliday())

const check = (fn) => {
  console.log('---')
  console.dir(bucket(dates, fn))
  console.dir(highest(bucket(dates, fn)))
}
check(x => monthNames[x.date.getMonth()])
check(x => x.date.getDate())
check(x => x.date.getYear() + 1900)
check(x => `${x.date.getYear() + 1900 - x.date.getYear() % 10}s`)
check(x => x.date.getYear() % 2 ? 'even' : 'odd')
check(x => dayNames[x.date.getDay()])
*/

const plural = (n, one, many) => n == 1 ? one : many
const ordinal = n => {
  if (n % 100 == 11 || n % 100 == 12 || n % 100 == 13) {
    return `${n}th`
  }
  if (n % 10 == 1) {
    return `${n}st`
  }
  if (n % 10 == 2) {
    return `${n}nd`
  }
  if (n % 10 == 3) {
    return `${n}rd`
  }
  return `${n}th`
}
const sentence = l => [l.slice(0,-1).join(', '), l.slice(-1)[0]].filter(v => v != '').join(' and ')
const funFacts = [
  () => {
    const { max, keys } = highest(bucket(dates, x => `${x.date.getYear() + 1900 - x.date.getYear() % 10}s`))
    const which = randl(keys)
    const countries = dates.filter(x => `${x.date.getYear() + 1900 - x.date.getYear() % 10}s` == which).map(x => x.country)
    return `The worst decade for the British empire was definitely the ${which}; ${max} ${plural(max, 'country', 'countries')} won their independence then, including ${randl(countries)}!`
  },

  () => {
    const { max, keys } = highest(bucket(dates, x => monthNames[x.date.getMonth()]))
    const which = randl(keys)
    const countries = dates.filter(x => monthNames[x.date.getMonth()] == which).map(x => x.country)
    return `${which} is a bad month for the British; no fewer than ${max} ${plural(max, 'country', 'countries')} broke away in ${which}! (google 'em: ${sentence(countries)})`
  },

  () => {
    const { max, keys } = highest(bucket(dates, x => ordinal(x.date.getDate())))
    const which = randl(keys)
    return `If you're Great Britain, you start to dread the ${which} of the month–and with good reason!  It's the day when most territories will rebel. ${max} of them already have!`
  },

  () => {
    const { max, keys } = highest(bucket(dates, x => x.date.getYear() + 1900))
    const which = randl(keys)
    const countries = dates.filter(x => x.date.getYear() + 1900 == which).map(x => x.country)
    return `Far and away, the worst year for the empire was ${which}, when ${max} ${plural(max, 'territory', 'territories')} up and left in only 12 months!  (that would be ${sentence(countries)}, if you're curious...)`
  },

  () => `Did you know that ${dates.length} ${plural(dates.length, 'country has', 'countries have')} chosen *not* to be a part of the British empire?`,

  () => `Independence from Britain brings the world together; it's celebrated once every ~${parseInt(365 / dates.length)} days _somewhere_ in the world!`,

  () => `Fear not!  There are only 14 more crown territories / protectorates / what have you that can still rebel, so... they've got that going for them.`,
]

const randn = max => parseInt(Math.random() * max)
const randl = l => l[randn(l.length)]
const funFact = () => randl(funFacts)()

const prettyDate = d => `${monthNames[d.getMonth()]} ${ordinal(d.getDate())}`

module.exports = {
  funFact,
  lastHoliday,
  thisHoliday,
  nextHoliday,
  prettyDate,
  countryName,
}
