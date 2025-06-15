
import { Card } from "@/components/ui/card";
import { User, UserSubscription } from "@/hooks/useAdminSaaS";

type UsuariosCardProps = {
  users: User[];
  subscriptions: UserSubscription[];
};

export default function UsuariosCard({ users, subscriptions }: UsuariosCardProps) {
  return (
    <Card className="min-h-[340px] col-span-1 xl:col-span-1">
      <span className="font-semibold text-lg">Usuários</span>
      <div className="mt-3 divide-y">
        {users.map((user) => {
          const userSub = subscriptions.find(s => s.user_id === user.id && s.status === "active");
          return (
            <div key={user.id} className="py-2">
              <div className="font-semibold">{user.full_name || user.email}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
              {userSub && <div className="text-xs">
                Plano: <span className="font-semibold">{userSub.plan?.name || "—"}</span>{" "}
                <span className="text-neutral-400">({userSub.status})</span>
              </div>}
            </div>
          )
        })}
      </div>
    </Card>
  );
}
