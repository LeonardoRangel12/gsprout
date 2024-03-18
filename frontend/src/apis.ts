import axios from "./main";
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
        const res = await axios.get("/usuarios/me");
        return res.data.wishList;
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

    export { getExchange, getWishList, getJuegos };

