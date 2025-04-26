import Fastify from "fastify";
import cors from "@fastify/cors"
import { CopyAll, SendAndArchive } from "@mui/icons-material";


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
    let {Coupon , onTop , seasonal } = req.body;
    if (Coupon !== undefined ) {
      for (let Keys_Ja of Object.keys(Coupon)){
        if (Keys_Ja.length === 14){
          Coupons[Keys_Ja] = Coupon[Keys_Ja];
        }
      }
      console.log("Updated Coupons:", Coupons);
    
    }else if (onTop !== undefined){

    }else if (seasonal !== undefined){

    }
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
    let TotalPrices = 0.0;
    let RawtotalPrices = 0.0 ; 
    let { Product, Amount, Coupon , MemberPoint} = req.body;
    
    for (let NameProduct of Object.keys(Amount)) {
      TotalPrices += Product[NameProduct] * Amount[NameProduct];
    }
    RawtotalPrices = TotalPrices ; 
    //MARK: First
    //First Piority is Coupon

    if (Object.keys(Coupons).includes(Coupon?.couponCode)) {
        if(Coupon.couponCode.startsWith("THB")) {          // Prices Discount
            let discount = Coupons[Coupon.couponCode];
            TotalPrices = TotalPrices - discount;
            if (TotalPrices <=0){
              TotalPrices = 0.0 ;
            }
           
        }else if(Coupon.couponCode.startsWith("PER")) {    // Percentage Discount
            let discount = Coupons[Coupon.couponCode];
            TotalPrices = TotalPrices - (TotalPrices * (discount/100)) ; 
        }
    }
    //MARK: Second
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
    //MARK: Final Calcualtion
    // Finally Piority is Seasonal
    let AmountTimeSeasonalDiscount = Math.floor(TotalPrices / seasonal.In_Every) || 0 //มีจุดทศนิยมปัดลง float to int
    TotalPrices -= seasonal.Discount * AmountTimeSeasonalDiscount ; 
    if (TotalPrices < 0) {
      TotalPrices = 0;
    }
    reply.send({ 
      "Raw_Prices":RawtotalPrices,
      "total": TotalPrices 
    });
})
  // Start server
fastify.listen({ port: 55543 }, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`Server running at ${address}`);
});