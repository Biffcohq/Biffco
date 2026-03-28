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

export const appRouter = router({
  auth: authRouter,
  workspaces: workspacesRouter,
  workspaceMembers: workspaceMembersRouter,
  teams: teamsRouter,
  employees: employeesRouter,
  facilities: facilitiesRouter,
  zones: zonesRouter,
  pens: pensRouter,
  verticals: verticalsRouter,
})

export type AppRouter = typeof appRouter
