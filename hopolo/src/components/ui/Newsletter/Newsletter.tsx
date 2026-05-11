import React from 'react';
import styles from './Newsletter.module.css';

const Newsletter: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <span className={styles.tag}>COMMUNICATIONS_PROTOCOL</span>
        <h2 className={styles.title}>Receive Technical Updates</h2>
        <div className={styles.form}>
          <input 
            className={styles.input} 
            placeholder="ENTER_EMAIL_FOR_ENCRYPTION" 
            type="email"
          />
          <button className={styles.button}>SUBMIT</button>
        </div>
        <p className={styles.footer}>
          By registering, you agree to our data processing protocols. Opt-out at any time.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
