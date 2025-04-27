import Fastify from "fastify";
import cors from "@fastify/cors"
import dotenv from "dotenv"

dotenv.config();
let Coupons = {
    "THBPurchase999":50,
    "PERPurchase888":90
}

let onTop = {
    "Category" :{
        "Clothing": 10,
        "Electronic":0,
        "Accessory":0
    }
}

let seasonal = {
    "Discount": 40,
    "In_Every":300
}

let NameTag_Category = {
      "Clothing": {
          "T-shirt":null,
          "Hat":null,
          "Hoodie":null
       },
      "Electronic": {
        "Watch":null
      },
      "Accessories":{
        "Bag":null,
        "Belt":null
      }
    }

const fastify = Fastify();
// Allow CORS
await fastify.register(cors, {
    origin: '*', 
    methods: ['GET', 'POST', 'OPTIONS'],
  });



// Sample GET
fastify.get('/api/hello', async (req, reply) => {
    
    return { message: 'GET received!' };
    
  });
  
fastify.post("/api/UpdateDiscount", async (req, reply) => {
    let couponstatus = [], onTopstatus = [] , seasonaltatus = [] ; 
    let {Coupon , onTops , Seasonal } = req.body;
    // MARK: Manage Coupon Code
    if (Coupon !== undefined ) {
      for (let Keys_Ja of Object.keys(Coupon)){
        if (Keys_Ja.length === 14 ){
          if (Keys_Ja.startsWith("THB") || Keys_Ja.startsWith("PER")){
            Coupons[Keys_Ja] = Coupon[Keys_Ja];
            couponstatus.push("coupon updated !")
          }else{
            couponstatus.push("Invalid coupon code !")
          }
        }else{
          couponstatus.push("Invalid coupon code !")
        }
      }
      console.log("Updated Coupons:", Coupons);
      
    }
    // MARK: Manage onTop Discount
    if (onTops !== undefined){
      
      for (let KeysCategory of Object.keys(onTops.Category)){
        console.log(onTops.Category[KeysCategory]);
        
        switch (KeysCategory){
          case "Clothing" :
            
            if(typeof onTops.Category[KeysCategory] === "number" &&  onTops.Category[KeysCategory] <= 100){
              onTop.Category.Clothing = onTops.Category[KeysCategory]
              onTopstatus.push("Clothing discount updated !")
            }else{
              onTopstatus.push("inValid Clothing Discount")
            }break;
          case "Electronic":
            if(typeof onTops.Category[KeysCategory] === "number" &&  onTops.Category[KeysCategory] <= 100){
              onTop.Category.Electronic = onTops.Category[KeysCategory]
              onTopstatus.push("Electronic discount updated !")
            }else{
              onTopstatus.push("inValid Electronic Discount")
            }break;
          case "Accessory":
            if(typeof onTops.Category[KeysCategory] === "number" &&  onTops.Category[KeysCategory] <= 100){
              onTop.Category.Accessory = onTops.Category[KeysCategory]
              onTopstatus.push("Accessory discount updated !")
            }else{
              onTopstatus.push("inValid Accessory Discount")
            }break;
          default:
            onTopstatus.push("Not have these category! 👀");
            break;
        }
        
      }
      
      console.log(onTopstatus);
    
    }
    // MARK: Manage Seasonal Discount
    if (Seasonal !== undefined){
      for (let KeysSeasonals of Object.keys(Seasonal)){
        switch (KeysSeasonals){
          case "Discount":
            if (typeof Seasonal[KeysSeasonals] === "number" &&  Seasonal[KeysSeasonals] >= 0 ){
              seasonal.Discount = Seasonal[KeysSeasonals] ;
              seasonaltatus.push("Discount Per X THB is Updated!")
            }else{
              seasonaltatus.push("invalid Format process Discount will not update!")
            }break;
          
          case "In_Every":
            if (typeof Seasonal[KeysSeasonals] === "number" &&  Seasonal[KeysSeasonals] >= 0 ){
              seasonal.In_Every = Seasonal[KeysSeasonals] ;
              seasonaltatus.push("In Every X Bath per discount time is updated !")
            }else{
              seasonaltatus.push("invalid Format process In_Every will not update!")
            }break;
            
        }
      }
    }
    reply.send({
      "coupon":couponstatus,
      "ontop":onTopstatus,
      "sesonal":seasonaltatus
    })
  });
/*
{
  "Product": {
    "T-shirt": 350,
    "Hat": 200
  },
  "Amount": {
    "T-shirt": 2,
    "Hat": 1
  },
  "Coupon": {
    "couponCode": "DISCOUNT10"
  },
  "MemberPoint":
    "point":9999
}
*/
fastify.post("/api/Calculation", async (req, reply) => {
    let step1;
    let TotalPrices = 0.0;
    let RawtotalPrices = 0.0 ; 
    let { Product, Amount, Coupon , MemberPoint} = req.body;
    
    for (let NameProduct of Object.keys(Amount)) {
      if (!(NameProduct in Product)) {
        return reply.status(400).send({ error: `Product "${NameProduct}" not found in Product list` });
      }
      TotalPrices += Product[NameProduct] * Amount[NameProduct];
    }
    RawtotalPrices = TotalPrices ; 
    // MARK: First
    //First Piority is Coupon

    if (Object.keys(Coupons).includes(Coupon?.couponCode)) {
        if(Coupon.couponCode.startsWith("THB")) {          // Prices Discount
            let discount = Coupons[Coupon.couponCode];
            TotalPrices = TotalPrices - discount;
            if (TotalPrices <=0){
              TotalPrices = 0.0 ;
            }
          step1 = `Use Coupon discount ${discount} THB`

        }else if(Coupon.couponCode.startsWith("PER")) {    // Percentage Discount
            let discount = Coupons[Coupon.couponCode];
            if (discount > 100){discount = 100 ;}
            TotalPrices = TotalPrices - (TotalPrices * (discount/100)) ; 
            step1 = `Use Coupon discount ${discount} %`
        }else{
          step1 = "coupon wrong will not used"
        }
    }
    // MARK: Second
    //Second Piority is On Top [Category , Membership Point ]
    //-------Discount Category
    console.log(TotalPrices);
    for (let NameProduct of Object.keys(Amount)) {
      let foundCategory = null ;
      for (let category in NameTag_Category) {
        if (NameProduct in NameTag_Category[category]) {
            foundCategory = category;
            break; // เจอแล้วไม่ต้องเช็กต่อ
        }
      }
      
      let discountCategory = onTop.Category[foundCategory] || 0; 
      let discountAmount = (Product[NameProduct] * Amount[NameProduct]) * (discountCategory / 100);
      
      TotalPrices -= discountAmount;
      if (TotalPrices < 0 ){
        TotalPrices = 0;
      }
      //console.log(foundCategory);
      //console.log(TotalPrices);
    }
    //-------Discount Member Point
    let memberPointValue = MemberPoint?.point || 0;
    let DiscountMemberPoint_limit = 0.20 * TotalPrices ; // Limit discount by using these filter 
    if (memberPointValue  > DiscountMemberPoint_limit){
      TotalPrices -= DiscountMemberPoint_limit ; 
    }else if(memberPointValue  < DiscountMemberPoint_limit){
      TotalPrices -= memberPointValue  ; 
    }else if(TotalPrices < 0 ){
      TotalPrices = 0.0;
    }
    //console.log(TotalPrices);
    // MARK: Final Calcualtion
    // Finally Piority is Seasonal
    let AmountTimeSeasonalDiscount = Math.floor(TotalPrices / seasonal.In_Every) || 0 //มีจุดทศนิยมปัดลง float to int
    TotalPrices -= seasonal.Discount * AmountTimeSeasonalDiscount ; 
    if (TotalPrices < 0) {
      TotalPrices = 0;
    }
    reply.send({ 
      "Raw_Prices":RawtotalPrices,
      "total": TotalPrices ,
      "Coupon":step1
    });
})
  // Start server
fastify.listen({ port: `${process.env.PORT_SERVER || 11111}` }, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`Server running at ${address}`);
});