import { FC, useEffect, useState } from "react";
import styles from "./Verification.module.css";

import { DriverServiceType } from "../Services/DriverService";
import { Driver, DriverStatus, UpdateDriverStatusData } from "../models/Driver";

interface IProps {
  driverService: DriverServiceType;
}

const Verification: FC<IProps> = (props) => {
  const [driversData, setDriversData] = useState<Driver[]>([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const data = await props.driverService.GetAllDrivers();
      if (data) {
        const driversWithRatings = await Promise.all(
          data.map(async (driver) => {
            const rating = await props.driverService.GetDriverRating(
              driver.email
            );
            return { ...driver, rating };
          })
        );
        setDriversData(driversWithRatings);
      }
    };
    fetchDrivers();
  }, [props.driverService]);

  const handleVerify = (driver: Driver) => {
    updateDriverStatus(driver, DriverStatus.VERIFIED, "verified");
  };

  const handleBan = (driver: Driver) => {
    updateDriverStatus(driver, DriverStatus.BANNED, "banned");
  };

  const handleUnban = (driver: Driver) => {
    updateDriverStatus(driver, DriverStatus.VERIFIED, "unbanned");
  };

  async function updateDriverStatus(
    driver: Driver,
    status: DriverStatus,
    action: string
  ) {
    const request: UpdateDriverStatusData = {
      Email: driver.email,
      Status: status,
    };

    try {
      const response = await props.driverService.UpdateDriverStatus(request);

      if (response && response.status === 200) {
        alert(`Driver ${driver.username} has been ${action} successfully.`);
        const data = await props.driverService.GetAllDrivers();
        if (data) {
          setDriversData(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.row}>
            <th className={styles.headerCell}>Username</th>
            <th className={styles.headerCell}>Email</th>
            <th className={styles.headerCell}>Full name</th>
            <th className={styles.headerCell}>Date of birth</th>
            <th className={styles.headerCell}>Address</th>
            <th className={styles.headerCell}>Rating</th>
            <th className={styles.headerCell}>Status</th>
            <th className={styles.headerCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {driversData.map((driver) => (
            <tr className={styles.row} key={driver.username}>
              <td className={styles.dataCell}>{driver.username}</td>
              <td className={styles.dataCell}>{driver.email}</td>
              <td className={styles.dataCell}>{driver.fullname}</td>
              <td className={styles.dataCell}>
                {new Date(driver.dateOfBirth).toLocaleDateString("sr-RS", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td className={styles.dataCell}>{driver.address}</td>
              <td className={styles.dataCell}>
                {driver.rating === 0 ? "N/A" : driver.rating}
              </td>
              <td className={styles.dataCell}>{DriverStatus[driver.status]}</td>
              <td className={styles.dataCell}>
                {driver.status === DriverStatus.NOT_VERIFIED && (
                  <button
                    onClick={() => handleVerify(driver)}
                    className={styles.actionButton}
                  >
                    Verify
                  </button>
                )}
                {driver.status === DriverStatus.VERIFIED && (
                  <button
                    onClick={() => handleBan(driver)}
                    className={styles.actionButton}
                  >
                    Ban
                  </button>
                )}
                {driver.status === DriverStatus.BANNED && (
                  <button
                    onClick={() => handleUnban(driver)}
                    className={styles.actionButton}
                  >
                    Unban
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Verification;
