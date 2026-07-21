import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { SaleItem } from "../models/SaleItem";


export default function CashSale() {

  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");

  const [items, setItems] = useState<SaleItem[]>([]);

const [completed, setCompleted] = useState(false);

const [productError, setProductError] = useState("");
const [priceError, setPriceError] = useState("");

const productRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();



  const addItem = () => {

  setProductError("");
  setPriceError("");

  const productName = product.trim();
  const productPrice = Number(price);

  if (productName === "") {

    setProductError("Debe ingresar un producto.");
    productRef.current?.focus();
    return;

  }

  if (price.trim() === "") {

    setPriceError("Debe ingresar un precio.");
    return;

  }

  if (isNaN(productPrice) || productPrice <= 0) {

    setPriceError("El precio debe ser mayor a $0.");
    return;

  }

  setItems((prevItems) => [
    ...prevItems,
    {
      id: Date.now(),
      product: productName,
      price: productPrice,
    },
  ]);

  setProduct("");
  setPrice("");

  setTimeout(() => {
    productRef.current?.focus();
  }, 0);

};



  const removeItem = (id:number) => {

    setItems((prevItems) =>
      prevItems.filter(
        (item)=> item.id !== id
      )
    );

  };



  const finishSale = () => {

    if(items.length === 0){
      return;
    }

    setCompleted(true);

  };



  const newSale = () => {

    setItems([]);

    setCompleted(false);

    setProduct("");
    setPrice("");

    setTimeout(() => {
      productRef.current?.focus();
    }, 0);

  };


const canAddProduct =
  product.trim() !== "" &&
  price.trim() !== "" &&
  Number(price) > 0;

  const total = items.reduce(
    (sum,item)=> sum + item.price,
    0
  );



  if(completed){

    return (

      <Box
        sx={{
          padding:3,
          textAlign:"center",
        }}
      >

        <Typography
          variant="h2"
          sx={{
            mb:3,
          }}
        >
          ✅
        </Typography>


        <Typography
          variant="h4"
          sx={{
            fontWeight:"bold",
            mb:3,
          }}
        >
          Venta realizada
        </Typography>


        <Typography
          variant="h5"
          sx={{
            mb:3,
          }}
        >
          Total: ${total}
        </Typography>


        <Typography
          variant="h6"
          sx={{
            mb:1,
          }}
        >
          Muchas gracias por su preferencia.
        </Typography>


        <Typography
          variant="h6"
        >
          ¡Los esperamos nuevamente!
        </Typography>


        <Typography
          variant="h6"
          sx={{
            mt:2,
            fontWeight:"bold",
          }}
        >
          🏪 Almacén Lo de Inés
        </Typography>



        <Button
          variant="contained"
          size="large"
          sx={{
            mt:4,
          }}
          onClick={newSale}
        >
          Nueva venta
        </Button>
        <Button
  variant="outlined"
  size="large"
  sx={{
    mt:4,
  }}
  onClick={() => navigate("/")}
>
  Volver al inicio
</Button>


      </Box>

    );

  }



  return (

    <Box
      sx={{
        padding:3,
      }}
    >
      <Button
  variant="text"
  onClick={() => navigate("/")}
  sx={{
    mb:2,
  }}
>
  ← Volver al inicio
</Button>


      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight:"bold",
          mb:4,
        }}
      >
        🛒 Venta al contado
      </Typography>



      <Box
        sx={{
          display:"grid",
          gridTemplateColumns:{
            xs:"1fr",
            md:"400px 1fr",
          },
          gap:3,
        }}
      >



        <Card>

          <CardContent>


            <Typography
              variant="h6"
              sx={{
                fontWeight:"bold",
                mb:2,
              }}
            >
              Nuevo producto
            </Typography>



            <TextField
  inputRef={productRef}
  fullWidth
  label="Producto"
  value={product}
  error={productError !== ""}
  helperText={productError}
  onChange={(e) => {

    setProduct(e.target.value);

    if (productError) {
      setProductError("");
    }

  }}
  sx={{
    mb:2,
  }}
/>



            <TextField
  fullWidth
  label="Precio ($)"
  type="number"
  value={price}
  error={priceError !== ""}
  helperText={priceError}
  onChange={(e) => {

    setPrice(e.target.value);

    if (priceError) {
      setPriceError("");
    }

  }}
  onKeyDown={(e) => {

    if (e.key === "Enter") {
      addItem();
    }

  }}
  sx={{
    mb:2,
  }}
/>



           <Button
  fullWidth
  variant="contained"
  size="large"
  disabled={!canAddProduct}
  onClick={addItem}
>
  Agregar producto
</Button>



          </CardContent>


        </Card>




        <Card>


          <CardContent>


            <Typography
              variant="h6"
              sx={{
                fontWeight:"bold",
                mb:2,
              }}
            >
              Detalle de compra
            </Typography>



            {
              items.length === 0 ?

              (

                <Typography
                  color="text.secondary"
                >
                  Todavía no agregaste productos.
                </Typography>

              )

              :

              (

                <Box>

                  {
                    items.map((item)=>(

                      <Box
                        key={item.id}
                        sx={{
                          display:"flex",
                          justifyContent:"space-between",
                          alignItems:"center",
                          py:1,
                        }}
                      >


                        <Typography>
                          {item.product}
                        </Typography>



                        <Box
                          sx={{
                            display:"flex",
                            alignItems:"center",
                            gap:1,
                          }}
                        >

                          <Typography>
                            ${item.price}
                          </Typography>



                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              removeItem(item.id)
                            }
                          >

                            <DeleteIcon />

                          </IconButton>


                        </Box>


                      </Box>

                    ))
                  }


                </Box>

              )

            }



            <Divider
              sx={{
                my:2,
              }}
            />



            <Typography
              variant="h5"
              sx={{
                fontWeight:"bold",
                textAlign:"right",
              }}
            >
              Total: ${total}
            </Typography>



            <Button
  fullWidth
  variant="contained"
  color="success"
  size="large"
  disabled={items.length === 0}
  sx={{
    mt:3,
  }}
  onClick={finishSale}
>
  Finalizar venta
</Button>



          </CardContent>


        </Card>



      </Box>



    </Box>

  );

}