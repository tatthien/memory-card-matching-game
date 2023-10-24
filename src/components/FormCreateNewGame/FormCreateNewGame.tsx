import { FocusTrap, NumberInput, Group, Button } from "@mantine/core";
import { useState, KeyboardEvent } from "react";

type FormCreateNewGameProps = {
  onSubmit: (values: { total: number }) => void;
};

export function FormCreateNewGame({ onSubmit }: FormCreateNewGameProps) {
  const [numberInputValue, setNumberInputValue] = useState(0);
  const handleSubmit = () => {
    onSubmit({ total: numberInputValue });
  };
  return (
    <>
      <FocusTrap active={true}>
        <NumberInput
          hideControls
          label="Total cards"
          placeholder="0"
          data-autofocus
          value={numberInputValue}
          onChange={(value) => setNumberInputValue(Number(value))}
          onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") handleSubmit();
          }}
        />
      </FocusTrap>
      <Group justify="flex-end" mt="md">
        <Button radius="md" color="dark" onClick={handleSubmit}>
          Create
        </Button>
      </Group>
    </>
  );
}
