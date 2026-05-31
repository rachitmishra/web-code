import React, { useEffect, useState } from 'react';
import { useLoaderData, useSubmit, useActionData } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { 
  type UserProfile,
  type Address
} from '../services/profileService';
import { useNavigate, Link } from 'react-router';
import Button from '../components/ui/Button/Button';
import Card from '../components/ui/Card/Card';
import Input from '../components/ui/Input/Input';
import styles from './Profile.module.css';

export { loader, action } from './Profile.server';

const Profile: React.FC = () => {
  const { profile: serverProfile, orders: serverOrders } = useLoaderData() as { profile: any, orders: any[] };
  const actionData = useActionData() as { success?: boolean };
  const submit = useSubmit();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(serverProfile);
  const [loading, setLoading] = useState(!serverProfile);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<any[]>(serverOrders);

  const [displayName, setDisplayName] = useState(serverProfile?.displayName || '');
  const [emoji, setEmoji] = useState(serverProfile?.emoji || '');

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newZip, setNewZip] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.isAnonymous) {
        setLoading(false);
        navigate('/login');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (actionData?.success) {
      setSaving(false);
      setShowAddressForm(false);
      setNewStreet("");
      setNewCity("");
      setNewZip("");
    }
  }, [actionData]);

  // Sync data when loader data changes
  useEffect(() => {
    if (serverProfile) {
      setProfile(serverProfile);
      setDisplayName(serverProfile.displayName || '');
      setEmoji(serverProfile.emoji || '');
    }
    if (serverOrders) {
      setOrders(serverOrders);
    }
  }, [serverProfile, serverOrders]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    submit(
      { intent: "update-profile", displayName, emoji },
      { method: "post" }
    );
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    submit(
      { intent: "add-address", street: newStreet, city: newCity, zip: newZip },
      { method: "post" }
    );
  };

  const handleDeleteAddress = async (index: number) => {
    if (!window.confirm("Delete this address?")) return;
    submit(
      { intent: "delete-address", index: index.toString() },
      { method: "post" }
    );
  };

  if (loading) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h1>Your Profile</h1>
          {profile?.role === 'admin' && (
            <span className={styles.adminBadge}>Admin</span>
          )}
        </div>
        {profile?.role === 'admin' && (
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <Button variant="outline" style={{ fontSize: '0.875rem' }}>
              Admin Panel &rarr;
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <form className={styles.form} onSubmit={handleSave}>
          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Input
            label="Profile Emoji"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            placeholder="e.g. 👋"
          />
          <Button type="submit" loading={saving}>
            Save Changes
          </Button>
        </form>
      </Card>

      <section className={styles.section}>
        <h2>Address Book</h2>
        <div className={styles.addressList}>
          {profile?.addresses && profile.addresses.length > 0 ? (
            profile.addresses.map((addr, i) => (
              <div key={i} className={styles.addressCard}>
                <div className={styles.addressDetails}>
                  <strong>{addr.street}</strong>
                  <span>
                    {addr.city}, {addr.zip}
                  </span>
                </div>
                <div className={styles.addressActions}>
                  <Button
                    variant="outline"
                    style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                    onClick={() => handleDeleteAddress(i)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "var(--color-text-muted)" }}>
              No addresses saved yet.
            </p>
          )}

          {!showAddressForm ? (
            <Button
              variant="outline"
              style={{ width: "fit-content" }}
              onClick={() => setShowAddressForm(true)}
            >
              Add New Address
            </Button>
          ) : (
            <form className={styles.addressForm} onSubmit={handleAddAddress}>
              <Input
                label="Street"
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                required
              />
              <Input
                label="City"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                required
              />
              <Input
                label="Zip"
                value={newZip}
                onChange={(e) => setNewZip(e.target.value)}
                required
              />
              <div style={{ display: "flex", gap: "var(--spacing-2)" }}>
                <Button type="submit" loading={saving}>
                  Save Address
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowAddressForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Order History</h2>
        {orders.length > 0 ? (
          <div className={styles.orderList}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderDetails}>
                  <strong>Order {order.id}</strong>
                  <span>
                    {order.createdAt?.toDate
                      ? order.createdAt.toDate().toLocaleDateString()
                      : "Date N/A"}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "bold" }}>
                    ${order.total.toFixed(2)}
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      textTransform: "capitalize",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--color-text-muted)" }}>No orders found.</p>
        )}
      </section>
    </div>
  );
};

export default Profile;
