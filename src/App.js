import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import instance from './config';

const App = () => {
  const [formdata, setFormData] = useState({ products: [], amountInfo: { subTotal: 0, discount: 0, gst: 0, grandTotal: 0 } })
  const [product, setProduct] = useState({})
  const [cities, setCities] = useState(null)
  const [billingData, setBillingData] = useState([]);

  const HandleInputChange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value })
  }

  const HandleProducts = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value })
  }

  const addTheProduct = (product) => {
    const productTotal = parseInt(product.quantitiy) * parseInt(product.price)
    const subTotal = formdata.amountInfo.subTotal + productTotal
    const discountAmount = (subTotal - formdata?.amountInfo?.discount)
    const grandTotal = discountAmount + ((subTotal * formdata?.amountInfo?.gst) / 100)
    setFormData({ ...formdata, products: [...formdata.products, product], amountInfo: { ...formdata.amountInfo, subTotal, grandTotal } })
    setProduct({})
  }
  const changeTheAmount = (e) => {
    const grandTotal = formdata.amountInfo.subTotal - formdata.amountInfo.discount + (formdata.amountInfo.subTotal * (formdata.amountInfo.gst / 100))
    const newFormData = {
      ...formdata,
      amountInfo: {
        ...formdata.amountInfo,
        [e.target.name]: e.target.value,
        grandTotal: grandTotal
      }
    };
    setFormData(newFormData);
  }



  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   // Validate
  //   if (name === 'customerName' && /[^a-zA-Z ]/.test(value)) {
  //     console.log('Invalid input. Only letters and spaces are allowed.');
  //     return;
  //   }

  //   if (name === 'contactNo' && !/^[0-9]{0,10}$/.test(value)) {
  //     // Display an error message or handle it as needed
  //     console.log('Invalid input. Please enter up to 10 digits.');
  //     return;
  //   }

  //   if (name === 'qty' || 'price') {
  //     const numericValue = parseInt(value, 10);

  //     // Check if the value is less than 1
  //     if (numericValue < 1) {
  //       // Display an error message or handle it as needed
  //       console.log('Invalid input. Quantity cannot be less than 1.');
  //       return;
  //     }
  //   }

  //   setCustomerInfo((prevInfo) => ({
  //     ...prevInfo,
  //     [name]: value,
  //   }));
  // };


  // const calculateSubTotal = () => {
  //   return billingData.reduce((total, item) => total + item.qty * item.price, 0);
  // };

  // const calculateDiscountAmount = () => {
  //   return (calculateSubTotal() * discount) / 100;
  // };

  // const calculateGSTAmount = () => {
  //   return ((calculateSubTotal() - calculateDiscountAmount()) * gst) / 100;
  // };

  // const calculateGrandTotal = () => {
  //   return calculateSubTotal() - calculateDiscountAmount() + calculateGSTAmount();
  // };

  // const handleAddButtonClick = () => {
  //   // Check if all required fields are filled
  //   if (
  //     customerInfo.productDiscription &&
  //     customerInfo.qty &&
  //     customerInfo.price
  //   ) {
  //     // Add the current customerInfo to billingData array
  //     setBillingData((prevData) => [...prevData, { ...customerInfo }]);

  //     // Clear the input fields
  //     setCustomerInfo({
  //       ...customerInfo,
  //       productDiscription: '',
  //       qty: '',
  //       price: ''
  //     });

  //     console.log('Billing Data:', billingData);
  //   } else {
  //     console.log('Please fill in all required fields.');
  //   }
  // };

  const handleRemoveButtonClick = (index) => {
    setBillingData((prevData) => prevData.filter((item, i) => i !== index));
  };

  const GetAllCities = async () => {
    try {
      const response = await instance.get("/api/city/getall")
      if (response.status === 200) {
        setCities(response.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }


  useLayoutEffect(() => {
    GetAllCities()
  }, [])



  // SUbmit the billing detials
  const SubmitBillingDetials = async (formdata) => {
    try {
      const response = await instance.post("/api/billing/create", formdata)
      if (response.status === 200) {
        console.log(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }




  return (
    <form action='/' onSubmit={SubmitBillingDetials}>
      {console.log(formdata)}
      <div className='border-black border h-fit px-5 py-10 m-10 relative'>
        <div className='font-bold text-xl bg-white absolute top-[-15px]'>
          Customer Information:
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className='font-semibold'>
            <div className='flex flex-col gap-5 mobile:flex-row xs:gap-4 mobile:items-center'>
              <div>Customer Name:</div>
              <div>Contact No.:</div>
              <div>Email Address:</div>
              <div>City:</div>
            </div>
          </div>
          <div className='font-semibold flex flex-col gap-4 mobile:flex-row mobile:gap-4 mobile:items-center'>
            <div>
              <input
                className='rounded-sm border-2'
                type="text"
                name="customerName"
                value={formdata.customerName || ""}
                onChange={HandleInputChange}
              />
            </div>
            <div>
              <input
                className='rounded-sm border-2'
                type="tel"
                name="contactNo"
                value={formdata.contactNo || ""}
                onChange={HandleInputChange}
              />
            </div>
            <div>
              <input
                className='rounded-sm border-2'
                type="text"
                name="email"
                value={formdata.email || ""}
                onChange={HandleInputChange}
              />
            </div>
            <div>
              <select
                className='rounded-sm border-2 w-full pl-4'
                name="city"
                value={formdata.city || ""}
                onChange={HandleInputChange}
              >
                <option value="">Select City</option>
                {cities?.map((city, index) => (
                  <option key={index} value={city.city}>{city.city}</option>

                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className='border-black border h-fit pt-10 mx-10 relative'>
        <div className='font-bold text-xl bg-white absolute header top-[-15px] ml-5'>
          Billing Summary:
        </div>
        <div className='w-full bg-gray-200 grid grid-cols-6 p-2 font-semibold text-lg'>
          <div className='col-span-1'>#</div>
          <div className='col-span-2'>Product Description</div>
          <div className='col-span-1'>Qty</div>
          <div className='col-span-1'>Price</div>
          <div className='col-span-1'></div>
        </div>
        <div className='w-full grid grid-cols-6 p-2 font-semibold text-lg gap-4 items-center'>
          <div className='col-span-1 pl-4'>#</div>
          <div className='col-span-2'>
            <input
              className='rounded-sm w-full border-2'
              value={product.productDisc || ''}
              name="productDisc"
              onChange={HandleProducts}
              type="text"
            />
          </div>
          <div className='col-span-1'>
            <input
              className='rounded-sm border-2'
              value={product.quantitiy || ""}
              name="quantitiy"
              onChange={HandleProducts}
              type="number"
            />
          </div>
          <div className='col-span-1'>
            <input
              className='rounded-sm border-2'
              value={product.price || ""}
              name="price"
              onChange={HandleProducts}
              type="number"
            />
          </div>
          <div className='col-span-1'>
            <button
              className='bg-gray-200 p-1 px-3 rounded-md hover:bg-slate-100 active:bg-transparent active:border'
              onClick={() => addTheProduct(product)}
              type='button'
            >
              Add
            </button>
          </div>
        </div>
        {formdata?.products?.map((item, index) => (
          <div key={index} className='w-full grid grid-cols-6 p-2 px-5 font-semibold text-lg gap-4 items-center'>
            <div onClick={() => handleRemoveButtonClick(index)} className='col-span-1 text-blue-600'>X</div>
            <div className='col-span-2'>{item.productDisc}</div>
            <div className='col-span-1'>{item.quantitiy}</div>
            <div className='col-span-1'>{item.price}</div>
            <div className='col-span-1 text-right'>{item.quantitiy * item.price}</div>
          </div>
        ))}
        <div className='font-semibold'>
          <div className='flex flex-col items-end gap-5 mobile:flex-row xs:gap-4 mobile:items-center p-5'>
            {/* <div>Sub Total: {calculateSubTotal()}</div> */}
            <div>Sub Total: {formdata.amountInfo.subTotal}</div>
            <div>Discount:
              <input type="text" className='rounded-sm border-2 w-24' name='discount' value={formdata.amountInfo.discount}
                onChange={changeTheAmount} /></div>
            {/* /></div> */}
            <div>GST:
              <input type="text" name='gst' value={formdata.amountInfo.gst} className='rounded-sm border-2 w-24' onChange={changeTheAmount} /></div>
          </div>
        </div>
        <div className='w-full bg-gray-200'>
          <div className='flex flex-col font-semibold text-lg items-end gap-5 mobile:flex-row xs:gap-4 mobile:items-center p-2'>
            <div>Grand Total: {formdata.amountInfo.grandTotal}</div>
          </div>
        </div>
        <div className="text-center p-2">
          <button className='capitalize p-2 px-4 border-black border rounded-lg' type='submit'>SUBMIT</button>
        </div>
      </div>
    </form >
  );
};

export default App;
