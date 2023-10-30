import { MAX_CARDS } from "@/config";
import {
  FocusTrap,
  NumberInput,
  Group,
  Button,
  Select,
  Alert,
} from "@mantine/core";
import { useState, KeyboardEvent, useMemo } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";

type CreateNewGameFormProps = {
  onSubmit: (values: {
    total: number;
    rows: "auto-fit" | number;
    cols: "auto-fit" | number;
  }) => void;
};

export function CreateNewGameForm({ onSubmit }: CreateNewGameFormProps) {
  const [numberInputValue, setNumberInputValue] = useState(0);
  const [colInputValue, setColInputValue] = useState<"auto-fit" | number>(1);
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
      rows: "auto-fit",
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
      <Select
        label="Cols"
        data={[
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
        value={colInputValue as string}
        onChange={(value) => setColInputValue(Number(value) || "auto-fit")}
      />
      <Group justify="flex-end" mt="md">
        <Button radius="md" color="dark" onClick={handleSubmit}>
          Create
        </Button>
      </Group>
    </>
  );
}
