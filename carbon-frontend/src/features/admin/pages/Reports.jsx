import { BarChart3, Users, CreditCard, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const reportTypes = [
    {
      icon: Users,
      title: 'Báo cáo người dùng',
      description: 'Thống kê người dùng, tăng trưởng, hoạt động',
      gradient: 'from-blue-500 to-blue-600',
      action: () => toast.info('📊 Đang tạo báo cáo người dùng...'),
    },
    {
      icon: CreditCard,
      title: 'Báo cáo giao dịch',
      description: 'Phân tích giao dịch, doanh thu, xu hướng',
      gradient: 'from-green-500 to-green-600',
      action: () => toast.info('📈 Đang tạo báo cáo giao dịch...'),
    },
    {
      icon: DollarSign,
      title: 'Báo cáo tài chính',
      description: 'Dòng tiền, phí, lợi nhuận hệ thống',
      gradient: 'from-orange-500 to-orange-600',
      action: () => toast.info('💰 Đang tạo báo cáo tài chính...'),
    },
  ];

  const generateReport = (type) => {
    toast.info(`📈 Đang tạo báo cáo ${type}...`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Overview Card */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-white shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Báo cáo hệ thống</h2>
            <p className="opacity-90 mb-4">Phân tích dữ liệu và tạo báo cáo chi tiết</p>
            <div className="flex space-x-4">
              <button
                onClick={() => generateReport('tháng')}
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                📊 Báo cáo tháng
              </button>
              <button
                onClick={() => generateReport('năm')}
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                📈 Báo cáo năm
              </button>
            </div>
          </div>
          <div className="text-6xl opacity-20">
            <BarChart3 className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report, index) => {
          const Icon = report.icon;
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all">
              <div className={`w-12 h-12 bg-gradient-to-r ${report.gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-lg text-gray-800 mb-2 text-center">{report.title}</h4>
              <p className="text-sm text-gray-600 mb-4 text-center">{report.description}</p>
              <button
                onClick={report.action}
                className={`w-full bg-gradient-to-r ${report.gradient} text-white py-2 rounded-lg hover:opacity-90 transition-all`}
              >
                📊 Tạo báo cáo
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsPage;

