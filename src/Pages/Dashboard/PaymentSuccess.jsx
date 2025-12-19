import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const [paymentInfo,setPaymentInfo]= useState({})
    const axiosSecure = useAxiosSecure()
    console.log(sessionId)
    useEffect(()=>{
        if(sessionId){
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
            .then(res=>{
                // console.log(res.data)
                setPaymentInfo({
                    trackingId : res.data.trackingId,
                    transactionId : res.data.transactionId
                })
            })

        }
    },[sessionId,axiosSecure])
  return (
    <div>
      <h2>Payment Successful</h2>
      <p>Your trackingId:{paymentInfo.trackingId}</p>
      <p>Your transactionId:{paymentInfo.transactionId}</p>
    </div>
  );
};

export default PaymentSuccess;
