import { useNavigate } from "react-router-dom";

const adminCards = [
  {
    title: "Plane Management",
    description: "Add, edit, or remove planes and configure seat layouts.",
    path: "/admin/planes",
  },
  {
    title: "User Management",
    description: "View and manage registered users and roles.",
    path: "/admin/users",
  },
  {
    title: "Booking Management",
    description: "Review, modify or cancel flight bookings.",
    path: "/admin/bookings",
  },
  {
    title: "Flight Management",
    description: "Create and maintain available flights.",
    path: "/admin/flights",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-sky-50 p-6">
      <h1 className="text-3xl font-bold text-sky-700 mb-8 text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {adminCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => navigate(card.path)}
            className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:ring-2 hover:ring-sky-400 transition"
          >
            <h2 className="text-xl font-semibold text-sky-600 mb-2">{card.title}</h2>
            <p className="text-gray-600">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
