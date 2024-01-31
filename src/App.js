
import React, { useEffect, useLayoutEffect, useState } from 'react';
import instance from './config';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ModalConfirmation from './ModalConfirmation';

const App = () => {

  // State mgmt

  const [formdata, setFormData] = useState({ products: [], amountInfo: { subTotal: 0, discount: 0, gst: 0, grandTotal: 0 } })
  const [product, setProduct] = useState({})
  const [cities, setCities] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const [openModal, setOpenModal] = useState(false);

  // Modal Open function

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Modal Close function

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Input handle function

  const HandleInputChange = (e) => {
    const { name, value } = e.target;

    // Validations

    if (name === 'customerName' && /[^a-zA-Z ]/.test(value)) {
      toast.error('Invalid input. Only letters and spaces are allowed.');
      return;
    }

    if (name === 'contactNo' && !/^[0-9]{0,10}$/.test(value)) {
      toast.error('Invalid input. Please enter up to 10 digits.');
      return;
    }

    if ((name === 'quantitiy' || 'price') && parseInt(value) < 1) {
      toast.error('Invalid input. Quantity and price cannot be less than 1.');
      return;
    }

    setFormData({ ...formdata, [name]: value });
  }

  //product handler

  const HandleProducts = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value })
  }

  //Add Product function

  const addTheProduct = (product) => {
    setFormData({ ...formdata, products: [...formdata.products, product] })
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

  // handle Remove product

  const handleRemoveButtonClick = (index) => {
    const updatedProducts = formdata.products?.filter((item, i) => i !== index)
    setFormData({ ...formdata, products: updatedProducts })
  };

  // All cities list API Call

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


  // Submit the billing detials

  const SubmitBillingDetials = async (e, formdata) => {
    e.preventDefault()
    try {
      const response = await instance.post("/api/billing/create", formdata)
      if (response.status === 200) {
        handleOpenModal()
        setOrderId(response.data)
        setFormData({ products: [], amountInfo: { subTotal: 0, discount: 0, gst: 0, grandTotal: 0 } })
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        if (error.response.data && error.response.data.error) {
          if (error.response.data.message.includes('duplicate key error collection')) {
            const emailErrorMessage = 'Email address already exists. Please use a different email.';
            toast.error(emailErrorMessage)
          }
        }
      } else {
        console.log(error);
      }
    }
  }


  useEffect(() => {
    const totalPerProduct = formdata.products?.map(
      (item) => parseInt(item.price) * parseInt(item.quantitiy)
    );
    const subTotal = totalPerProduct?.reduce((a, b) => a + b, 0) || 0;
    const gst =
      formdata.amountInfo.gst !== 0 ? (subTotal * formdata.amountInfo.gst) / 100 : 0;
    const grandTotal = subTotal - formdata.amountInfo?.discount + gst;
    setFormData({
      ...formdata,
      amountInfo: { ...formdata.amountInfo, grandTotal, subTotal },
    });
  }, [formdata.products, formdata.amountInfo.discount, formdata.amountInfo.gst]);


  return (
    <>
      <ToastContainer
        position="top-center"
      />
      <form onSubmit={(e) => SubmitBillingDetials(e, formdata)}>

        <div className='font-black text-2xl underline text-center'>Billing System</div>

        {/* Customer Information */}

        <div className='border-black border h-fit px-5 py-10 mb-10 mx-10 mt-5 relative'>
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

        {/* Billing Summary */}

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
              <div>Sub Total: {formdata.amountInfo?.subTotal}</div>
              <div>Discount:
                <input type="text" className='rounded-sm border-2 w-24' name='discount' value={formdata.amountInfo.discount}
                  onChange={changeTheAmount} /></div>
              <div>GST(in %):
                <input type="number" name='gst' value={formdata.amountInfo.gst} className='rounded-sm border-2 w-24' onChange={changeTheAmount} /></div>
            </div>
          </div>
          <div className='w-full bg-gray-200'>
            <div className='flex flex-col font-semibold text-lg items-end gap-5 mobile:flex-row xs:gap-4 mobile:items-center p-2'>
              <div>Grand Total: {formdata.amountInfo?.grandTotal}</div>
            </div>
          </div>
          <div className="text-center p-2">
            <button className='capitalize p-2 px-4 bg-gray-200 border-black border rounded-lg hover:bg-slate-100 active:bg-transparent active:border' type='submit'  >SUBMIT</button>
          </div>
        </div>
      </form >

      {/* Modal for Product added confirmation */}

      <ModalConfirmation
        isOpen={openModal}
        closeModal={handleCloseModal}
      >
        <div className='text-center p-10 uppercase text-gray-500'>
          <div className='text-5xl font-normal'>Order info Added successfully</div>
          <div className='text-3xl font-normal pt-5'>Order Id - #{orderId?.data?.orderId}</div>
        </div>
      </ModalConfirmation>
    </>
  );
};

export default App;
