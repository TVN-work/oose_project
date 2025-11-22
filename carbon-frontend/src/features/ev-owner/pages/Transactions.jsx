import { CreditCard } from 'lucide-react'

export default function Transactions() {
  return (
    <div className="fade-in">
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-8 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <CreditCard className="w-6 h-6 mr-2 text-purple-600" />
          Giao dịch
        </h2>
        <p className="text-gray-600">Trang này đang được phát triển...</p>
      </div>
    </div>
  )
}

