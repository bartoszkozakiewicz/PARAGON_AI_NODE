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
    const shopId = req.query.shopId
    console.log("add Element: ",category,data)
    console.log(req.user)

    switch(category){
        case "Spozywcze":
            try{
                console.log("KKURWA")
 
                if (shopId){
                    console.log("SHOP ID: ",Number(shopId))
                    const shopExist = await prisma.shopping.findUnique({
                        where: {
                            id:Number(shopId)
                        }
                    })
                    console.log("Shop exist: ",shopExist)

                    const shoppingProducts = await prisma.product.findMany({
                        where: {
                            shopId:Number(shopId)
                        }
                    })
                    console.log("DANEEEE", data.actualData, "ORAZ ",shoppingProducts)
                    data.actualData.map(async(product)=>{
                        const idExists = shoppingProducts.some((shopProduct) => shopProduct.id === product.id);
                        if (idExists){
                            await prisma.product.update({
                                where:{
                                    id:product.id
                                },data:{
                                    name:product.name,
                                    amount:Number(product.amount),
                                    category:product.category,
                                    price:Number(product.price)
                                }
                            })
                        }
                        else{
                            await prisma.product.create({
                                data:{
                                    shopId: Number(shopId),
                                    name:product.name,
                                    amount:Number(product.amount),
                                    category:product.category,
                                    price:Number(product.price)                                    
                                }
                            })
                        }
                    })
                    return res.status(200).json("Succesfully edited data!")
                }
                else{

                    const shop = await prisma.shopping.create({
                        data:{
                            userId:req.user.userId,
                            date: data.shop.date,
                            shop_name: data.shop.name,
                            price_sum:data.sumPrice,
                        }
                    })
                    if(shop){
                        console.log("Tworzenie nowego: ",shop, data)
                        data.actualData.map(async(product)=>{
                            await prisma.product.create({
                                data:{
                                    shopId: shop.id,
                                    name: product.name,
                                    amount: Number(product.amount),
                                    price: Number(product.price),
                                    category:product.category
                                }
                            })
                        })
                        return res.status(StatusCodes.OK).json("Successfully added products")
                    }
                    else{
                        res.status(StatusCodes.BAD_REQUEST).json({"msg":"Something went wrong"})
                    }
                }
                }catch(e){
                    res.status(StatusCodes.BAD_REQUEST).json({"msg":e})
                }
            break

        case "Rozrywka":
            try{
                console.log("Add rozrywka")
                data.actualData.map(async(product)=>{
                    await prisma.entertainment.create({
                        data:{
                            name:product.name,
                            date:data.shop.date,
                            price:Number(product.price),
                            amount:Number(product.amount),
                            userId:req.user.userId,
                        }
                    })
                })
                return res.status(StatusCodes.OK).json("Successfully added entertainment")
            }catch(e){
                res.status(StatusCodes.BAD_REQUEST).json({"msg":e})
            }
            break

        case "Transport":
            try{

                data.actualData.map(async(product)=>{
                    
                    await prisma.transport.create({
                        data:{
                            name:product.name,
                            date:data.shop.date,
                            price:Number(product.price),
                            amount:Number(product.amount),
                            userId:req.user.userId,
                      
                        }
                    })
                })
                return res.status(StatusCodes.OK).json("Successfully added transport")
            }catch(e){
                res.status(StatusCodes.BAD_REQUEST).json({"msg":e})
            }
            break

        case "Pozostałe":
            try{

                data.actualData.map(async(product)=>{
                    
                    await prisma.other.create({
                        data:{
                            name:product.name,
                            date:data.shop.date,
                            price:Number(product.price),
                            amount:Number(product.amount),
                            userId:req.user.userId
                        }
                    })
                })
                return res.status(StatusCodes.OK).json("Successfully added other")
            }catch(e){
                res.status(StatusCodes.BAD_REQUEST).json({"msg":e})
            }
            break
    }
}

const getAllData = async(req,res) =>{
    console.log("geting all data")
    const user = req.user
    console.log("0",user)
    try{
        const shoppingData = await prisma.shopping.findMany({
            where:{
                userId: user.userId
            }
        })
        console.log("1",shoppingData)
        const enterData = await prisma.entertainment.findMany({
            where:{
                userId: user.userId
            }
        })
        console.log("2",enterData)

        const transportData = await prisma.transport.findMany({
            where:{
                userId: user.userId
            }
        })
        console.log("3",transportData)

        const otherData = await prisma.other.findMany({
            where:{
                userId: user.userId
            }
        })
        console.log("4",otherData)

        res.status(StatusCodes.OK).json({shoppingData,enterData,transportData,otherData})

    }catch(e){
        res.status(StatusCodes.BAD_REQUEST).json({"msg":e})
    }
}

const deleteElements = async (req,res) =>{
    const user = req.user
    const data = req.body
    console.log("Usuwam elementy",data)
    try{

        data.forEach(async(element) => {
            switch (element.category){
                case "Shopping":
                    console.log("Usuwam shopping")
                    await prisma.shopping.delete({
                        where:{
                            id:element.realId
                        }
                    })
                    break
                case "Entertainment":
                    console.log("Usuwam entertainment")
                    await prisma.entertainment.delete({
                        where:{
                            id:element.realId
                        }
                    })
                    break
                case "Transport":
                    await prisma.transport.delete({
                        where:{
                            id:element.realId
                        }
                    })
                    break
                case "Other":
                    await prisma.other.delete({
                        where:{
                            id:element.realId
                        }
                    })
                    break
                }
                });
        res.status(StatusCodes.OK).json({mdg:"Successfully deleted elements"})

    }catch(e){
        res.status(StatusCodes.BAD_REQUEST).json({msg:e})
    }
}

const getParagon = async (req,res) =>{
    const shopId = req.query.shopId
    console.log("Get paragon",shopId)

    try{
        const paragon = await prisma.product.findMany({
            where:{
                shopId: Number(shopId)
            }
        })
        console.log("Zebrane",paragon)
        res.status(StatusCodes.OK).json(paragon)
    }catch(e){
        res.status(StatusCodes.BAD_REQUEST).json({"msg":e})
    }
}



const getNeededData = async(req,res) =>{
    let date1 = req.query.date1
    let date2 = req.query.date2
    let products =[]
    let minDate = ""
    if (date1 == "x"){
        date1 = "2023-01-01"
    }
    if (date2 == "x"){
        date2 = "2023-11-15"
    }

    try{
        const shopping = await prisma.shopping.findMany({where:{
            date:{
                gte: date1,
                lte:date2
            }
        }})   
        shopping.forEach(async(shop)=>{
            console.log("SHOP ID: ",shop.id)
            products.unshift(await prisma.product.findMany({where:{
                shopId: shop.id
            }}))
            console.log("KURWAA",products)
            products[0] = products[0] && products[0].map(prod =>({
                ...prod,
                date:shop.date,
            }))
        })



        const other = await prisma.other.findMany({where:{
            date:{
                gte: date1,
                lte:date2
            }
        }})
        const entertainment = await prisma.entertainment.findMany({where:{
            date:{
                gte: date1,
                lte:date2
            }
        }})
        const transport = await prisma.transport.findMany({where:{
            date:{
                gte: date1,
                lte:date2
            }
        }})
        

        let endData = []
        const dateMap = [];
        const sumTransportPrice = aggregateData(transport,"transport",endData,dateMap)
        const sumEnertainmentPrice = aggregateData(entertainment,"entertainment",endData,dateMap)
        const sumOtherPrice = aggregateData(other,"other",endData,dateMap)
        const sumShopPrice = aggregateData(shopping,"shopping",endData,dateMap)


        //Sort the array by date
        endData.sort((a, b) => a.date - b.date);



        products = products.flat()
        console.log("Produkty22: ",products)        //Sort etc products:

        // Sortowanie według daty
        products.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
        
            return dateA - dateB;
        });
        console.log("prods po sort",products)



        let currDate = products[0].date
        let i = 0
        endProducts = [{date:currDate,art_budowlany:0,Pozywienie:0,Alkohol:0,art_papier:0,art_gosp_dom:0}]

        products.forEach((product)=>{
            if (product.date == currDate) {
                console.log("HALO",endProducts[endProducts.length-1][product.category], product.price)
                ,endProducts[endProducts.length-1][product.category] += product.price
            } else {
                i++
                currDate = product.date
                endProducts.push({date:currDate,art_budowlany:0,Pozywienie:0,Alkohol:0,art_papier:0,art_gosp_dom:0})
                endProducts[endProducts.length-1][product.category] += product.price
            }
        })  

        //Sumowanie produktów
        const sumProductPrices = endProducts.reduce((acc,item)=>{
            Object.keys(item).forEach((key)=>{
                if (key !== "date"){
                    acc[key] = (acc[key] || 0) + item[key]
                }})
            return acc
        },{})


        res.status(200).json({endData,endProducts,sumProductPrices,sumTransportPrice,sumEnertainmentPrice,sumOtherPrice,sumShopPrice})

    }catch(e){
        res.status(400).json({"msg":e})
    }

}

function aggregateData(dataArray, category,endData,dateMap){
    let endPrice = 0
    dataArray.forEach((transp)=>{
        
        let date = transp.date;
        let price = category === "shopping" ? transp.price_sum : transp.price;
        endPrice+=price

        if (dateMap.includes(date)) {
            const ele = endData.find((ele)=>ele.date.getTime() === new Date(date).getTime())
            if (!isNaN(ele[category])) {
                ele[category] += price;
            } else {
                ele[category] = price ? price : 0
            }
            console.log(ele)
          } else {
  
            console.log("DATA",date, "nowa",new Date(date))
            const newEntry = { date: new Date(date), transport:0,entertainment:0,other:0,shopping:0 };
            newEntry[category] = price;
            console.log("new Entry ",newEntry)
            endData.push(newEntry)
            console.log("end Data first ",endData)

            dateMap.push(date)
          }
    })
    return endPrice
}

module.exports ={
    addElement,
    getAllData,
    deleteElements,
    getParagon,
    getNeededData
}