// import { createContext, useContext, useEffect, useState } from "react";

// import { getGuestSession } from "../api/guestApi";

// const GuestContext = createContext(null);

// export const GuestProvider = ({ children }) => {
//   const [guest, setGuest] = useState(null);
//   const [reservations, setReservations] = useState([]);
//   const [isInitializing, setIsInitializing] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let isMounted = true;

//     const initializeGuestSession = async () => {
//       try {
//         const data = await getGuestSession();

//         if (!isMounted) {
//           return;
//         }

//         setGuest(data.guest);
//         setReservations(data.reservations ?? []);
//       } catch (error) {
//         if (!isMounted) {
//           return;
//         }

//         console.error("Guest initialization failed:", error);

//         setGuest(null);
//         setReservations([]);
//         setError("Unable to load your reservations.");
//       } finally {
//         if (isMounted) {
//           setIsInitializing(false);
//         }
//       }
//     };

//     initializeGuestSession();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   return (
//     <GuestContext.Provider
//       value={{
//         guest,
//         reservations,
//         setReservations,
//         isInitializing,
//         error,
//       }}
//     >
//       {children}
//     </GuestContext.Provider>
//   );
// };

// // eslint-disable-next-line react-refresh/only-export-components
// export const useGuest = () => {
//   const context = useContext(GuestContext);

//   if (!context) {
//     throw new Error("useGuest must be used inside GuestProvider");
//   }

//   return context;
// };
