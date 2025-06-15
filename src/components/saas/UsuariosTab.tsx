
import React, { useState } from "react";
import { User, UserSubscription } from "@/hooks/useAdminSaaS";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserForm from "./UserForm";

type UsuariosTabProps = {
  users: User[];
  subscriptions: UserSubscription[];
  createUser: (user: Partial<User> & { password?: string }) => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  setUserActive: (userId: string, isActive: boolean) => Promise<void>;
  setUserPermission: (userId: string, isSuperAdmin: boolean) => Promise<void>;
};

const UsuariosTab: React.FC<UsuariosTabProps> = ({
  users, subscriptions, createUser, updateUser, setUserActive, setUserPermission
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-lg">Usuários do Sistema</span>
        <Button size="sm" onClick={() => { setEditingUser(null); setModalOpen(true); }}>
          Novo Usuário
        </Button>
      </div>
      <div className="divide-y">
        {users.map((user) => {
          const userSub = subscriptions.find(s => s.user_id === user.id && s.status === "active");
          return (
            <div key={user.id} className="flex items-center justify-between py-3">
              <div>
                <div className="font-semibold">{user.full_name || user.email}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
                {userSub && <div className="text-xs">Plano: <span className="font-semibold">{userSub.plan?.name || "—"}</span></div>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setEditingUser(user); setModalOpen(true); }}>Editar</Button>
                <Button size="sm" variant={user.is_active ? "destructive" : "default"}
                  onClick={() => setUserActive(user.id, !user.is_active)}>
                  {user.is_active ? "Desativar" : "Ativar"}
                </Button>
                <Button size="sm" variant="outline"
                  onClick={() => setUserPermission(user.id, true)}>
                  Tornar Admin
                </Button>
              </div>
            </div>
          )
        })}
      </div>
      <UserForm
        open={modalOpen}
        onOpenChange={setModalOpen}
        initial={editingUser}
        onSave={async (data) => {
          if (data.id) await updateUser(data);
          else await createUser(data as any);
          setModalOpen(false);
        }}
      />
    </Card>
  )
};

export default UsuariosTab;
