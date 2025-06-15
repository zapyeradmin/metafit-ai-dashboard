
// Wrapper que importa e expõe todos hooks refatorados:
import { useAdminPlans } from "./useAdminPlans";
import { useAdminGateways } from "./useAdminGateways";
import { useAdminUsers } from "./useAdminUsers";

export function useAdminSaaS() {
  const { plans, loading: loadingPlans, savePlan, deletePlan } = useAdminPlans();
  const { gateways, loading: loadingGateways, saveGateway, deleteGateway } = useAdminGateways();
  const {
    users,
    subscriptions,
    loading: loadingUsers,
    createUser,
    updateUser,
    setUserActive,
    setUserPermission,
  } = useAdminUsers();

  return {
    plans,
    gateways,
    users,
    subscriptions,
    loading: loadingPlans || loadingGateways || loadingUsers,
    savePlan,
    deletePlan,
    saveGateway,
    deleteGateway,
    createUser,
    updateUser,
    setUserActive,
    setUserPermission,
  };
}
