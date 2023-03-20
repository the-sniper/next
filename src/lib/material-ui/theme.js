import { createTheme } from "@mui/material/styles";

const globalTheme = createTheme({});

export const theme = createTheme(globalTheme, {
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: false,
      },
    },
  },
});
