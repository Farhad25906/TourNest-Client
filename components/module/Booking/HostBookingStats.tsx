// // components/module/Booking/HostBookingStats.tsx
// import { IBookingStats } from "@/types/booking.interface";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Users, Calendar, DollarSign, CheckCircle, Clock, XCircle, TrendingUp } from "lucide-react";

// interface HostBookingStatsProps {
//   stats: IBookingStats;
//   isHost?: boolean;
// }

// export default function HostBookingStats({ stats, isHost = false }: HostBookingStatsProps) {
//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//     }).format(amount);
//   };

//   const statsItems = [
//     {
//       title: 'Total Bookings',
//       value: stats.totalBookings,
//       icon: Users,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-50',
//     },
//     {
//       title: 'Confirmed',
//       value: stats.confirmedBookings,
//       icon: CheckCircle,
//       color: 'text-green-600',
//       bgColor: 'bg-green-50',
//     },
//     {
//       title: 'Pending',
//       value: stats.pendingBookings,
//       icon: Clock,
//       color: 'text-yellow-600',
//       bgColor: 'bg-yellow-50',
//     },
//     {
//       title: isHost ? 'Total Revenue' : 'Total Spent',
//       value: isHost ? formatCurrency(stats.totalRevenue || 0) : formatCurrency(stats.totalSpent || 0),
//       icon: DollarSign,
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-50',
//     },
//     {
//       title: 'Completed',
//       value: stats.completedBookings,
//       icon: CheckCircle,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-50',
//     },
//     {
//       title: 'Cancelled',
//       value: stats.cancelledBookings,
//       icon: XCircle,
//       color: 'text-red-600',
//       bgColor: 'bg-red-50',
//     },
//   ];

//   // Add upcoming trips/past trips for user stats
//   if (!isHost && 'upcomingTrips' in stats) {
//     statsItems.push(
//       {
//         title: 'Upcoming Trips',
//         value: stats.upcomingTrips,
//         icon: Calendar,
//         color: 'text-green-600',
//         bgColor: 'bg-green-50',
//       },
//       {
//         title: 'Past Trips',
//         value: stats.pastTrips,
//         icon: Calendar,
//         color: 'text-gray-600',
//         bgColor: 'bg-gray-50',
//       }
//     );
//   }

//   if (isHost && 'upcomingBookings' in stats) {
//     statsItems.push({
//       title: 'Upcoming Bookings',
//       value: stats.upcomingBookings,
//       icon: TrendingUp,
//       color: 'text-green-600',
//       bgColor: 'bg-green-50',
//     });
//   }

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//       {statsItems.map((item, index) => (
//         <Card key={index}>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
//                 <p className="text-2xl font-bold mt-2">{item.value}</p>
//               </div>
//               <div className={`p-3 rounded-full ${item.bgColor}`}>
//                 <item.icon className={`w-6 h-6 ${item.color}`} />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }