# Business Analytics Dashboard & Reporting Tools

## Objective #2
**Owner:** Richelle Anne L. Roxas  
**Title:** Develop the Business Analytics Dashboard & Reporting Tools

---

## Objective Description
Responsible for designing, developing, and implementing business analytics dashboards and reporting tools that analyze sales performance, service demand, branch productivity, and customer trends. Ensures that managers have access to accurate, real-time reports and visualizations to support monitoring, performance evaluation, and data-driven decision-making across all laundry shop branches.

---

# 5-Week Task Breakdown

## Week 1

| Day | Task | Sub-Tasks | Deliverables | Test / Acceptance Criteria |
|-----|------|-----------|--------------|----------------------------|
| Day 1 | Develop Dashboard Top Section and Summary Cards | Create dashboard layout, build summary cards (Transactions, Revenue, Customers, Active Orders, Ready for Pickup, Low Stock), design styling & icons, implement spacing & alignment, add date display & refresh button, create responsive layout, build navigation bar and header | Dashboard layout, summary cards components, navigation & header | Dashboard renders correctly, all summary cards displayed, styling matches reference, responsive layout works, date and refresh button visible, navigation bar functional |

---

## Week 2

| Day | Task | Sub-Tasks | Deliverables | Test / Acceptance Criteria |
|-----|------|-----------|--------------|----------------------------|
| Day 1 | Build Suggestions & Alerts Panel | Create alerts container, design color-coded alerts (Red/Yellow/Blue), build alert items, add Resolve & View Products buttons, add dividers, style UI, add section header | Suggestions & Alerts panel, alert components | Alerts displayed correctly with correct colors, buttons functional, dividers present, styling matches reference |
| Day 2 | Develop Decision Support & AI Insights | Create Decision Support panel, build recommendation items, add AI Insights sections (Operational, Inventory, Service Improvement), design colored panels, add View Details & View Full Insights buttons | Decision Support panel, AI Insights components | All sections rendered correctly, buttons visible and functional, layout matches reference design |

---

## Week 3

| Day | Task | Sub-Tasks | Deliverables | Test / Acceptance Criteria |
|-----|------|-----------|--------------|----------------------------|
| Day 1 | Implement Analytics Charts & Backend Analytics Service | Create Weekly Orders Bar Chart and Weekly Revenue Trend Line Chart, implement Weekly/Monthly/Yearly period selection, design responsive chart containers, implement loading and empty states, create the Order model, develop the Order Analytics Service using MongoDB aggregation for weekly, monthly, and yearly analytics, format analytics data for frontend consumption, and implement backend unit tests using Vitest with mocked database responses | Analytics Charts module, Order Model, Order Analytics Service, Analytics data formatter, Backend unit tests | Charts render correctly, period switching works properly, layout matches the dashboard design, loading and empty states display correctly, analytics service returns valid labels, orders, and revenue data, invalid analytics period throws an error, and all backend unit tests pass successfully |
| Day 2 | Develop Recent Orders Table | Create table (Order ID, Customer, Status, Waiting Time, Amount), design status badges, implement pagination, add row styling, alternating colors, fix alignment | Recent Orders table, status badges, pagination | Table displays correctly, pagination works, status badges accurate, layout matches design |

---

## Week 4

| Day | Task | Sub-Tasks | Deliverables | Test / Acceptance Criteria |
|-----|------|-----------|--------------|----------------------------|
| Day 1 | Settings Page & Account Security | Create settings layout, build security section, create password form, add validation, input icons, update password button, display email | Settings page, security form | Form fields functional, validation works, layout matches reference, email displayed correctly |
| Day 2 | Pricing Management Section | Create pricing header, build bundle inputs, add add-ons section, design currency labels (PHP), add Save button, structure layout | Pricing section, input fields | Prices display correctly, PHP labels visible, save button works, layout matches reference |

---

## Week 5

| Day | Task | Sub-Tasks | Deliverables | Test / Acceptance Criteria |
|-----|------|-----------|--------------|----------------------------|
| Day 1 | Appearance, Notifications & ETA Settings | Create dark mode toggle, notification switch, process ETA inputs (washing/drying/folding), compute total ETA, add save button | Settings panels, ETA system | Toggles work, ETA calculated correctly, inputs functional, layout matches reference |
| Day 2 | Database Integration (Supabase) | Connect settings to Supabase, implement save/retrieve functions, link dashboard data, enable real-time updates, validate database sync | Database integration system | Data saves and retrieves correctly, dashboard updates dynamically, real-time sync working |

---

## Week 6

| Day | Task | Sub-Tasks | Deliverables | Test / Acceptance Criteria |
|-----|------|-----------|--------------|----------------------------|
| Day 1 | Final Styling & System Integration | Standardize UI styles, test all components, fix spacing issues, ensure responsiveness, validate charts, tables, and forms, complete system integration | Final dashboard system | UI matches reference, no broken components, responsive design works, full system functional |

---

# Final Output

A fully functional **Business Analytics Dashboard & Reporting System** with:

- Real-time analytics dashboard
- Alerts & decision support system
- AI insights module
- Analytics charts and reporting tools
- Recent orders management table
- Settings, pricing, and ETA configuration
- Backend analytics service for weekly, monthly, and yearly reporting
- MongoDB aggregation-based analytics processing
- Backend unit testing using Vitest
- Full Supabase integration