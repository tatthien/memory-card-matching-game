import { Box } from "@mantine/core";

import classes from "./AppLayout.module.css";

interface AppLayoutProps {
  children: React.ReactElement;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box className={classes.layout}>
      <Box component="main" className={classes.main}>
        {children}
      </Box>
    </Box>
  );
}
