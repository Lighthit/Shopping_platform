import { useState } from 'react';
import Cards_Ja from './component/Card';
import './App.css'; // นำเข้าไฟล์ CSS
import Market from './component/Cart';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // นำเข้า axios สำหรับการโพสต์ข้อมูล
import { callBackJson } from './Purchase_pages/Purchase';
export default function App() {

  let navigate = useNavigate();
  const [get_T_shirt, setT_shirt] = useState(0);
  const [getHat, setHat] = useState(0);
  const [getHoodie, setHoodie] = useState(0);
  const [getWatch, setWatch] = useState(0);
  const [getBag, setBag] = useState(0);
  const [getBelt, setBelt] = useState(0);

  const callBacks = (NameTag, Prices) => {
    switch (NameTag) {
      case "T-shirt":
        setT_shirt(prev => prev + 1);
        break;
      case "Hat":
        setHat(prev => prev + 1);
        break;
      case "Hoodie":
        setHoodie(prev => prev + 1);
        break;
      case "Watch":
        setWatch(prev => prev + 1);
        break;
      case "Bag":
        setBag(prev => prev + 1);
        break;
      case "Belt":
        setBelt(prev => prev + 1);
        break;
      default:
        break;
    }
  };

  const products = [
    { NameTag: "T-shirt", Prices: 350, img: "https://t3.ftcdn.net/jpg/06/24/96/40/240_F_624964076_839fzV7cOnHuG4lQjkAI9HLiut815H1Q.jpg" },
    { NameTag: "Hat", Prices: 200, img: "https://as2.ftcdn.net/v2/jpg/04/48/68/99/1000_F_448689939_0BVfRXQJT8czG1TAGS8lxijERPyG0gLL.jpg" },
    { NameTag: "Hoodie", Prices: 700, img: "https://as1.ftcdn.net/v2/jpg/10/67/74/96/1000_F_1067749678_TNiMc3dVwXadAtTRaLHIz681kv4lZcAM.jpg" },
    { NameTag: "Watch", Prices: 850, img: "https://t3.ftcdn.net/jpg/02/58/42/78/240_F_258427883_cUMV0xH2wld7onSTR04RkmG3dMaHWBzy.jpg" },
    { NameTag: "Bag", Prices: 640, img: "https://t3.ftcdn.net/jpg/02/02/38/98/240_F_202389840_RtPcE03PuFbdiAfAViDPTYWKrJwPsaN9.jpg" },
    { NameTag: "Belt", Prices: 230, img: "https://t4.ftcdn.net/jpg/02/48/94/61/240_F_248946120_78xXl57puQvTP6gUCyP5mj4gp73DD01B.jpg" },
  ];

  const chunkSize = 3;
  const chunkedProducts = [];
  for (let i = 0; i < products.length; i += chunkSize) {
    chunkedProducts.push(products.slice(i, i + chunkSize));
  }

  // ฟังก์ชันสำหรับส่งข้อมูลไปยัง server
  const sendCartData = () => {
    // สร้าง object สำหรับ Product และ Amount
    
    let productJson = products.reduce((acc, { NameTag, Prices }) => {
      acc[NameTag] = Prices;
      return acc;
    }, {});

    let amountJson = {
      "T-shirt":get_T_shirt,
      "Hat":getHat,
      "Hoodie":getHoodie,
      "Watch":getWatch,
      "Bag":getBag,
      "Belt":getBelt
    }
    callBackJson(productJson , amountJson) ; 
    navigate("/Purchase");
    

  };

  return (
    <>
      <header>
        <div className="header-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Shopping center</h3>
          <button
            className="shipping-button"
            style={{ border: 'none', background: 'transparent' }}
            onClick={sendCartData} // เรียกใช้ฟังก์ชัน sendCartData เมื่อคลิก
          >
            <Market count={get_T_shirt + getHat + getHoodie + getWatch + getBag + getBelt} />
          </button>
        </div>
      </header>

      <div className="container">
        {chunkedProducts.map((group, index) => (
          <div key={index} className="productRow">
            {group.map((item, idx) => (
              <Cards_Ja
                key={idx}
                NameTag={item.NameTag}
                Prices={item.Prices}
                img={item.img}
                onAddToCart={callBacks}
                className="card"
              />
            ))}
          </div>
        ))}
      </div>
      
    </>
  );
}
//<p className="modal-description">Original Price: {raw_totalPrices}฿ Discount : {raw_totalPrices - totalPrices}฿<br/> Discounted Price:{totalPrices} ฿</p>