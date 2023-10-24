import { AppLayout, FormCreateNewGame } from "@/components";
import { Box, Button, Group, Image, Text } from "@mantine/core";
import classes from "./app.module.css";
import { useState, MouseEvent, useEffect, useMemo } from "react";
import { modals } from "@mantine/modals";

const icons = ["chest", "flower", "mushroom", "star", "ten", "twenty"];
const maxCards = icons.length;

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

const buildGame = (cards: number) => {
  const choosenIcons = icons.slice(0, cards);

  // Initialize board by double the icons
  const board = [...choosenIcons, ...choosenIcons];

  // Shuffle board
  return shuffleArray(board);
};

function App() {
  console.log(">>> re-render");

  const [totalCards, setTotalCards] = useState(0);
  const [match, setMatch] = useState(0);
  const [done, setDone] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);

  const board = useMemo(() => {
    if (totalCards === 0 || totalCards / 2 > maxCards) return [];
    return buildGame(totalCards / 2);
  }, [totalCards]);

  useEffect(() => {
    if (selectedCards.length === 2) {
      const icons = [selectedCards[0].icon, selectedCards[1].icon];
      const ids = [selectedCards[0].id, selectedCards[1].id];

      // match
      if (icons[0] === icons[1]) {
        setMatch(match + 1);
      } else {
        // reset
        setTimeout(() => {
          setFlippedCards((items) => items.filter((e) => !ids.includes(e.id)));
        }, 1000);
      }

      setSelectedCards([]);
    }
  }, [selectedCards, match]);

  useEffect(() => {
    if (match > 0 && match === totalCards / 2) {
      setDone(true);
    }
  }, [match, totalCards]);

  const handleFlipCard = (card: Card) => {
    if (selectedCards.find((e) => e.id === card.id)) return;
    if (flippedCards.find((e) => e.id === card.id)) return;

    setFlippedCards((items) => [...items, card]);

    if (selectedCards.length < 2) {
      setSelectedCards((items) => [...items, card]);
    }
  };

  const handlResetGame = () => {
    setMatch(0);
    setDone(false);
    setFlippedCards([]);
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
                          setTotalCards(values.total);
                          modals.closeAll();
                        }}
                      />
                    ),
                  })
                }
              >
                New game
              </Button>
              <Button
                variant="default"
                radius="md"
                color="dark"
                disabled={!done}
                onClick={handlResetGame}
              >
                Reset
              </Button>
            </Group>
            <Text fw={600} fz={24}>{`${match} / ${totalCards / 2}`}</Text>
          </Group>
        </Box>
        <Box className={classes.grid}>
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
                <Image src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1116884/spade.svg" />
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
