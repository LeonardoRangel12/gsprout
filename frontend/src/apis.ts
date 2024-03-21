import axios from "./main";

// Obtiene el usuario logueado
async function getUsuario() {
  try {
    const res = await axios.get("/usuarios/me");
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
// Obtiene el tipo de cambio entre SOL y USD
async function getExchange() {
    try{
        const res = await axios.get("/exchange");
        return res.data.sell;
      } catch (error) {
        console.error(error);
      }
    };
    // Obtiene un array con los juegos que el usuario tiene en su wishlist
  async function getWishList() {
      try {
        const res = await axios.get("/usuarios/wishlist");
        if(res.status == 404)
          return [];
        
        if(res.status == 200)
          return res.data;
        
      } catch (error) {
        console.error(error);
      }
    };
    // Obtiene un array con todos los juegos
  async function getJuegos() {
      try {
        const res = await axios.get("/juegos");
        return res.data;
      } catch (error) {
        console.error(error);
      }
    }

    export { getExchange, getWishList, getJuegos, getUsuario };

