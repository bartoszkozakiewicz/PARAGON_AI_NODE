const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { StatusCodes } = require("http-status-codes");

const Cat = {
  pozywienie: "Pozywienie",
  "artykuł budowlany": "art_budowlany",
  "artykuł gospodarstwa domowego": "art_gosp_dom",
  alkohol: "Alkohol",
  "artykuł papierniczy": "art_papier",
};

const getParagonData = async (req, res) => {
  const user = req.user;
  console.log("Getting data from paragon, asking fastAPI");
  console.log("Otrzymałem: ", req.body.paragonBuffer);

  const formData = new FormData();
  formData.append(
    "image",
    new Blob([new Uint8Array(req.body.paragonBuffer.data)], {
      type: "image/jpeg",
    })
  );

  const paragonProducts = await axios.post(
    "http://127.0.0.1:5000/getParagon",
    formData
  );
  console.log("Otrzymałem: ", paragonProducts.data);

  let productDetailsList = paragonProducts.data.products.map(
    (product, index) => {
      let priceString = paragonProducts.data.prices[index];

      let numbers = priceString.split(", ");
      console.log("priceString: ", priceString);
      let ilosc = parseFloat(numbers[0].split(":")[1].replace(",", "."));
      console.log("price: ", ilosc);
      console.log("price przed", numbers[1].split(":")[1].replace(",", "."));
      let price = parseFloat(numbers[1].split(":")[1].replace(",", "."));
      console.log("ilosc: ", price);

      let category = paragonProducts.data.categories[index];
      console.log("category: ", category);
      return {
        product_name: product,
        price: price,
        ilosc: ilosc,
        category: category,
      };
    }
  );
  console.log("productDetailsList: ", productDetailsList);

  try {
    const shop = await prisma.shopping.create({
      data: {
        userId: user.userId,
        date: paragonProducts.data.date,
        shop_name: paragonProducts.data.shop_name.split(" ")[0].toLowerCase(),
        price_sum: paragonProducts.data.sum,
      },
    });

    if (shop) {
      console.log("Tworzenie nowych produktów");
      productDetailsList.map(async (product) => {
        await prisma.product.create({
          data: {
            shopId: shop.id,
            name: product.product_name,
            amount: product.ilosc,
            price: product.price,
            category: Cat[product.category.toLowerCase()],
          },
        });
      });
    }
    console.log("Zakończono tworzenie produktów");
    // await prisma.image.create({
    //     data:{
    //         image:
    //     }
    // })
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getParagonData };
