import { Box, Button } from "@mui/material";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100svh",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
        backgroundImage:
          "linear-gradient(rgba(225, 239, 250, 0.16), rgba(225, 239, 250, 0.16)), url('/catalogo/pantalla-inicio.png')",
        backgroundSize: "cover",
        backgroundPosition: { xs: "center center", sm: "center 48%", md: "center center" },
        backgroundRepeat: "no-repeat",
      }}
    >
      <Button
        variant="contained"
        size="large"
        startIcon={<ShoppingCartRoundedIcon />}
        endIcon={<ArrowForwardRoundedIcon />}
        onClick={() => navigate("/venta")}
        sx={{
          position: "absolute",
          left: "50%",
          top: {
            xs: "calc(50% - max(2.05vw, 3.08svh))",
            sm: "calc(48% - max(0.685vw, 1.03svh))",
            md: "calc(50% - max(2.05vw, 3.08svh))",
          },
          transform: "translateX(-50%)",
          width: "min(100vw, max(35vw, 52.44svh))",
          height: "max(7.95vw, 11.92svh)",
          minHeight: 0,
          boxSizing: "border-box",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3 },
          borderRadius: "max(2.05vw, 3.08svh)",
          color: "#fff",
          background: "linear-gradient(110deg, #2785c8 0%, #1265aa 100%)",
          boxShadow: "0 10px 24px rgba(18, 101, 170, 0.24)",
          fontSize: { xs: 15, sm: 17 },
          fontWeight: 700,
          textTransform: "none",
          "&:hover": { background: "linear-gradient(110deg, #2178b8 0%, #105a98 100%)" },
        }}
      >
        Ventas al Contado
      </Button>
    </Box>
  );
}
