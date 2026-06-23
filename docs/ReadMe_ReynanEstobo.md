
## Objective #: 1

**Owner (Member Name):** Reynan M. Estobo

**Objective Title:** Develop the Centralized Customer, Transaction, and Branch Management System

**Objective Description**

Responsible for developing customer, transaction, payment, order status, and branch management modules, integrating them with Supabase, and conducting testing to ensure reliable and synchronized system operations.

---

## 5-Week Task Breakdown

| Week | Day | Task Description | Sub-Tasks (Breakdown) | Deliverable(s) | Test Suite / PR Acceptance Criteria |
|------|-----|------------------|----------------------|----------------|-------------------------------------|
| **Week 1** | **Day 1** | Develop Customer Management UI Components | Create Customer Search Bar, Customer Table, Add Customer Button, Add Customer Modal, Full Name Input, Phone Number Input, Email Input, Notes Textarea, Edit Customer Modal, Update Button, Delete Button | Customer Table Component, Search Component, Add Customer Modal, Edit Customer Modal, Validation Module | Display Customer Search Bar. Display Customer Table with Name, Phone, Email, Added Date, and Actions columns. Open Add Customer Modal. Display Full Name, Phone Number, Email, and Notes fields. Open Edit Customer Modal. Display Update and Delete buttons. Prevent submission when required fields are empty. |
| **Week 2** | **Day 1** | Develop Laundry Transaction UI Components | Create Status Filter Tabs, Search Orders Component, Orders Table, New Order Button, New Order Modal, Phone Number Input, Client Name Input, Weight Input, Add-ons Selection, Add-on Quantity Controls, Edit Order Modal | Status Filter Component, Orders Table Component, New Order Modal, Edit Order Modal | Display all order status filter tabs. Display Search Orders component. Display Orders table with Order Number, Customer, Weight, Status, Payment, Amount, Date, and Actions columns. Open New Order Modal. Display order fields. Open Edit Order Modal. |
| **Week 2** | **Day 2** | Develop Payment and Order Status UI Components | Create Price Breakdown Card, Laundry Cost Display, Total Amount Display, Payment Method Dropdown, Amount Paid Input, Payment Status Badge, Order Progress Tracker, Order Status Badge, Time Left Display | Price Breakdown Component, Payment Section Component, Status Tracker Component, Status Badge Component | Display Price Breakdown card. Display Laundry Cost and Total Amount values. Display Payment Method dropdown. Display Amount Paid field. Display Paid and Partial badges. Display Order Progress Tracker. Display Order Status badge. Display Time Left field. |
| **Week 3** | **Day 1** | Integrate Customer Management with Supabase | Create Customers Table, Customer Schema Definition, Connect Customer UI Components, Implement Create, Read, Update, and Delete Functions | Customers Table Schema, Customer CRUD API, Customer Database Integration | Create customer records. Retrieve customer records from Supabase. Update customer information. Delete customer records. Reflect database changes after each operation. |
| **Week 3** | **Day 2** | Integrate Laundry Transaction Management with Supabase | Create Orders Table, Order Schema Definition, Connect Orders UI Components, Implement Create, Read, and Update Functions, Associate Customers with Orders | Orders Table Schema, Order CRUD API, Orders Database Integration | Create order records. Retrieve order records. Update order records. Associate customers with orders. Display updated records immediately after database operations. |
| **Week 4** | **Day 1** | Integrate Payment and Order Status Management | Create Payments Table, Payment Schema Definition, Connect Payment Components, Implement Create and Update Payment Functions, Connect Order Status Tracking | Payments Table Schema, Payment Integration Module, Order Status Integration Module | Store payment records. Update payment information. Display Paid and Partial badges. Update order statuses. Display updated order progress. |
| **Week 4** | **Day 2** | Integrate Staff and Branch Management | Create Staff Table, Branches Table, Connect Staff UI Components, Implement Create and Update Staff Functions, Branch Assignment, Staff Role Management | Staff Table Schema, Branches Table Schema, Staff CRUD API, Branch Assignment Module | Create staff records. Retrieve staff records. Update staff information. Assign branches to staff. Display assigned branch and role. |
| **Week 5** | **Day 1** | Conduct End-to-End Testing for Customer and Order Management | Test Add Customer, Edit Customer, Delete Customer, Create Order, Edit Order Workflows, Fix UI and Validation Issues | E2E Test Report, Bug Fix Report, Updated Modules | Successfully add, edit, and delete customers. Successfully create and update laundry orders. |
| **Week 5** | **Day 2** | Conduct End-to-End Testing for Payment and Staff Operations | Test Payment Workflow, Payment Status Workflow, Order Status Workflow, Add Staff Workflow, Edit Staff Workflow, Fix Integration Issues | E2E Test Report, Bug Fix Report, Updated Modules | Successfully store payment records. Correctly display payment status badges. Correctly update order statuses. Successfully create and update staff records and branch assignments. |
| **Week 6** | **Day 1** | Final System Validation and Documentation | Execute Full Workflow Testing, Validate Customer, Orders, Payment, and Staff Modules, Resolve Issues, Update Documentation | Final Testing Report, Technical Documentation, Fully Integrated System | Successfully execute all system workflows. Synchronize all modules with Supabase. Pass all documented end-to-end test scenarios without critical defects. |

---

## Expected Final Deliverables

### Frontend Modules

- Customer Management Module
- Laundry Transaction Management Module
- Payment Management Module
- Order Status Tracking Module
- Staff Management Module
- Branch Management Module

### Backend Modules

- Customer CRUD API
- Order CRUD API
- Payment Integration Module
- Staff CRUD API
- Branch Assignment Module

### Database Schemas

- Customers Table
- Orders Table
- Payments Table
- Staff Table
- Branches Table

### Testing Deliverables

- Unit Test Suite
- Integration Test Suite
- End-to-End Test Reports
- Bug Fix Reports

### Documentation

- Technical Documentation
- Final Testing Report
- System Validation Report

### Final Output

A fully integrated Laundry Management System with synchronized Customer, Transaction, Payment, Staff, and Branch Management modules powered by Supabase.