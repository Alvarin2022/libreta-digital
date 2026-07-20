import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        <Typography variant="h3">
          🏪
        </Typography>

        <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
          Almacén Lo de Inés
        </Typography>

        <Typography
          variant="body1"
          sx={{ mt: 2, mb: 4 }}
        >
          Bienvenido
        </Typography>


        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Button
              fullWidth
              variant="contained"
              startIcon={<ShoppingCartIcon />}
            >
              Venta al contado
            </Button>
          </CardContent>
        </Card>


        <Card>
          <CardContent>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<MenuBookIcon />}
            >
              Clientes mensuales
            </Button>
          </CardContent>
        </Card>

      </Box>
    </Box>
  );
}