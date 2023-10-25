import { MAX_CARDS } from "@/config";
import {
  FocusTrap,
  NumberInput,
  Group,
  Button,
  SimpleGrid,
  Select,
  Alert,
} from "@mantine/core";
import { useState, KeyboardEvent, useMemo } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";

type FormCreateNewGameProps = {
  onSubmit: (values: {
    total: number;
    rows: string | number;
    cols: string | number;
  }) => void;
};

export function FormCreateNewGame({ onSubmit }: FormCreateNewGameProps) {
  const [numberInputValue, setNumberInputValue] = useState(0);
  const [rowInputValue, setRowInputValue] = useState("auto-fit");
  const [colInputValue, setColInputValue] = useState("auto-fit");
  const [error, setError] = useState("");

  const hasError = useMemo(() => {
    return error.trim().length > 0;
  }, [error]);

  const handleSubmit = () => {
    if (numberInputValue % 2 !== 0) {
      setError("Total cards must be an even number. E.g: 2, 4, 6, 8");
      return;
    }

    if (numberInputValue > MAX_CARDS * 2) {
      setError(`Total cards must be <= ${MAX_CARDS * 2}`);
      return;
    }

    onSubmit({
      total: numberInputValue,
      rows: rowInputValue,
      cols: colInputValue,
    });
  };
  return (
    <>
      {hasError && (
        <Alert
          mb="lg"
          radius="md"
          variant="outline"
          bg="red.2"
          color="red"
          withCloseButton
          icon={<IconAlertTriangle size={20} />}
        >
          {error}
        </Alert>
      )}
      <FocusTrap active={true}>
        <NumberInput
          hideControls
          label={`Total cards (Max. ${MAX_CARDS * 2})`}
          placeholder="Enter even nunmber only"
          radius="md"
          mb={"md"}
          data-autofocus
          value={numberInputValue}
          onChange={(value) => setNumberInputValue(Number(value))}
          onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") handleSubmit();
          }}
        />
      </FocusTrap>
      <SimpleGrid cols={2}>
        <Select
          label="Cols"
          data={[
            { value: "auto-fit", label: "auto" },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5", label: "5" },
            { value: "6", label: "6" },
            { value: "7", label: "7" },
            { value: "8", label: "8" },
            { value: "9", label: "9" },
            { value: "10", label: "10" },
          ]}
          value={colInputValue}
          onChange={(value) => setColInputValue(value || "auto-fit")}
        />
        <Select
          label="Rows"
          data={[
            { value: "auto-fit", label: "auto" },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5", label: "5" },
            { value: "6", label: "6" },
            { value: "7", label: "7" },
            { value: "8", label: "8" },
            { value: "9", label: "9" },
            { value: "10", label: "10" },
          ]}
          value={rowInputValue}
          onChange={(value) => setRowInputValue(value || "auto-fit")}
        />
      </SimpleGrid>
      <Group justify="flex-end" mt="md">
        <Button radius="md" color="dark" onClick={handleSubmit}>
          Create
        </Button>
      </Group>
    </>
  );
}
