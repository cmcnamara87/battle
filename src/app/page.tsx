'use client';
import Image from 'next/image';
import { useState } from 'react';
import p1Pic from './p1.png';
import p2Pic from './p2.png';

const cards = Array.from({ length: 52 }, (_, i) => {
  const value = (i % 13) + 1;
  if (value < 10) {
    return 0;
  }
  return value - 9;
});

const shuffledCards = cards.sort(() => Math.random() - 0.5);
const player1Cards = shuffledCards.slice(0, shuffledCards.length / 2);
const player2Cards = shuffledCards.slice(shuffledCards.length / 2);

export default function Home() {
  const [p1, setP1] = useState(player1Cards);
  const [p2, setP2] = useState(player2Cards);

  const [activePlayer, setActivePlayer] = useState(0);

  const [stack, setStack] = useState<
    { value: number; player: number }[]
  >([]);

  const [battle, setBattle] = useState<number>(-1);
  const [maxBattle, setMaxBattle] = useState(0);
  return (
    <div>
      <div className="flex flex-row justify-center">
        <button
          className="bg-red-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            if (battle === 0) {
              // battle over
              // give all the stack to the other player
              const winnerPlayer = activePlayer === 0 ? 1 : 0;
              if (winnerPlayer === 0) {
                p1.push(...stack.map((c) => c.value));
                setP1([...p1]);
              } else {
                p2.push(...stack.map((c) => c.value));
                setP2([...p2]);
              }
              setStack([]);
              setActivePlayer(activePlayer === 0 ? 1 : 0);
              setBattle(-1);
              return;
            }
            let next: number | undefined;
            if (activePlayer === 0) {
              next = p1.shift() as number;
              setP1([...p1]);
            } else {
              next = p2.shift() as number;
              setP2([...p2]);
            }
            stack.unshift({
              value: next,
              player: activePlayer,
            });

            if (battle > 0 && next === 0) {
              // dec battle
              const newBattle = battle - 1;
              setBattle(newBattle);
              // player doesnt change
            } else {
              if (next > 0) {
                setBattle(next);
                setMaxBattle(next);
              }
              // not in a battle
              setActivePlayer(activePlayer === 0 ? 1 : 0);
            }
          }}
        >
          go!
        </button>
      </div>
      <div className="flex">
        <div className="w-1/3 bg-blue-500">
          <div>
            YOU - {activePlayer === 0 ? 'active' : 'not active'}
            <Image src={p1Pic} alt="Picture of the author" />
            {battle >= 0 && activePlayer === 0 && (
              <div>
                Battle: HP: {battle} -{' '}
                {battle === 0 &&
                  `You lost, they won, get they ${stack.length} monster energy`}
                <div
                  className="w-full h-4 bg-red-500 rounded-full animate-pulse"
                  style={{
                    width: `${(battle / maxBattle) * 100}%`,
                  }}
                ></div>
              </div>
            )}
          </div>
          <div>Monster Energy: {p1.length} cards</div>

          {p1.map((card, index) => {
            return (
              <div key={index} className={`transform`}>
                <div
                  className={`bg-${'blue'}-500 ring-white ring-1 w-32 h-48 flex items-center justify-center rounded-lg shadow-lg`}
                  style={{
                    position: 'absolute',
                    left: `${index * 10}px`,
                  }}
                >
                  {/* <p className="text-white text-4xl font-bold text-center"></p> */}
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-1/3 flex flex-col p-11">
          {/* {stack[0] === 0 ? 'Rest' : 'Fight'} */}
          {/* <pre>{JSON.stringify(stack, null, 2)}</pre> */}
          <div className="flex relative w-32 h-48">
            {[...stack].reverse().map((card, index) => {
              return (
                <div key={index} className={`transform`}>
                  <div
                    className={`bg-${
                      card.player === 0 ? 'blue' : 'red'
                    }-500 w-32 h-48 flex items-center justify-center rounded-lg shadow-lg`}
                    style={{
                      position: 'absolute',
                      left: `${index * 10}px`,
                    }}
                  >
                    <p className="text-white text-4xl font-bold text-center">
                      {battle >= 0 && battle !== maxBattle
                        ? battle === 0
                          ? `${
                              activePlayer === 0
                                ? 'You lost'
                                : 'They lost'
                            } 👊`
                          : `${
                              activePlayer === 0
                                ? 'You got hit'
                                : 'They got hit'
                            } 👊`
                        : card.value === 0
                        ? 'Rest'
                        : `Attack ${card.value}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* {stack[0] === 0 ? 'Rest' : 'Fight'} */}
          {/* <pre>{JSON.stringify(stack, null, 2)}</pre> */}
        </div>
        <div className="w-1/3 bg-red-500">
          {battle >= 0 && activePlayer === 1 && (
            <div>
              Battle: HP: {battle} -{' '}
              {battle === 0 &&
                `They lost, you won, you get they ${stack.length} monster energy`}
              <div
                className="w-full h-4 bg-blue-500 rounded-full animate-pulse"
                style={{
                  width: `${(battle / maxBattle) * 100}%`,
                }}
              ></div>
            </div>
          )}
          <div className="">
            Them - {activePlayer === 1 ? 'active' : 'not active'}
            <Image src={p2Pic} alt="Picture of the author" />
          </div>
          Monster Energy: {p2.length} cards
          {p2.map((card, index) => {
            return (
              <div key={index} className={`transform`}>
                <div
                  className={`bg-${'red'}-500 ring-white ring-1 w-32 h-48 flex items-center justify-center rounded-lg shadow-lg`}
                  style={{
                    position: 'absolute',
                    left: `${index * 10}px`,
                  }}
                >
                  {/* <p className="text-white text-4xl font-bold text-center"></p> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
