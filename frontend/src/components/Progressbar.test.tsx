const calculateProgress = (
  seenCards: Set<string>,
  seenDifficultCards: Set<string>,
  cards: { id: string }[],
  difficultCards: { id: string }[],
  inDifficultMode: boolean
) => {
  const totalSeen =
    seenCards.size + (inDifficultMode ? 0 : seenDifficultCards.size);
  const totalCards =
    cards.length + (inDifficultMode ? difficultCards.length : 0);
  return (totalSeen / totalCards) * 100;
};

describe('calculateProgress', () => {
  it('beregner riktig fremdriftsprosent', () => {
    const seenCards = new Set(['card1', 'card2']);
    const seenDifficultCards = new Set(['']);
    const cards = [
      { id: 'card1' },
      { id: 'card2' },
      { id: 'card3' },
      { id: 'card4' },
    ];
    const difficultCards = [{ id: 'card1' }, { id: 'card2' }];
    const inDifficultMode = false;

    const progress = calculateProgress(
      seenCards,
      seenDifficultCards,
      cards,
      difficultCards,
      inDifficultMode
    );

    expect(progress).toBeCloseTo(75);
  });
});
