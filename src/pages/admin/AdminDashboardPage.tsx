import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabaseClient';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader
} from 'lucide-react';

interface StatsCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  border: string;
}

const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPlans: 0,
    premiumUsers: 0,
    revenueMonth: 0
  });
  
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentPlans, setRecentPlans] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats
        const { data: usersData, error: usersError } = await supabase
          .from('user_profiles')
          .select('id, created_at, subscription_status');
          
        if (usersError) throw usersError;
        
        const { data: plansData, error: plansError } = await supabase
          .from('saved_plans')
          .select('id, created_at, user_id');
          
        if (plansError) throw plansError;
        
        // Fetch recent users
        const { data: recentUsersData, error: recentUsersError } = await supabase
          .from('user_profiles')
          .select('id, user_id, full_name, email, created_at, avatar_url, subscription_status')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentUsersError) throw recentUsersError;
        
        // Fetch recent plans
        const { data: recentPlansData, error: recentPlansError } = await supabase
          .from('saved_plans')
          .select('id, title, created_at, user_id, user_profiles(full_name, email, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentPlansError) throw recentPlansError;
        
        // Calculate stats
        const premiumCount = usersData.filter(user => 
          user.subscription_status === 'pro' || user.subscription_status === 'enterprise'
        ).length;
        
        setStats({
          totalUsers: usersData.length,
          activeUsers: usersData.filter(user => {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return new Date(user.created_at) > lastMonth;
          }).length,
          totalPlans: plansData.length,
          premiumUsers: premiumCount,
          revenueMonth: premiumCount * 29.99 // Assuming $29.99 per premium user
        });
        
        setRecentUsers(recentUsersData);
        setRecentPlans(recentPlansData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const statsCards: StatsCard[] = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: 12,
      icon: <Users className="w-6 h-6" />,
      border: 'border-blue-500'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      change: 8,
      icon: <TrendingUp className="w-6 h-6" />,
      border: 'border-green-500'
    },
    {
      title: 'Total Plans',
      value: stats.totalPlans,
      change: 24,
      icon: <FileText className="w-6 h-6" />,
      border: 'border-purple-500'
    },
    {
      title: 'Premium Users',
      value: stats.premiumUsers,
      change: 18,
      icon: <Users className="w-6 h-6" />,
      border: 'border-yellow-500'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.revenueMonth.toFixed(2)}`,
      change: 32,
      icon: <DollarSign className="w-6 h-6" />,
      border: 'border-green-500'
    }
  ];
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {statsCards.map((stat, index) => (
            <div 
              key={index} 
              className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${stat.border}`}
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-50 rounded-md p-3">
                    {stat.icon}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  {stat.change > 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1.5 flex-shrink-0" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500 mr-1.5 flex-shrink-0" />
                  )}
                  <span className={`${stat.change > 0 ? 'text-green-500' : 'text-red-500'} mr-2`}>
                    {Math.abs(stat.change)}%
                  </span>
                  <span className="text-gray-500">from last month</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Recent Activity Section */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Users */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Users</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {recentUsers.map((user) => (
                <li key={user.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img 
                        className="h-10 w-10 rounded-full"
                        src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.full_name || user.email?.split('@')[0]}&background=6366F1&color=fff`}
                        alt={user.full_name || 'User'}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.full_name || 'No name'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.subscription_status === 'pro' ? 'bg-green-100 text-green-800' :
                        user.subscription_status === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.subscription_status || 'basic'}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 px-4 py-3 text-right">
              <a href="/admin/users" className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                View all users <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          
          {/* Recent Plans */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Plans</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {recentPlans.map((plan) => (
                <li key={plan.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <FileText className="h-10 w-10 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {plan.title || 'Untitled Plan'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        Created: {new Date(plan.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      <p>{new Date(plan.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 px-4 py-3 text-right">
              <a href="/admin/content" className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                View all plans <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage; 