const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {StatusCodes} = require("http-status-codes")

const Cat = {
    "Pozywienie":"Pozywienie",
    "Art. budowlany": "art_budowlany",
    "Art. chemiczny":  "art_gosp_dom",
    "ALkohol": "Alkohol",
    "Art. papierniczy": "art_papier",
  }
  
const addElement = async (req,res)=>{
    const data = req.body
    const category = req.query.cat
    console.log("add Element: ",category,data)
    console.log(req.user)

    switch(category){
        case "Spozywcze":
            try{
                console.log("PRZEd",req.user.userId,data.shop.date,data.shop.name,data.sumPrice)
                const shop = await prisma.shopping.create({
                    data:{
                        userId:req.user.userId,
                        date: data.shop.date,
                        shop_name: data.shop.name,
                        price_sum:data.sumPrice,
                    }
                })
                if(shop){
                    
                    data.actualData.map(async(product)=>{
                        console.log("x",Cat[product.category], product.name,Number(product.amount),Number(product.price))
                        await prisma.product.create({
                            data:{
                                shopId: shop.id,
                                name: product.name,
                                amount: Number(product.amount),
                                price: Number(product.price),
                                category:Cat[product.category]
                            }
                        })
                    })
                    return res.status(StatusCodes.OK).json("Successfully added products")
                }
                else{
                    res.status(StatusCodes.BAD_REQUEST).json({"msg":"Something went wrong"})
                }
            }catch(e){
                res.status(StatusCodes.BAD_REQUEST).json({"msg":e})
            }
            break

        // case "Rozrywka":
        //     await prisma.entertainment.create({
        //         data:{
        //             name,
        //             date,
        //             price,
        //             amount,
        //             userId:req.user.userId,
        //         }
        //     })
        //     break
        // case "Transport":
        //     await prisma.transport.create({
        //         data:{
        //             name,
        //             date,
        //             price,
        //             amount,
        //             userId:req.user.userId,
        //         }
        //     })
        //     break
        // case "Pozostałe":
        //     await prisma.other.create({
        //         data:{
        //             name,
        //             date,
        //             price,
        //             amount,
        //             userId:req.user.userId
        //         }
        //     })
        //     break
    }
    // const prisma.
}



module.exports ={
    addElement
}