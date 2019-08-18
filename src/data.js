export const getTask = () => ({
  description: [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`
  ][Math.floor(Math.random() * 3)],
  dueDate:
      Date.now() + 1 + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000 - (7 * 24 * 60 * 60 * 1000),
  repeatingDays: {
    'mo': Boolean(Math.round(Math.random())),
    'tu': Boolean(Math.round(Math.random())),
    'we': Boolean(Math.round(Math.random())),
    'th': Boolean(Math.round(Math.random())),
    'fr': Boolean(Math.round(Math.random())),
    'sa': Boolean(Math.round(Math.random())),
    'su': Boolean(Math.round(Math.random())),
  },
  tags: new Set([`homework`, `theory`, `practice`, `intensive`, `keks`]),
  color: [`black`, `yellow`, `blue`, `green`, `pink`][Math.floor(Math.random() * 5)],
  isFavorite: Boolean(Math.round(Math.random())),
  isArchive: Boolean(Math.round(Math.random())),
});

export const getFilter = () => ({
  titles: [`all`, `overdue`, `today`, `favorites`, `repeating`, `tags`, `archive`],
  counts: [8, 922, 911, 24, 5, 6, 13],
});
