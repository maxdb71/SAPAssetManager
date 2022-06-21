import libSuper from '../Supervisor/SupervisorLibrary';
import personalLib from '../Persona/PersonaLibrary';

export default function SideDrawerHeadLine(context) {
    
    if (personalLib.isMaintenanceTechnician(context)) {
        if (libSuper.isSupervisorFeatureEnabled(context)) {
            return libSuper.isUserSupervisor(context).then(isSupervisor => {
                if (isSupervisor) {
                    return context.localizeText('supervisor');
                }
                return context.localizeText('technician');
            });
        }
        return context.localizeText('technician');
    }
    if (personalLib.isInventoryClerk(context)) {
        return context.localizeText('inventory_clerk');
    }
    return Promise.resolve('');
}
