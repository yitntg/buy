'use client'

interface Action {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

interface ErrorAlertProps {
  title: string;
  message: string;
  actions?: Action[];
}

export default function ErrorAlert({ title, message, actions }: ErrorAlertProps) {
  return (
    <div className="bg-white border-l-4 border-red-500 rounded-lg shadow-md p-6 animate-fade-in">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-red-800">
            {title}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>
              {message}
            </p>
          </div>
          
          {actions && actions.length > 0 && (
            <div className="mt-4 flex space-x-3">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    action.primary 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-white text-red-700 border border-red-300 hover:bg-red-50'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 添加fade-in动画到tailwind.config.js
// extend: {
//   keyframes: {
//     'fade-in': {
//       '0%': { opacity: '0' },
//       '100%': { opacity: '1' },
//     },
//   },
//   animation: {
//     'fade-in': 'fade-in 0.3s ease-in-out',
//   },
// }, 