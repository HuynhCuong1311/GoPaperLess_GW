import { cyan, orange, red } from "@mui/material/colors";
import {
  experimental_extendTheme as extendTheme,
  responsiveFontSizes,
} from "@mui/material/styles";

// Create a theme instance.
export let theme = extendTheme({
  GoPaperless: {
    headerHeight: "55px",
    footerBarHeight: "55px",
    footerBarHeightXs: "100px",
    appBarHeight: "62px",
    appBarConfigHeight: "72px",
    containerMaxWidth: "1920px",
  },
  typography: {
    fontFamily: "Montserrat,Nucleo,Helvetica,sans-serif",
    h6: {
      fontSize: 14,
      color: "#1F2937", // Adjust the font size as needed
      fontWeight: 500,
      lineHeight: "17px",
    },
    h5: {
      fontSize: 13, // Adjust the font size as needed
      lineHeight: "17px",
    },
    h4: {
      fontSize: 12, // Adjust the font size as needed
    },
    h3: {
      fontSize: 16, // Adjust the font size as needed
      color: "#1F2937",
      fontWeight: 600,
    },
    h2: {
      fontSize: 10, // Adjust the font size as needed
      color: "#767676",
      fontWeight: 500,
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#3B82F6",
        },
        secondary: {
          main: "#C0C0C0",
        },
        success: {
          main: "#55CF31",
        },
        // grey 200
        signingBackground: {
          main: "#F3F5F8",
        },
        tabBackground: {
          light: "#E8EBF0",
          main: "#E8EBF0",
        },
        //white
        signingWFBackground: {
          main: "#FFF",
        },
        //lightBlue 50
        dialogBackground: {
          main: "#F3FBFF",
        },
        accordingBackGround: {
          main: "#F3F5F8",
        },
        signerBackGround: {
          main: "#DBEAFE",
        },
        // grey 300
        borderColor: {
          light: "#DFDBD6",
          main: "#E5E7EB",
        },
        // grey 300
        borderColorBlue: {
          light: "#3B82F6",
          main: "#3B82F6",
        },
        // gray
        signingtext1: {
          light: "#1F2937",
          main: "#1F2937",
        },

        //lighter
        signingtext2: {
          light: "#767676 ",
          main: "#767676 ",
        },
        signingtextBlue: {
          light: "#3B82F6",
          main: "#3B82F6",
        },
        error: {
          main: red.A400,
        },
        textBlack: {
          main: "#1F2937",
        },
        textBlur: {
          main: "#767676",
        },
        textBold: {
          main: "#475569",
        },
        textSuccess: {
          main: "#55CF31",
        },
      },
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange,
      },
    },
  },
  // palette: {
  //   mode: "light",
  //   primary: {
  //     main: "#26293F",
  //   },
  //   secondary: {
  //     light: "#EDF7FA",
  //     main: "#00A8CC",
  //   },
  //   // grey
  //   signingBackground: {
  //     light: "#E8EBF0",
  //     main: "#E8EBF0",
  //   },
  //   //white
  //   signingSubBackground: {
  //     light: "#FFF",
  //     main: "#FFF",
  //   },
  //   dialogBackground: {
  //     light: "#F3FBFF",
  //     main: "#F3FBFF",
  //   },
  //   // light grey
  //   borderColor: {
  //     light: "#DFDBD6",
  //     main: "#DFDBD6",
  //   },
  //   // gray
  //   signingtext1: {
  //     light: "#1C1C1C",
  //     main: "#1C1C1C",
  //   },
  //   //lighter
  //   signingtext2: {
  //     light: "#6B7280",
  //     main: "#6B7280",
  //   },
  //   signingtextBlue: {
  //     light: "#3B82F6",
  //     main: "#3B82F6",
  //   },
  //   error: {
  //     main: red.A400,
  //   },
  //   text: {
  //     primary: "#21243D",
  //   },
  // },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: "md",
      },
      styleOverrides: {
        maxWidthSm: {
          maxWidth: "680px",

          "@media (min-width: 600px)": {
            maxWidth: "680px",
          },
        },
        maxWidthMd: {
          maxWidth: "1488px",

          "@media (min-width: 900px)": {
            maxWidth: "1488px",
          },
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "none",
      },
      styleOverrides: {
        root: {
          color: "black",

          "&:hover, &.active": {
            color: "#FF6464",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: "45px",
          fontSize: "14px",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          height: "45px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // background: '#df0f0f', // set cho tất cả MuiButton
          color: "#1F2937",
          textTransform: "capitalize",
          "&.Mui-disabled": {
            // Correct selector for the disabled state
            color: "#fff", // Add the # symbol before the color value
          },
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            color: "white",
          },
        },
      ],
    },
    MuiChip: {
      styleOverrides: {
        root: {
          paddingInline: 2, // set cho tất cả MuiChip
        },
      },
      variants: [
        {
          props: { color: "secondary" },
          style: {
            color: "white",
            backgroundColor: "#142850", // chỉ set cho MuiChip có prop secondary
            fontSize: 16,
            fontWeight: "bold",
          },
        },
      ],
    },
    MuiToolbar: {
      styleOverrides: {
        dense: {
          height: 48,
          minHeight: 48,
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

// theme.typography.h3 = {
// 	fontSize: '2rem',

// 	[theme.breakpoints.up('md')]: {
// 		fontSize: '3rem',
// 	},
// }
