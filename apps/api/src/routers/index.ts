import { router } from '../trpc'
import { authRouter } from './auth'
import { verticalsRouter } from './verticals'
import { workspacesRouter } from './workspaces'
import { workspaceMembersRouter } from './workspace-members'
import { teamsRouter } from './teams'
import { employeesRouter } from './employees'
import { facilitiesRouter } from './facilities'
import { zonesRouter } from './zones'
import { pensRouter } from './pens'
import { assetsRouter } from './assets'
import { eventsRouter } from './events'
import { assetGroupsRouter } from './assetGroups'
export const appRouter = router({
  auth: authRouter,
  workspaces: workspacesRouter,
  workspaceMembers: workspaceMembersRouter,
  teams: teamsRouter,
  employees: employeesRouter,
  facilities: facilitiesRouter,
  zones: zonesRouter,
  pens: pensRouter,
  assets: assetsRouter,
  assetGroups: assetGroupsRouter,
  events: eventsRouter,
  verticals: verticalsRouter,
})

export type AppRouter = typeof appRouter
