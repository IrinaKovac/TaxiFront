import { FC, useEffect, useState } from "react";
import styles from "./PreviousRidesUser.module.css";
import { RideServiceType } from "../Services/RideService";
import { CreateRideResponse, RideStatus } from "../models/Ride";

interface IProps {
  rideService: RideServiceType;
}

const NewRidesDriver: FC<IProps> = (props) => {
  const [rideData, setRideData] = useState<CreateRideResponse[]>([]);

  /*useEffect(() => {
    const fetchRides = async () => {
      const data = await props.rideService.GetUserRides();
      if (data) {
        setRideData(data);
      }
    };*/

  useEffect(() => {
    const fetchRides = async () => {
      const data = await props.rideService.GetUserRides();
      if (data) {
        // Dodato za filtriranje duplikata
        const uniqueRides = data.filter(
          (ride, index, self) =>
            index ===
            self.findIndex(
              (r) =>
                r.createdAtTimestamp === ride.createdAtTimestamp &&
                r.clientEmail === ride.clientEmail &&
                r.driverEmail === ride.driverEmail
            )
        );

        console.log(uniqueRides); // Proveri filtrirane podatke
        setRideData(uniqueRides);
      }
    };

    fetchRides();
  }, [props.rideService]);

  // Helper function to map status numbers to status strings
  const getStatusString = (status: number): string => {
    switch (status) {
      case RideStatus.CREATED:
        return "Created";
      case RideStatus.ACCEPTED:
        return "Accepted";
      case RideStatus.COMPLETED:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.row}>
            <th className={styles.headerCell}>Created At</th>
            <th className={styles.headerCell}>Start Address</th>
            <th className={styles.headerCell}>End Address</th>
            <th className={styles.headerCell}>Client</th>
            <th className={styles.headerCell}>Driver</th>
            <th className={styles.headerCell}>Status</th>
            <th className={styles.headerCell}>Price</th>
          </tr>
        </thead>
        <tbody>
          {rideData.map((ride) => (
            <tr className={styles.row} key={ride.createdAtTimestamp}>
              <td className={styles.dataCell}>
                {ride.createdAtTimestamp
                  ? new Date(ride.createdAtTimestamp).toUTCString()
                  : "N/A"}
              </td>
              <td className={styles.dataCell}>{ride.startAddress}</td>
              <td className={styles.dataCell}>{ride.endAddress}</td>
              <td className={styles.dataCell}>{ride.clientEmail}</td>
              <td className={styles.dataCell}>
                {ride.driverEmail ? ride.driverEmail : "N/A"}
              </td>
              <td className={styles.dataCell}>
                {getStatusString(ride.status)}
              </td>
              <td className={styles.dataCell}>{ride.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewRidesDriver;
