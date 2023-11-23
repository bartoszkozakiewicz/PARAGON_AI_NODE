const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {StatusCodes} = require("http-status-codes")

const getParagonData = async(req,res) =>{
    console.log("Getting data from paragon, asking fastAPI")
    console.log("Otrzymałem: ",req.body.paragonBuffer)

    const formData = new FormData();
    formData.append("image", new Blob([new Uint8Array(req.body.paragonBuffer.data)], { type: "image/jpeg" }));

    const paragonProducts = await axios.post("http://127.0.0.1:5000/getParagon",formData);
    console.log("Otrzymałem: ",paragonProducts)

    // await prisma.shopping.create({
    //     data:{

    //     }
    // })
    // await prisma.image.create({
    //     data:{
    //         image:
    //     }
    // })

}

module.exports = {getParagonData}