import { Routes } from "@angular/router";
// Components
import { CoreLayout } from "./components/core-layout/core-layout";
import { SessionLayout } from "../session/components/session-layout/session-layout";
import { loadSessionGuard } from "../session/guards/load-session-guard";

export const CORE_ROUTES: Routes = [
    {
        path: '',
        component: CoreLayout,
        children: [
            {
                path: '',
                component: SessionLayout,
                canActivate: [loadSessionGuard]
            },
            {
                path: ':id',
                component: SessionLayout,
                canActivate: [loadSessionGuard]
            }
        ]
    }
]