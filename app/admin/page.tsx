/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

interface Order {
  id: string;
  customer: CustomerDetails;
  items: OrderItem[];
  total: number;
  orderDate: string;
  status: 'pending' | 'completed' | 'returned';
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'returned'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const loadOrders = () => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
        ...order,
        id: order.id || Math.random().toString(36).substr(2, 9),
        status: order.status || 'pending'
      }));
      setOrders(parsedOrders);
      localStorage.setItem('orders', JSON.stringify(parsedOrders));
    }
  };

  const checkAuth = () => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus !== 'true') {
      router.replace('/admin/login');
    } else {
      setIsAuthenticated(true);
      loadOrders();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.replace('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const updateOrderStatus = (orderId: string, newStatus: 'pending' | 'completed' | 'returned') => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const deleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    }
  };

  const getOrderStats = () => {
    const filteredOrders = getFilteredOrders();
    return {
      total: filteredOrders.length,
      completed: filteredOrders.filter(o => o.status === 'completed').length,
      pending: filteredOrders.filter(o => o.status === 'pending').length,
      returned: filteredOrders.filter(o => o.status === 'returned').length,
      totalRevenue: filteredOrders
        .filter(o => o.status === 'completed')
        .reduce((sum, order) => sum + order.total, 0)
    };
  };

  const isWithinDateRange = (date: string) => {
    const orderDate = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);

    switch (dateFilter) {
      case 'today':
        return orderDate >= today;
      case 'week':
        return orderDate >= weekAgo;
      case 'month':
        return orderDate >= monthAgo;
      default:
        return true;
    }
  };

  const getFilteredOrders = () => {
    return orders
      .filter(order => filterStatus === 'all' || order.status === filterStatus)
      .filter(order => isWithinDateRange(order.orderDate))
      .sort((a, b) => {
        const dateA = new Date(a.orderDate).getTime();
        const dateB = new Date(b.orderDate).getTime();
        return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      });
  };

  const stats = getOrderStats();
  const filteredOrders = getFilteredOrders();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Completed Orders</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Returned Orders</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">{stats.returned}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">Rs{stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Order Management</h2>
            <div className="flex space-x-4">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="returned">Returned</option>
              </select>
              <select
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value as any)}
                className="rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          <table className="min-w-full">
            <thead>
              <tr className="border-b text-sm font-semibold text-gray-900">
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-b">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{order.customer.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{formatDate(order.orderDate)}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">Rs {order.total.toFixed(2)}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{order.status}</td>
                  <td className="px-6 py-3 text-sm font-medium">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="ml-4 text-green-600 hover:text-green-700"
                    >
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'returned')}
                      className="ml-4 text-red-600 hover:text-red-700"
                    >
                      Mark as Returned
                    </button>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="ml-4 text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-900"
                >
                  Close
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-700">Customer Information</h3>
                <p className="text-sm text-gray-600"><strong>Name:</strong> {selectedOrder.customer.name}</p>
                <p className="text-sm text-gray-600"><strong>Email:</strong> {selectedOrder.customer.email}</p>
                <p className="text-sm text-gray-600"><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                <p className="text-sm text-gray-600"><strong>Address:</strong> {selectedOrder.customer.address}</p>
                <p className="text-sm text-gray-600"><strong>City:</strong> {selectedOrder.customer.city}</p>
                {selectedOrder.customer.notes && (
                  <p className="text-sm text-gray-600"><strong>Notes:</strong> {selectedOrder.customer.notes}</p>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-700">Order Items</h3>
                <ul className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center text-sm text-gray-600">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>Rs {item.price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-700">Order Total</h3>
                <p className="text-sm text-gray-900">Rs {selectedOrder.total.toFixed(2)}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-white bg-yellow-600 rounded-md hover:bg-yellow-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
