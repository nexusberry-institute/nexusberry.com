export default function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
      {/* Step 1 */}
      <div
        className={`relative p-3 rounded-lg transition-all duration-300 ${currentStep === 1
          ? 'bg-primary-400 text-white shadow-lg'
          : currentStep > 1
            ? 'bg-blue-900/30 text-blue-300'
            : 'bg-gray-800 text-gray-400'
          }`}
      >
        <div className="flex items-center">
          <div className={`
          flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full mr-2 sm:mr-3 flex-shrink-0
          ${currentStep === 1
              ? 'bg-white text-primary-400'
              : currentStep > 1
                ? 'bg-primary-400 text-white'
                : ' text-gray-400 bg-gray-700'
            }
        `}>
            {currentStep > 1 ? '✓' : '1'}
          </div>
          <div>
            <h3 className="font-medium text-sm sm:text-base">Select Course</h3>
            <p className="text-xs opacity-80 hidden sm:block">Select a Course & Press Enroll Now</p>
          </div>
        </div>
        {currentStep === 1 && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 hidden sm:block">
            <svg width="16" height="8" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10L0 0H20L10 10Z" className="fill-primary-400" />
            </svg>
          </div>
        )}
      </div>

      {/* Step 2 */}
      <div
        className={`relative p-3 rounded-lg transition-all duration-300 ${currentStep === 2
          ? 'bg-primary-400 text-white shadow-lg'
          : currentStep > 2
            ? 'bg-blue-900/30 text-blue-300'
            : 'bg-gray-800 text-gray-400'
          }`}
      >
        <div className="flex items-center">
          <div className={`
          flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full mr-2 sm:mr-3 flex-shrink-0
          ${currentStep === 2
              ? 'bg-white text-primary-400'
              : currentStep > 2
                ? 'bg-primary-400 text-white'
                : 'text-gray-400 bg-gray-700'
            }
        `}>
            {currentStep > 2 ? '✓' : '2'}
          </div>
          <div>
            <h3 className="font-medium text-sm sm:text-base">Select Payment Plan</h3>
            <p className="text-xs opacity-80 hidden sm:block">Choose Paymenent Options (Full or Installments)</p>
          </div>
        </div>
        {currentStep === 2 && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 hidden sm:block">
            <svg width="16" height="8" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10L0 0H20L10 10Z" className="fill-primary-400" />
            </svg>
          </div>
        )}
      </div>

      {/* Step 3 */}
      <div
        className={`relative p-3 rounded-lg transition-all duration-300 ${currentStep === 3
          ? 'bg-primary-400 text-white shadow-lg'
          : currentStep > 3
            ? 'bg-blue-900/30 text-blue-300'
            : 'bg-gray-800 text-gray-400'
          }`}
      >
        <div className="flex items-center">
          <div className={`
          flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full mr-2 sm:mr-3 flex-shrink-0
          ${currentStep === 3
              ? 'bg-white text-primary-400'
              : currentStep > 3
                ? 'bg-primary-400 text-white'
                : ' text-gray-400 bg-gray-700'
            }
        `}>
            3
          </div>
          <div>
            <h3 className="font-medium text-sm sm:text-base">Submit Proof of Payment</h3>
            <p className="text-xs opacity-80 hidden sm:block">Complete enrollment</p>
          </div>
        </div>
        {currentStep === 3 && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 hidden sm:block">
            <svg width="16" height="8" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10L0 0H20L10 10Z" className="fill-primary-400" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}