// index.jsx  (InviteUser page)

import { useState } from "react";
import Navbar from "../component/common/Navbar";
import Sidebar from "../component/common/SideBar";
import InviteUserHeader from "../component/InviteUser/InviteUserHeader";
import InviteUserTabs   from "../component/InviteUser/InviteUserTabs";
import InviteUserTable  from "../component/InviteUser/InviteUserTable";
import AddUserModal     from "../component/InviteUser/AddUserModal"; // ← ADD THIS IMPORT

const INITIAL_USERS = [
  { id: 1, client: "John Doe",         email: "john@mail.com", role: "Admin", lastActive: "Today", status: "Paid"         },
  { id: 2, client: "Stark Industries", email: "john@mail.com", role: "Admin", lastActive: "Today", status: "Paid"         },
  { id: 3, client: "Soylent Corp",     email: "john@mail.com", role: "User",  lastActive: "Today", status: "Inactive"     },
  { id: 4, client: "Soylent Corp",     email: "john@mail.com", role: "Admin", lastActive: "Today", status: "Admin Access" },
];

export default function InviteUser() {
  const [activeTab, setActiveTab] = useState("All User");
  const [users, setUsers]         = useState(INITIAL_USERS);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false); // ← ADD THIS

  const handleActivate   = () => alert("Activate selected users");
  const handleDeactivate = () => alert("Deactivate selected users");
  const handleAddNew     = () => setShowAddUser(true); // ← REPLACE the alert with this

  const handleAddUser = (newUser) => setUsers((prev) => [...prev, newUser]); // ← ADD THIS

  const handleView   = (id) => alert(`View user #${id}`);
  const handleEdit   = (id) => alert(`Edit user #${id}`);
  const handleDelete = (id) => {
    if (window.confirm(`Delete user #${id}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="relative flex bg-gray-50 min-h-screen overflow-hidden">
      <Sidebar
        activeItem="Invite User"
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Navbar
          title="Invite User"
          subtitle="Manage user invitations and access"
          user="VBILL"
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">

            <InviteUserHeader
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
              onAddNew={handleAddNew}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 sm:px-6 pt-4">
                <InviteUserTabs activeTab={activeTab} onTabChange={setActiveTab} />
              </div>

              <div className="p-4 sm:p-0">
                {activeTab === "All User" ? (
                  <InviteUserTable
                    users={users}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ) : (
                  <div className="py-16 text-center text-sm text-gray-400">
                    {activeTab} — coming soon.
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ADD THIS — modal renders here, outside the main layout */}
      {showAddUser && (
        <AddUserModal
          onClose={() => setShowAddUser(false)}
          onAdd={handleAddUser}
        />
      )}
    </div>
  );
}