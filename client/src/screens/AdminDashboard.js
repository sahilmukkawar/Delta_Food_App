// import React, { useEffect, useState } from "react";

// const AdminDashboard = () => {
//   const [orders, setOrders] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [menuItems, setMenuItems] = useState([]);

//   useEffect(() => {
//     fetchOrders();
//     fetchUsers();
//     fetchMenuItems();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const response = await axios.get("/admin/orders");
//       setOrders(response.data);
//     } catch (error) {
//       console.error("Error fetching orders", error);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get("/admin/users");
//       setUsers(response.data);
//     } catch (error) {
//       console.error("Error fetching users", error);
//     }
//   };

//   const fetchMenuItems = async () => {
//     try {
//       const response = await axios.get("/admin/menu-items");
//       setMenuItems(response.data);
//     } catch (error) {
//       console.error("Error fetching menu items", error);
//     }
//   };

//   const deleteMenuItem = async (id) => {
//     try {
//       await axios.delete(`/admin/menu-items/${id}`);
//       fetchMenuItems();
//     } catch (error) {
//       console.error("Error deleting menu item", error);
//     }
//   };

//   return (
//     <div className="p-5">
//       <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

//       <section className="mb-6">
//         <h2 className="text-xl font-semibold">Orders</h2>
//         <table className="w-full border-collapse border border-gray-300 mt-2">
//           <thead>
//             <tr>
//               <th className="border border-gray-300 px-2">Email</th>
//               <th className="border border-gray-300 px-2">Date</th>
//               <th className="border border-gray-300 px-2">Price</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => (
//               <tr key={order._id}>
//                 <td className="border border-gray-300 px-2">{order.email}</td>
//                 <td className="border border-gray-300 px-2">{order.date}</td>
//                 <td className="border border-gray-300 px-2">{order.price}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       <section className="mb-6">
//         <h2 className="text-xl font-semibold">Users</h2>
//         <table className="w-full border-collapse border border-gray-300 mt-2">
//           <thead>
//             <tr>
//               <th className="border border-gray-300 px-2">Email</th>
//               <th className="border border-gray-300 px-2">Role</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user._id}>
//                 <td className="border border-gray-300 px-2">{user.email}</td>
//                 <td className="border border-gray-300 px-2">{user.role}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       <section className="mb-6">
//         <h2 className="text-xl font-semibold">Menu Items</h2>
//         <table className="w-full border-collapse border border-gray-300 mt-2">
//           <thead>
//             <tr>
//               <th className="border border-gray-300 px-2">Name</th>
//               <th className="border border-gray-300 px-2">Price</th>
//               <th className="border border-gray-300 px-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {menuItems.map((item) => (
//               <tr key={item._id}>
//                 <td className="border border-gray-300 px-2">{item.name}</td>
//                 <td className="border border-gray-300 px-2">{item.price}</td>
//                 <td className="border border-gray-300 px-2">
//                   <button onClick={() => deleteMenuItem(item._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>
//     </div>
//   );
// };

// export default AdminDashboard;
