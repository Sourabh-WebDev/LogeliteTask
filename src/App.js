import React, { useState } from 'react';

const App = () => {
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    contactNo: '',
    emailAddress: '',
    city: '',
    productDiscription: '',
    qty: '',
    price: ''
  });

  const [billingData, setBillingData] = useState([]);
  const [discount, setDiscount] = useState(null);
  const [gst, setGST] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Validate
    if (name === 'customerName' && /[^a-zA-Z ]/.test(value)) {
      console.log('Invalid input. Only letters and spaces are allowed.');
      return;
    }

    if (name === 'contactNo' && !/^[0-9]{0,10}$/.test(value)) {
      // Display an error message or handle it as needed
      console.log('Invalid input. Please enter up to 10 digits.');
      return;
    }

    if (name === 'qty' || 'price') {
      const numericValue = parseInt(value, 10);

      // Check if the value is less than 1
      if (numericValue < 1) {
        // Display an error message or handle it as needed
        console.log('Invalid input. Quantity cannot be less than 1.');
        return;
      }
    }

    setCustomerInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };


  const calculateSubTotal = () => {
    return billingData.reduce((total, item) => total + item.qty * item.price, 0);
  };

  const calculateDiscountAmount = () => {
    return (calculateSubTotal() * discount) / 100;
  };

  const calculateGSTAmount = () => {
    return ((calculateSubTotal() - calculateDiscountAmount()) * gst) / 100;
  };

  const calculateGrandTotal = () => {
    return calculateSubTotal() - calculateDiscountAmount() + calculateGSTAmount();
  };

  const handleAddButtonClick = () => {
    // Check if all required fields are filled
    if (
      customerInfo.productDiscription &&
      customerInfo.qty &&
      customerInfo.price
    ) {
      // Add the current customerInfo to billingData array
      setBillingData((prevData) => [...prevData, { ...customerInfo }]);

      // Clear the input fields
      setCustomerInfo({
        ...customerInfo,
        productDiscription: '',
        qty: '',
        price: ''
      });

      console.log('Billing Data:', billingData);
    } else {
      console.log('Please fill in all required fields.');
    }
  };

  const handleRemoveButtonClick = (index) => {
    setBillingData((prevData) => prevData.filter((item, i) => i !== index));
  };

  return (
    <div>
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
                value={customerInfo.customerName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                className='rounded-sm border-2'
                type="tel"
                name="contactNo"
                value={customerInfo.contactNo}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                className='rounded-sm border-2'
                type="text"
                name="emailAddress"
                value={customerInfo.emailAddress}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <select
                className='rounded-sm border-2 w-full pl-4'
                name="city"
                value={customerInfo.city}
                onChange={handleInputChange}
              >
                <option value="">Select City</option>
                <option value="lucknow">Lucknow</option>
                <option value="kanpur">Kanpur</option>
                <option value="varanasi">Varanasi</option>
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
              value={customerInfo.productDiscription}
              name="productDiscription"
              onChange={handleInputChange}
              type="text"
            />
          </div>
          <div className='col-span-1'>
            <input
              className='rounded-sm border-2'
              value={customerInfo.qty}
              name="qty"
              onChange={handleInputChange}
              type="number"
            />
          </div>
          <div className='col-span-1'>
            <input
              className='rounded-sm border-2'
              value={customerInfo.price}
              name="price"
              onChange={handleInputChange}
              type="number"
            />
          </div>
          <div className='col-span-1'>
            <button
              className='bg-gray-200 p-1 px-3 rounded-md hover:bg-slate-100 active:bg-transparent active:border'
              onClick={handleAddButtonClick}
            >
              Add
            </button>
          </div>
        </div>
        {billingData.map((item, index) => (
          <div key={index} className='w-full grid grid-cols-6 p-2 px-5 font-semibold text-lg gap-4 items-center'>
            <div onClick={() => handleRemoveButtonClick(index)} className='col-span-1 text-blue-600'>X</div>
            <div className='col-span-2'>{item.productDiscription}</div>
            <div className='col-span-1'>{item.qty}</div>
            <div className='col-span-1'>{item.price}</div>
            <div className='col-span-1 text-right'>{item.qty * item.price}</div>
          </div>
        ))}
        <div className='font-semibold'>
          <div className='flex flex-col items-end gap-5 mobile:flex-row xs:gap-4 mobile:items-center p-5'>
            <div>Sub Total: {calculateSubTotal()}</div>
            <div>Discount:
              <input type="text" className='rounded-sm border-2 w-24' value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value))} /></div>
            <div>GST: <input type="text" value={gst}
              onChange={(e) => setGST(parseFloat(e.target.value))} className='rounded-sm border-2 w-24' /></div>
          </div>
        </div>
        <div className='w-full bg-gray-200'>
          <div className='flex flex-col font-semibold text-lg items-end gap-5 mobile:flex-row xs:gap-4 mobile:items-center p-2'>
            <div>Grand Total: {calculateGrandTotal()}</div>
          </div>
        </div>
        <div className="text-center p-2">
          <button className='capitalize p-2 px-4 border-black border rounded-lg'>SUBMIT</button>
        </div>
      </div>
    </div>
  );
};

export default App;
