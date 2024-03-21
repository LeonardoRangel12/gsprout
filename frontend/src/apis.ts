import axios from "./main";
async function getUsuario() {
  try {
    const res = await axios.get("/usuarios/me");
    return res.data;
  } catch (error) {
    console.error(error);
  }
}
async function getExchange() {
    try{
        const res = await axios.get("/exchange");
        return res.data.sell;
      } catch (error) {
        console.error(error);
      }
    };
  async function getWishList() {
      try {
        const res = await axios.get("/usuarios/wishlist");
        console.log(res.data);
        return res.data;
      } catch (error) {
        console.error(error);
      }
    };
  async function getJuegos() {
      try {
        const res = await axios.get("/juegos");
        return res.data;
      } catch (error) {
        console.error(error);
      }
    }

    export { getExchange, getWishList, getJuegos, getUsuario };

