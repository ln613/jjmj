import R from 'ramda';

const H = {
  has4: t => R.pipe(R.flatten, R.filter(x => x === t), H.lenEq(4)),
  isFilled: R.all(x => x !== 'w'),

  isDigit: t => R.contains(t[0], 'wtb'),
  isWord: t => R.contains(t[0], 'fj'),
  isW: t => t[0] === 'w',
  isWind: t => t[0] === 'f',
  isArrow: t => t[0] === 'j',
  is1: t => H.isDigit(t) && t[1] === '1',
  is5: t => t[1] === '5',
  is9: t => t[1] === '9',
  isY: t => R.either(H.is1, H.is9)(t),
  isYOrWord: t => R.either(H.isY, H.isWord)(t),
  isNotYOrWord: t => R.complement(H.isYOrWord)(t),
  isEven: t => H.isDigit(t) && R.contains(t[1], '2468'),
  isSmall: t => H.isDigit(t) && R.contains(t[1], '123'),
  isMid: t => H.isDigit(t) && R.contains(t[1], '456'),
  isBig: t => R.contains(t[1], '789'),
  is6789: t => R.contains(t[1], '6789'),
  is1234: t => H.isDigit(t) && R.contains(t[1], '1234'),
  isBS: t => H.isDigit(t) && R.contains(t[1], '147'),

  isDigitH: h => H.isDigit(h[0]),
  isWordH: h => H.isWord(h[0]),
  isArrowKG: h => H.isArrow(h[0]) && H.isKG(h),
  isSameType: h => h[0][0] === h[1][0] && h[1][0] === h[2][0],
  isD: h => h.length === 2 && h[0] === h[1],
  isK: h => h.length === 3 && h[0] === h[1] && h[1] === h[2],
  isG: h => h.length === 4 && h[0] === h[1] && h[1] === h[2] && h[2] === h[3],
  isKG: h => H.isK(h) || H.isG(h),
  isDigitKG: h => H.isDigitH(h) && H.isKG(h),
  isYKG: h => R.both(H.isKG, R.pipe(R.head, H.isYOrWord))(h),
  isSNColor: t => R.allPass([H.lenEq(3), R.pipe(H.arr(0), R.uniq, H.lenEq(t)), H.isDigitH, R.pipe(H.arrN(1), H.isSeq)]),
  isS: h => H.isSNColor(1)(h),
  isS3: h => H.isSNColor(3)(h),
  isH: h => R.anyPass([H.isS, H.isKG, H.isD])(h),
  isM: h => h.m,
  isA: h => !h.m,
  isYoung: h => H.isS(h) && h[0][1] === '1',
  isAdult: h => H.isS(h) && h[0][1] === '4',
  isOld: h => H.isS(h) && h[0][1] === '7',
  is1to9: l => H.containsList([1, 4, 7])(l),
  
  byGroup: hs => R.pipe(R.groupBy(x => R.is(Array, x) ? x[0][0] : x[0]), R.toPairs, H.arr(1))(hs),
  
  byColor: t => R.pipe(
    R.filter(H.isDigitH),
    t ? (t === 1 ? R.filter(H.isS) : R.filter(H.isKG)) : R.identity,
    H.byGroup
  ),

  bySColor: hs => H.byColor(1)(hs),
  byKColor: hs => H.byColor(2)(hs),
  byFColor: hs => R.pipe(R.flatten, R.filter(H.isDigit), H.byGroup)(hs),
  byNumber: hs => R.pipe(R.filter(H.isS), R.groupBy(x => x[0][1]), R.toPairs, H.arr(1))(hs),
  
  byColorN: t => R.pipe(
    H.byColor(t),
    x => x.map(y => y.map(H.arr(1)))
  ),
  
  byProd3: t => R.pipe(
    H.byColorN(t),
    R.apply(H.xprod3)
  ),

  isPure: hs => R.both(H.is1Suit, R.any(H.isDigitH))(hs),
  isHalfPure: hs => R.allPass([R.all(H.isH), R.any(H.isWordH), R.pipe(R.filter(H.isDigitH), H.isPure)])(hs),
  isHSide: hs => R.pipe(H.getH, R.either(t => H.isYoung(t[0]) && t[1][1] === '3', t => H.isOld(t[0]) && t[1][1] === '7'))(hs),
  isHMid: hs => R.pipe(H.getH, x => H.isS(x[0]) && hs.h[1] === 1)(hs),
  isHPair: hs => hs.h[0] === 4 && hs[4][0] === hs[4][1],
  isHSelf: hs => H.isA(hs[hs.h[0]]),
  is1Color: hs => R.pipe(H.byFColor, H.lenEq(1))(hs),
  is2Color: hs => R.pipe(H.byFColor, H.lenEq(2))(hs),
  is3Color: hs => R.pipe(H.byFColor, H.lenEq(3))(hs),
  isUniqMoreThan: n => R.pipe(H.byFColor, R.any(x => R.uniq(x).length > n)),
  is6InARow: hs => R.pipe(H.bySColor, R.any(R.pipe(H.getT1N, R.uniq, x => R.xprod(x, x), R.any(x => x[1] - x[0] === 3))))(hs),
  is1ColorNSameS: n => R.pipe(H.bySColor, R.any(R.pipe(H.byNumber, R.any(H.lenEq(n))))), // 1c2s, 1c3s, 1c4s
  isNColorNSameS: n => R.pipe(H.byNumber, R.filter(H.lenGt(1)), R.any(R.pipe(H.getT1T, H.lenEq(n)))), // 2c2s, 3c3s
  isNSameK: n => R.pipe(R.filter(H.isDigitKG), R.flatten, H.maxByCountBy(R.nth(1)), R.nth(1), R.ifElse(x => n === 2, H.between(6, 8), H.gt(8))),
  is1Suit: hs => R.pipe(H.byGroup, H.lenEq(1))(hs),
  is5Suits: hs => R.either(R.pipe(H.byGroup, H.lenEq(5)), R.both(H.is7Pairs, R.pipe(R.flatten, R.groupBy(R.head), R.toPairs, H.lenEq(5))))(hs),
  
  isNColor3Sth: (n, t, f) => R.pipe(
    R.ifElse(
      x => n === 1,
      H.byColorN(t),
      H.byProd3(t)
    ),
    R.any(
      R.both(
        H.isNotNil,
        R.pipe(
          H.arrN(0),
          H.sort,
          f
        )
      )
    )
  ),
  
  is4in1: hs => R.pipe(R.flatten, H.maxByCount, R.both(x => x[1] === 4, x => R.pipe(R.filter(R.contains(x[0])), H.lenGt(1))(hs)))(hs),
  is3Color2Dragon: hs => R.allPass([
    H.is3Color, 
    R.pipe(H.getD, x => x && H.is5(x[0])), 
    R.pipe(
      H.bySColor,
      R.both(
        H.lenEq(2),
        R.all(
          R.both(
            H.isNotNil,
            R.pipe(H.getT1N, H.isSameSetOf([1, 7]))
          )
        )
      )
    )
  ])(hs),

  isLotus: hs => R.both(
    R.all(H.isA),
    R.pipe(
      R.flatten,
      R.allPass([
        H.is1Color,
        R.pipe(H.arrN(1), H.containsList(R.range(1, 10))),
        R.pipe(R.filter(H.is1), H.lenGte(3)),
        R.pipe(R.filter(H.is9), H.lenGte(3))
      ])
    )
  )(hs),

  is13Y: hs => R.pipe(
    R.flatten,
    R.both(
      R.all(H.isYOrWord),
      R.pipe(
        R.countBy(R.identity),
        R.toPairs,
        R.countBy(R.nth(1)),
        x => x['1'] === 12 && x['2'] === 1
      )
    )
  )(hs),

  toSep: () => R.pipe(
    R.xprod,
    R.map(x => x[1].map(y => x[0] + y)),
    R.apply(H.xprod3),
    R.filter(
      R.pipe(
        R.map(R.nth(1)),
        R.uniq, 
        R.length, 
        R.equals(3)
      )
    ),
    R.map(R.chain(x => R.pipe(
      R.tail,
      R.intersperse(x[0]),
      R.insert(0, x[0]),
      R.join(''),
      R.splitEvery(2)
    )(x))),
  )(['w','t','b'], [[147, 258, 369]]),

  is7Star: n => R.pipe(
    R.flatten,
    R.allPass([
      R.pipe(R.uniq, H.lenEq(14)),
      R.pipe(R.filter(H.isWord), H.lenGte(n)),
      R.pipe(
        R.filter(H.isDigit),
        x => R.any(H.isSuperSetOf(x), H.toSep())
      )
    ])
  ),

  isZigZag: hs => R.pipe(
    R.partition(R.either(H.isH, R.all(H.isWord))),
    R.both(
      R.pipe(
        R.head,
        R.both(
          H.lenEq(2),
          R.either(R.all(H.isH), x => H.is7Star(4, hs))
        ),
      ),
      R.pipe(
        R.last,
        R.both(
          R.pipe(H.arr(0), H.arr(0), R.uniq, H.lenEq(3)),
          R.all(
            R.allPass([
              R.pipe(H.arr(0), R.uniq, H.lenEq(1)),
              R.pipe(H.arr(1), R.join(''), x => R.contains(x, ['147', '258', '369']))
            ])
          )
        )
      ),
    )
  )(hs),

  is7Pairs: hs => R.both(
    R.pipe(R.init, R.all(H.isA)),
    R.pipe(
      R.flatten,
      R.both(
        H.lenEq(14),
        R.pipe(
          R.countBy(R.identity),
          R.toPairs,
          H.arrN(1),
          R.uniq,
          H.isSubSetOf([2, 4])
        )
      )
    )
  )(hs),

  is7SeqPairs: hs => R.allPass([
    H.is7Pairs,
    H.is1Suit,
    R.pipe(R.flatten, H.arrN(1), R.uniq, H.sort,
      R.both(
        H.lenEq(7),
        H.isSeq
      )
    )
  ])(hs),

  isValid: hs => R.both(
    R.all(H.isFilled),
    R.anyPass([
      H.isLotus,
      H.is13Y,
      H.is7Star(7),
      H.is7Star(4),
      H.is7SeqPairs,
      H.is7Pairs,
      H.isZigZag,
      R.both(
        R.pipe(R.init, R.all(H.isH)),
        R.pipe(R.last, H.isD)
      )
    ])
  )(hs),

  // the number of hands that satisfy f = c
  // c == 11, only check the D hand
  // c != 0, only check S/K/G hand
  // c < 0, the number of hands that satisfy f >= -c
  meet: R.curry((c, f, h) => {
    let t = R.curry((y, x) => { const b = f(x); return y(x) && (R.is(Array, b) ? b.isMet : b); });
    let f1 = t(x => true);
    if (c === 11) f1 = t(x => x.length === 2);
    else if (c !== 0) f1 = t(x => !R.is(Array, x) || x.length > 2); // x is array means hand, string means tile
    let r = h.filter(f1);
    const l1 = r.length;
    const l2 = c === 0 ? h.length : (c === 11 ? 1 : (c < 0 ? -c : c));
    r.isMet = c < 0 ? l1 >= l2 : l1 === l2;
    return r;
  }),

  getH: hs => [hs[hs.h[0]], hs[hs.h[0]][hs.h[1]]],
  getT1N: hs => R.pipe(H.arr(0), H.arrN(1), R.uniq, H.sort)(hs),
  getT1T: hs => R.pipe(H.arr(0), H.arr(0), R.uniq)(hs),
  getT1TN: hs => R.pipe(H.arr(0), H.arrN(0), R.uniq)(hs),
  getD: hs => R.pipe(R.filter(H.isD), x => x && x[0])(hs),

  cl: R.tap(console.log),
  sort: R.sort((a, b) => a > b),
  arr: i => R.map(x => x[i]),
  arrN: i => R.map(x => +x[i]),
  between: (a, b) => R.both(H.gte(a), H.lte(b)),
  gt: R.flip(R.gt),
  gte: R.flip(R.gte),
  lt: R.flip(R.lt),
  lte: R.flip(R.lte),
  lenEq: n => R.pipe(R.length, R.equals(n)),
  lenGt: n => R.pipe(R.length, R.lt(n)),
  lenGte: n => R.pipe(R.length, R.lte(n)),
  lenLt: n => R.pipe(R.length, R.gt(n)),
  lenLte: n => R.pipe(R.length, R.gte(n)),
  max: R.reduce(R.max, -Infinity),
  maxBy: (f, t) => R.reduce(R.maxBy(f), t),
  maxByN1: l => H.maxBy(R.nth(1), [,0])(l),
  maxByCount: l => R.pipe(R.countBy(R.identity), R.toPairs, H.maxByN1)(l),
  maxByCountBy: f => R.pipe(R.countBy(f), R.toPairs, H.maxByN1),
  xprod3: (a, b, c) => R.xprod(R.xprod(a || [], b || []), c || []).map(x => R.append(R.last(x), R.unnest(R.init(x)))),
  containsList: R.curry((l1, l2) => R.all(x => R.contains(x, l2 || []), l1 || [])),
  isNotNil: R.complement(R.isNil),
  isNotEmptyArray: l => R.both(R.is(Array), H.lenGt(1))(l),
  isSubSetOf: a => R.pipe(R.without(a), H.lenEq(0)),
  isSuperSetOf: a => R.pipe(R.flip(R.without)(a), H.lenEq(0)),
  isSameSetOf: a => R.both(H.isSubSetOf(a), H.isSuperSetOf(a)),
  isDistinct: l => R.equals(l.length, R.pipe(R.uniq, R.length)(l)),
  isSeq: l => R.pipe(H.sort, R.both(H.isDistinct, x => R.last(x) - x[0] === x.length - 1))(l),
  isSeq2: l => R.pipe(H.sort, R.both(H.isDistinct, x => R.sum(x) == (x[0] + R.last(x)) * x.length / 2 && (R.last(x) - x[0]) / (x.length - 1) === 2))(l),
  isSeq1or2: l => R.either(H.isSeq, H.isSeq2)(l),
  isNStep: n => R.both(H.isNotEmptyArray, R.pipe(R.uniq, H.sort, R.aperture(n), R.any(H.isSeq))),
}
//window.H = H;
export default H;