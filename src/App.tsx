import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useForm } from "react-hook-form";
function App() {

  const [deliveryCharge, setDeliveryCharge] = useState(0);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();


  const onSubmit = (data: any) => {
    const { cartValue, distance, amount, date } = data;
    let fee = 0
    if (cartValue >= 100 || cartValue <= 0) {
      setDeliveryCharge(0)
      return
    }


    const surCharge: number = calculateCartSurCharge(Number(cartValue))
    const distanceFee: number = calculateDistanceFee(Number(distance))
    const amountSurCharge: number = calculateAmountSurCharge(
      Number(amount)
    )
    const finalPrice: number = calculateRushHourCharge(
      new Date(date),
      distanceFee + surCharge + amountSurCharge
    )

    if (finalPrice > 15) {
      setDeliveryCharge(15)
      return
    } else {
      setDeliveryCharge(finalPrice)
      return
    }


  }

  const calculateDistanceFee = (deliveryDistance: number): number => {
    return deliveryDistance > 1000
      ? Math.ceil(deliveryDistance / 500)
      : deliveryDistance > 0
        ? 2
        : 0
  }
  const calculateCartSurCharge = (cartValue: number): number => {
    let surcharge: number = 0
    if (cartValue > 0 && cartValue < 10) {
      surcharge = 10 - cartValue
    }
    return Number(parseFloat(surcharge.toString()).toPrecision(2)) // precision upto 2 decimat points
  }

  const calculateAmountSurCharge = (amount: number): number => {
    return amount < 5 ? 0 : (amount - 4) * 0.5
  }


  const calculateRushHourCharge = (time: Date, totalFee: number): number => {
    let finalDeliveryFee = totalFee
    const utcTime = new Date(time)

    if (utcTime.getUTCDay() === 5) {
      // so total minutes in a 24 hr day are 1440 mins.
      // the rush hours are 3pm to 7pm on friday so we need to check if user
      // selected time is in between those hours

      const rushHourStartingMinutes: number = 15 * 60 + 0 // starting time is 3 pm = 900 min
      const rushHoursEndingMinutes: number = 19 * 60 + 0 // ending time is 7 pm = 1140 min

      const selectedTime = utcTime.getHours() * 60 + utcTime.getMinutes() // get minutes for selected time

      if (
        rushHourStartingMinutes <= selectedTime &&
        selectedTime <= rushHoursEndingMinutes
      ) {
        finalDeliveryFee = 1.1 * finalDeliveryFee
      }
    }

    return finalDeliveryFee
  }



  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-200">
      <div className='w-[450px]  bg-blue-400 p-5 rounded'>
        <h3 className='text-center text-2xl font-bold underline'>Delivery Fee Calculator</h3>

        <form className='mt-10' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex gap-3 items-center mb-3'>
            <label className="text-xl font-semibold w-[120px]"
              htmlFor="cartValue">Cart Value</label>
            <input
              {...register("cartValue")}
              className='px-2 py-1 rounded  w-full'
              type="text"
              placeholder='€'
              id='cartValue'
            />
          </div>
          <div className='flex gap-3 items-center mb-3'>
            <label
              className="text-xl font-semibold w-[120px]"
              htmlFor="distance"
            >
              Delivery  Distance
            </label>
            <input
              {...register("distance")}
              className='px-2 py-1 rounded  w-full'
              type="number"
              placeholder='m'
              id='distance'
            />
          </div>
          <div className='flex gap-3 items-center mb-3'>
            <label className="text-xl font-semibold w-[120px]" htmlFor="amount">Amount of Items</label>
            <input
              {...register("amount")}
              className='px-2 py-1 rounded  w-full'
              type="number"
              placeholder='0'
              id='amount'
            />
          </div>
          <div className='flex gap-3 items-center mb-5'>
            <label className="text-xl font-semibold w-[120px]" htmlFor="date">Date</label>
            <input
              {...register("date")}
              className='px-2 py-1 rounded  w-full focus:border-0'
              type="datetime-local"
              placeholder=''
              id='date'
            />
          </div>
          <button
            type='submit'
            className='px-4 py-2 bg-pink-500 text-white font-bold
           rounded border-0 outline-none text-sm w-full
           '>Calculate delivery price</button>
        </form>
        <div className='bg-black mt-3 px-4 p-2 rounded text-center'>
          <h4 className='text-white font-semibold text-sm'>Delivery price: {deliveryCharge} €</h4>
        </div>
      </div>
    </div>
  );
}

export default App;
