import { Button, createTheme, Modal, rem } from "@mantine/core";

export default createTheme({
  fontFamily: "Silkscreen",
  primaryColor: "dark",
  components: {
    Modal: Modal.extend({
      styles: (theme) => ({
        title: {
          fontWeight: 600,
          fontSize: theme.fontSizes.lg,
        },
      }),
    }),
    Button: Button.extend({
      vars: (_, props) => {
        if (props.size === "xs") {
          return {
            root: {
              "--button-height": rem(28),
              "--button-fz": rem(14),
            },
          };
        }

        return { root: {} };
      },
    }),
  },
});
