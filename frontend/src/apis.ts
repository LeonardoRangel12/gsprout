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
        return res.data.buy;
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
  async function getJuegos(page = 1) {
      try {
        const res = await axios.get("/juegos", { params: { page } });
        return res.data;
      } catch (error) {
        console.error(error);
      }
    }

  async function getJuego(id) {
    try {
      const res = await axios.get(`/juegos/${id}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  }

    export { getExchange, getWishList, getJuegos, getUsuario, getJuego };

