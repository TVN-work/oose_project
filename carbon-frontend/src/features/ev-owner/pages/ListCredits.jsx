import { Card } from '../../../components/common'
import { Tag } from 'lucide-react'

export default function ListCredits() {
  return (
    <div className="fade-in">
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Tag className="w-6 h-6 mr-2 text-blue-600" />
          Niêm yết tín chỉ
        </h2>
        <p className="text-gray-600">Trang này đang được phát triển...</p>
      </Card>
    </div>
  )
}

