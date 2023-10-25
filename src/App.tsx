import { AppLayout, FormCreateNewGame } from "@/components";
import { Box, Button, Group, Image, Text } from "@mantine/core";
import classes from "./app.module.css";
import { useState, useEffect } from "react";
import { modals } from "@mantine/modals";
import confetti from "canvas-confetti";
import { ICONS } from "./config";

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

function App() {
  const [board, setBoard] = useState<string[]>([]);
  const [totalCards, setTotalCards] = useState(0);
  const [match, setMatch] = useState(0);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [rows, setRows] = useState<string | number>("auto-fit");
  const [cols, setCols] = useState<string | number>("auto-fit");

  useEffect(() => {
    if (selectedCards.length === 2) {
      const icons = [selectedCards[0].icon, selectedCards[1].icon];
      const ids = [selectedCards[0].id, selectedCards[1].id];

      if (icons[0] === icons[1]) {
        // match
        setMatch(match + 1);
        setSelectedCards([]);
        showConfetti();
      } else {
        // reset
        setTimeout(() => {
          setFlippedCards((items) => items.filter((e) => !ids.includes(e.id)));
          setSelectedCards([]);
        }, 1000);
      }
    }
  }, [selectedCards, match]);

  useEffect(() => {
    if (match > 0 && match === totalCards) {
      showConfetti();
    }
  }, [match, totalCards]);

  const handleFlipCard = (card: Card) => {
    if (selectedCards.find((e) => e.id === card.id)) return;
    if (flippedCards.find((e) => e.id === card.id)) return;

    if (selectedCards.length < 2) {
      setFlippedCards((items) => [...items, card]); // Make sure opening 2 cards at a time
      setSelectedCards((items) => [...items, card]);
    }
  };

  const newGame = (total: number) => {
    setTotalCards(total / 2);
    setBoard(createBoard(total / 2));
  };

  const resetGame = () => {
    setMatch(0);
    setFlippedCards([]);
  };

  const showConfetti = () => {
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });
  };

  return (
    <AppLayout>
      <>
        <Box px={32} py={16}>
          <Group justify="space-between">
            <Group>
              <Button
                radius="md"
                color="dark"
                onClick={() =>
                  modals.open({
                    title: "New game",
                    children: (
                      <FormCreateNewGame
                        onSubmit={(values) => {
                          resetGame();
                          newGame(values.total);
                          setRows(values.rows);
                          setCols(values.cols);
                          modals.closeAll();
                        }}
                      />
                    ),
                  })
                }
              >
                New game
              </Button>
            </Group>
            <Text fw={600} fz={24}>{`${match} / ${totalCards}`}</Text>
          </Group>
        </Box>
        <Box
          style={{ "--board-cols": cols, "--board-rows": rows }}
          className={classes.grid}
        >
          {board.map((icon: string, index: number) => (
            <Box
              key={index}
              className={`${classes.card} ${
                // @TODO: using `cx`
                flippedCards.find((e) => e.id === index) ? classes.flip : ""
              }`}
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
      </>
    </AppLayout>
  );
}

export default App;
