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
import { splitRouter } from './split'
import { mergeRouter } from './merge'
import { holdsRouter } from './holds'
import { uploadRouter } from './upload'
import { verifyRouter } from './verify'
import { transfersRouter } from './transfers'
import { transformRouter } from './transform'

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
  split: splitRouter,
  merge: mergeRouter,
  holds: holdsRouter,
  upload: uploadRouter,
  verify: verifyRouter,
  events: eventsRouter,
  transfers: transfersRouter,
  verticals: verticalsRouter,
  transform: transformRouter,
})

export type AppRouter = typeof appRouter
