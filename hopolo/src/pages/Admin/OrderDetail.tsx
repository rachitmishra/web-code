import React, { useState, useEffect } from 'react';
import { useLoaderData, useNavigate, useSubmit, useActionData } from 'react-router';
import { type Order } from '../../services/orderService';
import Button from '../../components/ui/Button/Button';
import styles from './OrderDetail.module.css';

export { loader, action } from './OrderDetail.server';

const OrderDetail: React.FC = () => {
  const { order: initialOrder } = useLoaderData() as { order: Order };
  const actionData = useActionData() as { success?: boolean, shippingInfo?: any, error?: string };
  const submit = useSubmit();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order>(initialOrder);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<{ trackingId: string; labelUrl: string } | null>(null);

  useEffect(() => {
    if (initialOrder) setOrder(initialOrder);
  }, [initialOrder]);

  useEffect(() => {
    if (actionData?.success) {
      setShippingLoading(false);
      setRefundLoading(false);
      if (actionData.shippingInfo) {
        setShippingInfo(actionData.shippingInfo);
      }
    } else if (actionData?.error) {
      alert(actionData.error);
      setShippingLoading(false);
      setRefundLoading(false);
    }
  }, [actionData]);

  const handleShip = async () => {
    if (!order) return;
    setShippingLoading(true);
    submit({ intent: "ship-order" }, { method: "post" });
  };

  const handleRefund = async () => {
    if (!order || !order.paymentId) return;
    if (!window.confirm(`Are you sure you want to refund ₹${order.total}?`)) return;

    setRefundLoading(true);
    submit({ intent: "refund-order" }, { method: "post" });
  };

  if (!order) return <div className={styles.container}>Order not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="outline" onClick={() => navigate('/admin/orders')} style={{ marginBottom: 'var(--spacing-4)' }}>
          &larr; Back to Orders
        </Button>
        <h1>Order {order.id}</h1>
      </div>

      <div className={styles.section}>
        <h2>Customer Information</h2>
        <p><strong>User ID:</strong> {order.userId}</p>
        <p><strong>Payment ID:</strong> {order.paymentId}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span className={`${styles.status} ${styles[`status_${order.status}`]}`}>
            {order.status}
          </span>
        </p>
      </div>

      <div className={styles.section}>
        <h2>Shipping Address</h2>
        <p>{order.address?.street}</p>
        <p>{order.address?.city}, {order.address?.zip}</p>
      </div>

      <div className={styles.section}>
        <h2>Items</h2>
        {order.items?.map((item: any, index: number) => (
          <div key={index} className={styles.item}>
            <span>{item.name} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className={styles.total}>
          Total: ₹{order.total}
        </div>
      </div>

      {shippingInfo && (
        <div className={styles.section}>
          <h2>Tracking Info</h2>
          <p><strong>Tracking ID:</strong> {shippingInfo.trackingId}</p>
          <p><a href={shippingInfo.labelUrl} target="_blank" rel="noopener noreferrer">Download Label</a></p>
        </div>
      )}

      <div className={styles.actions}>
        <Button 
          onClick={handleShip} 
          loading={shippingLoading}
          disabled={order.status === 'shipped' || order.status === 'delivered' || order.status === 'refunded'}
        >
          {order.status === 'shipped' ? 'Shipped' : 'Ship with Shadowfax'}
        </Button>
        <Button 
          variant="secondary" 
          onClick={handleRefund}
          loading={refundLoading}
          disabled={order.status === 'refunded' || order.status === 'failed'}
        >
          {order.status === 'refunded' ? 'Refunded' : 'Issue Refund'}
        </Button>
      </div>
    </div>
  );
};

export default OrderDetail;
