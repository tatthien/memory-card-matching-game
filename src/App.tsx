import { AppLayout, CreateNewGameForm } from "@/components";
import { Box, Button, Group, Image, Menu, Text } from "@mantine/core";
import classes from "./app.module.css";
import { useState, useEffect } from "react";
import { modals } from "@mantine/modals";
import { ICONS } from "./config";
import { clsx } from "clsx";

type Card = {
  id: number;
  icon: string;
};

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
const shuffleArray = (arr: string[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};

const createBoard = (cards: number) => {
  const choosenIcons = shuffleArray(ICONS).slice(0, cards);

  // Initialize board by double the icons
  const board = [...choosenIcons, ...choosenIcons];

  // Shuffle board
  return shuffleArray(board);
};

const instantGames = [
  {
    cols: 2,
    rows: 2,
  },
  {
    cols: 3,
    rows: 4,
  },
  {
    cols: 4,
    rows: 4,
  },
  {
    cols: 5,
    rows: 4,
  },
  {
    cols: 6,
    rows: 4,
  },
  {
    cols: 6,
    rows: 5,
  },
  {
    cols: 6,
    rows: 6,
  },
];

function App() {
  const [board, setBoard] = useState<string[]>(createBoard(8));
  const [totalCards, setTotalCards] = useState(0);
  const [totalMoves, setTotalMoves] = useState(0);
  const [match, setMatch] = useState(0);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [rows, setRows] = useState<string | number>(4);
  const [cols, setCols] = useState<string | number>(4);

  // Init game
  useEffect(() => {
    newGame({ total: 16, rows: 4, cols: 4 });
  }, []);

  useEffect(() => {
    if (selectedCards.length === 2) {
      const icons = [selectedCards[0].icon, selectedCards[1].icon];
      const ids = [selectedCards[0].id, selectedCards[1].id];

      if (icons[0] === icons[1]) {
        // Match
        setMatch(match + 1);
        setSelectedCards([]);

        // Matching effect
        setTimeout(() => {
          const card1 = document.getElementById(`card-${ids[0]}`);
          const card2 = document.getElementById(`card-${ids[1]}`);
          card1?.classList.add("pop");
          card2?.classList.add("pop");
        }, 400);
      } else {
        // Reset
        setTimeout(() => {
          setFlippedCards((items) => items.filter((e) => !ids.includes(e.id)));
          setSelectedCards([]);
        }, 800);
      }
    }
  }, [selectedCards, match]);

  useEffect(() => {
    if (match > 0 && match === totalCards) {
      // @TODO: show matching effect
    }
  }, [match, totalCards]);

  const handleFlipCard = (card: Card) => {
    // Increase total moves
    setTotalMoves(totalMoves + 1);

    if (selectedCards.find((e) => e.id === card.id)) return;
    if (flippedCards.find((e) => e.id === card.id)) return;

    if (selectedCards.length < 2) {
      // Make sure opening only 2 cards at a time
      setFlippedCards((items) => [...items, card]);
      setSelectedCards((items) => [...items, card]);
    }
  };

  const newGame = ({
    total,
    rows,
    cols,
  }: {
    total: number;
    rows: string | number;
    cols: string | number;
  }) => {
    resetGame();

    setTotalCards(total / 2);
    setRows(rows);
    setCols(cols);
    setBoard(createBoard(total / 2));
  };

  const resetGame = () => {
    setMatch(0);
    setFlippedCards([]);
  };

  return (
    <AppLayout>
      <>
        <Box py={16} mb={16} className={classes.container}>
          <Group justify="space-between">
            <Group>
              <Menu shadow="md" width={200} position="bottom-start">
                <Menu.Target>
                  <Button radius="md">New game</Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() =>
                      modals.open({
                        title: "New game",
                        children: (
                          <CreateNewGameForm
                            onSubmit={(values) => {
                              newGame(values);
                              modals.closeAll();
                            }}
                          />
                        ),
                      })
                    }
                  >
                    New game
                  </Menu.Item>
                  <Menu.Label>Instant game</Menu.Label>
                  {instantGames.map(({ cols, rows }) => (
                    <Menu.Item
                      key={`${cols}-${rows}`}
                      onClick={() =>
                        newGame({ total: cols * rows, cols, rows })
                      }
                    >
                      {`${cols * rows} cards - ${rows}x${cols}`}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </Group>
            <Group>
              <Text fw={600} fz={18}>
                Moves: {totalMoves}
              </Text>
            </Group>
          </Group>
        </Box>
        <Box className={classes.container} mb={16}>
          <Box
            style={{ "--board-cols": cols, "--board-rows": rows }}
            className={classes.grid}
          >
            {board.map((icon: string, index: number) => (
              <Box
                id={`card-${index}`}
                key={index}
                className={clsx(
                  classes.card,
                  flippedCards.find((e) => e.id === index) && classes.flip,
                )}
                data-icon={icon}
                onClick={() => handleFlipCard({ id: index, icon })}
              >
                <Box className={classes.front}>
                  <Text component="span">{index + 1}</Text>
                </Box>
                <Box className={classes.back}>
                  <Image src={`/assets/${icon}.svg`} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </>
    </AppLayout>
  );
}

export default App;
