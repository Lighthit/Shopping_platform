import { useState } from 'react';
import axios from 'axios';
import { Modal as BaseModal } from '@mui/material'; // Ensure you're using the correct import from MUI v5
import './Purchase.css'; // ดึง CSS เข้ามา
import { useNavigate } from 'react-router-dom';

let DataSender = {
  "Product": {},
  "Amount": {}
};

export function callBackJson(PriceData, AmountData) {
  DataSender.Product = PriceData;
  DataSender.Amount = AmountData;
}

export default function Purchase() {
  let navigate = useNavigate();
  const [Coupons, setCoupons] = useState('');
  const [MemberPoints, setMemberPoint] = useState('');
  const [open, setOpen] = useState(false);
  const [totalPrices,settotalPrices] = useState(0);
  const [raw_totalPrices,setraw_tatalPrices] = useState(0);

  const static_Point_Member = 8888;

  const PostData = () => {
    console.log(DataSender);

    if (Coupons.length === 14) {
      DataSender.Coupon = { "couponCode": Coupons };
    }else{
      DataSender.Coupon = { "couponCode": "" };
    }

    DataSender.MemberPoint = { "point": Number(MemberPoints) };

    axios.post('/api/Calculation', DataSender)
      .then(response => {
        console.log('Data sent successfully:', response.data);
        settotalPrices(response.data.total);
        setraw_tatalPrices(response.data.Raw_Prices);
      })
      .catch(error => {
        console.error('Error sending data:', error);
        setOpen(false); // ปิด modal แม้ error
      });
  };

  const handlePointChange = (e) => {
    let onlyNums = e.target.value.replace(/[^0-9]/g, '');
    if (onlyNums === '') {
      setMemberPoint('');
    } else if (parseInt(onlyNums) <= static_Point_Member) {
      setMemberPoint(onlyNums);
    }
  };

  const handleCouponChange = (e) => {
    let input = e.target.value;
    if (input.length > 14) {
      input = input.slice(0, 14);
    } else {
      setCoupons('');
    }
    setCoupons(input);
  };

  const handleOpenModal = () =>{
    PostData()
    setOpen(true)
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  const confirm_button= () => {
    setOpen(false);
    navigate("/");
  };
  return (
    <>
      <header>
        <div>
          <h3>
            Purchase Pages<br /> Member Point: {static_Point_Member}
          </h3>
        </div>
      </header>

      <div>
        <label htmlFor="couponInput">Coupon Code:</label>
        <input 
          type="text" 
          id="couponInput" 
          name="coupon"
          value={Coupons}
          onChange={handleCouponChange}
        />
      </div>

      <br/>

      <div>
        <label htmlFor="pointInput">Member Point:</label>
        <input 
          type="text" 
          id="pointInput" 
          name="memberPoint"
          value={MemberPoints}
          onChange={handlePointChange}
        />
      </div>

      <br/>

      {/* ปุ่มกดเปิด Modal */}
      <button className="trigger-button" onClick={handleOpenModal}>
        Verify
      </button>

      {/* Modal ตอนยืนยัน */}
      <BaseModal
        open={open}
        onClose={()=>{handleCloseModal}}
        
      >
        <div className="modal-content">
          <h2 className="modal-title">Confirm Purchase</h2>
          <p className="modal-description">Make sure your items are correct {"(no Refund !🔥)"}</p>
          {Object.entries(DataSender.Amount).map(([key, value], index) => (
          <p key={index} className="modal-description">
            {key}: {value}
          </p>
          ))}
          
          <p className="modal-description">Original Price: {raw_totalPrices}฿ Discount : {raw_totalPrices - totalPrices}฿<br/> Discounted Price:{totalPrices} ฿</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button onClick={handleCloseModal} className="trigger-button">Cancel</button>
            <button onClick={confirm_button} className="trigger-button">Confirm</button>
          </div>
        </div>
      </BaseModal>
    </>
  );
}