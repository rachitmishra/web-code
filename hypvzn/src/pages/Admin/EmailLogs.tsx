import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { type EmailLog } from "../../services/emailService";
import Card from "../../components/ui/Card/Card";
import styles from "./EmailLogs.module.css";

// Re-export loader from server-only module
export { loader } from './EmailLogs.server';

const EmailLogs: React.FC = () => {
  const { logs } = useLoaderData() as { logs: EmailLog[] };
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Email Logs</h1>
      </div>

      <Card>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tr}>
                <th className={styles.th}>Recipient</th>
                <th className={styles.th}>Subject</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className={styles.tr}>
                  <td className={styles.td}>{log.to}</td>
                  <td className={styles.td}>{log.subject}</td>
                  <td className={styles.td}>
                    <span
                      className={`${styles.statusBadge} ${
                        log.status === "success" ? styles.statusSuccess : styles.statusError
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className={styles.td}>
                    {log.createdAt?.toDate
                      ? log.createdAt.toDate().toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className={styles.empty}>
            No email logs found.
          </div>
        )}
      </Card>
    </div>
  );
};


export default EmailLogs;
