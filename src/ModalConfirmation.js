import React from 'react'

const ModalConfirmation = ({ isOpen, closeModal, children }) => {
    return (
        <div className={`fixed inset-0 ${isOpen ? 'block' : 'hidden'} bg-black bg-opacity-50 z-50`}>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-md border-2 border-gray-500">
                <div className="flex justify-end">
                    <button
                        className="text-gray-600 hover:text-gray-800 focus:outline-none"
                        onClick={closeModal}
                    >
                        &times;
                    </button>
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </div>
    )
}

export default ModalConfirmation