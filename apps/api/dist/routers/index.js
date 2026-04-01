"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("../trpc");
const auth_1 = require("./auth");
const verticals_1 = require("./verticals");
const workspaces_1 = require("./workspaces");
const workspace_members_1 = require("./workspace-members");
const teams_1 = require("./teams");
const employees_1 = require("./employees");
const facilities_1 = require("./facilities");
const zones_1 = require("./zones");
const pens_1 = require("./pens");
const assets_1 = require("./assets");
const events_1 = require("./events");
exports.appRouter = (0, trpc_1.router)({
    auth: auth_1.authRouter,
    workspaces: workspaces_1.workspacesRouter,
    workspaceMembers: workspace_members_1.workspaceMembersRouter,
    teams: teams_1.teamsRouter,
    employees: employees_1.employeesRouter,
    facilities: facilities_1.facilitiesRouter,
    zones: zones_1.zonesRouter,
    pens: pens_1.pensRouter,
    assets: assets_1.assetsRouter,
    events: events_1.eventsRouter,
    verticals: verticals_1.verticalsRouter,
});
//# sourceMappingURL=index.js.map