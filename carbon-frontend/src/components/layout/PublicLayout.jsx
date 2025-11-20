import { Outlet } from 'react-router-dom';
import ScrollToTop from '../common/ScrollToTop';
import { PublicHeader, PublicFooter } from './public';
import './PublicLayout.css';

const PublicLayout = () => {
  return (
    <div className="public-layout bg-white">
      <ScrollToTop />
      <PublicHeader />
      
      {/* Main Content - Add padding-top to account for fixed header */}
      <main className="pt-16 min-h-screen">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
};

export default PublicLayout;

