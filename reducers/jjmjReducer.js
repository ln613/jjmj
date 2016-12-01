export default (s = { games: [] }, a) => {
  switch (a.type) {
    case 'games':
      return {...s, games: a.games, game: null, date: a.date };
    case 'game':
      return {...s, game: {...s.games.find(x => x.id == a.id), idx: 0, plays: a.plays } };
    case 'next':
      return {...s, game: {...s.game, err: null, idx: s.game.idx < s.game.plays.length - 1 ? s.game.idx + 1 : s.game.idx} };
    case 'prev':
      return {...s, game: {...s.game, err: null, idx: s.game.idx > 0 ? s.game.idx - 1 : 0} };
    case 'error':
      return {...s, game: {...s.game, err: true} };
    case 'list':
      return {...s, game: null };
    case 'show_score':
      return {...s, setting: {...s.setting, showScore: a.val } };
    case 'layout':
      return {...s, layout: {...s.layout, ...a.val } };
    default:
      return s;
  }
}
