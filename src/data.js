const DESCRIPTIONS = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];

const TAGS = [
  `homework`,
  `theory`,
  `practice`,
  `intensive`,
  `keks`
];

const COLORS = [
  `black`,
  `yellow`,
  `blue`,
  `green`,
  `pink`
];

const DURATION = {
  DAY_IN_WEEK: 7,
  HOURS_IN_DAY: 24,
  MINUTES_IN_HOUR: 60,
  SECONDS_IN_MINUTE: 60,
  MILLISECONDS_IN_SECOND: 1000,
};

const TIMESTAMP_DAY = DURATION.HOURS_IN_DAY * DURATION.MINUTES_IN_HOUR * DURATION.SECONDS_IN_MINUTE * DURATION.MILLISECONDS_IN_SECOND;

export const getTask = () => ({
  description: DESCRIPTIONS[Math.floor(Math.random() * 3)],
  dueDate:
      Date.now() + 1 + Math.floor(Math.random() * (DURATION.DAY_IN_WEEK + DURATION.DAY_IN_WEEK)) * TIMESTAMP_DAY - (DURATION.DAY_IN_WEEK * DURATION.HOURS_IN_DAY * DURATION.MINUTES_IN_HOUR * DURATION.SECONDS_IN_MINUTE * DURATION.MILLISECONDS_IN_SECOND),
  repeatingDays: {
    'mo': Boolean(Math.round(Math.random())),
    'tu': Boolean(Math.round(Math.random())),
    'we': Boolean(Math.round(Math.random())),
    'th': Boolean(Math.round(Math.random())),
    'fr': Boolean(Math.round(Math.random())),
    'sa': Boolean(Math.round(Math.random())),
    'su': Boolean(Math.round(Math.random())),
  },
  tags: new Set(TAGS),
  color: COLORS[Math.floor(Math.random() * 5)],
  isFavorite: Boolean(Math.round(Math.random())),
  isArchive: Boolean(Math.round(Math.random())),
});
