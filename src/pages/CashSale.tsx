import { useRef, useState } from "react";
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

  const productRef = useRef<HTMLInputElement>(null);


  const addItem = () => {

    const productName = product.trim();
    const productPrice = Number(price);


    if (productName === "") {
      productRef.current?.focus();
      return;
    }


    if (isNaN(productPrice) || productPrice <= 0) {
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


  const total = items.reduce(
    (sum,item)=> sum + item.price,
    0
  );



  return (

    <Box
      sx={{
        padding:3,
      }}
    >


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



        {/* FORMULARIO */}


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
              onChange={(e)=>setProduct(e.target.value)}
              sx={{
                mb:2
              }}
            />



            <TextField
              fullWidth
              label="Precio ($)"
              type="number"
              value={price}
              onChange={(e)=>setPrice(e.target.value)}

              onKeyDown={(e)=>{

                if(e.key==="Enter"){
                  addItem();
                }

              }}

              sx={{
                mb:2
              }}

            />



            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={addItem}
            >
              Agregar producto
            </Button>



          </CardContent>

        </Card>




        {/* DETALLE */}


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
                            onClick={()=>
                              removeItem(item.id)
                            }
                          >
                            <DeleteIcon/>
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



          </CardContent>


        </Card>



      </Box>



    </Box>

  );

}