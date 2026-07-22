## Objective #: 1

**Owner (Member Name):** Reynan M. Estobo

**Objective Title:** Develop the Centralized Customer, Transaction, and Branch Management System

**Objective Description**

Responsible for developing customer, transaction, payment, order status, and branch management modules, integrating backend services, implementing business logic, frontend integration, and comprehensive testing to ensure reliable and synchronized system operations.

---

# 5-Week Task Breakdown

| Week       | Day       | Task Description                                            | Sub-Tasks (Breakdown)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Deliverable(s)                                                                                                                                                                            | Test Suite / PR Acceptance Criteria                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------- | --------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Week 1** | **Day 1** | **Develop Customer Management UI Components**               | • Create Customer Search Bar component<br>• Create Customer Table component (Name, Phone, Email, Date Added, Actions)<br>• Create Add Customer Button component<br>• Create Add Customer Modal component<br>• Create Full Name input field<br>• Create Phone Number input field<br>• Create Email input field<br>• Create Notes textarea field<br>• Create Edit Customer Modal component<br>• Create Update Button component<br>• Create Delete Action Button component                                                                                                                                                                                                                                                                                                                                                                               | • Customer Table Component<br>• Search Component<br>• Add Customer Modal<br>• Edit Customer Modal<br>• Validation Module                                                                  | • Display Customer Search Bar.<br>• Display Customer Table with Name, Phone, Email, Added Date, and Actions columns.<br>• Display Add Customer button.<br>• Open Add Customer modal.<br>• Display Full Name, Phone Number, Email, and Notes fields.<br>• Open Edit Customer modal.<br>• Display Update and Delete buttons.<br>• Prevent submission when required fields are empty.                                                                                                                                                                                           |
| **Week 2** | **Day 1** | **Develop Laundry Transaction UI Components**               | • Create Status Filter Tabs (All, Pending, Washing, Drying, Folding, Ready for Pick-up, Released)<br>• Create Search Orders component<br>• Create Orders Table component<br>• Create New Order Button component<br>• Create New Order Modal component<br>• Create Phone Number input field<br>• Create Client Name input field<br>• Create Weight input field<br>• Create Add-ons Selection component<br>• Create Add-on Quantity Controls<br>• Create Edit Order Modal component                                                                                                                                                                                                                                                                                                                                                                     | • Status Filter Component<br>• Orders Table Component<br>• New Order Modal<br>• Edit Order Modal                                                                                          | • Display all Order Status Filter Tabs.<br>• Display Search Orders component.<br>• Display Orders Table with Order Number, Customer, Weight, Status, Payment, Amount, Date, and Actions columns.<br>• Display New Order button.<br>• Open New Order modal.<br>• Display Phone Number, Client Name, Weight, and Add-ons fields.<br>• Open Edit Order modal from the Actions column.                                                                                                                                                                                           |
| **Week 2** | **Day 2** | **Develop Payment and Order Status UI Components**          | • Create Price Breakdown Card component<br>• Create Laundry Cost display component<br>• Create Total Amount display component<br>• Create Payment Method Dropdown component<br>• Create Amount Paid input field<br>• Create Payment Status Badge component<br>• Create Order Progress Tracker component<br>• Create Order Status Badge component<br>• Create Time Left Display component                                                                                                                                                                                                                                                                                                                                                                                                                                                              | • Price Breakdown Component<br>• Payment Section Component<br>• Status Tracker Component<br>• Status Badge Component                                                                      | • Display Price Breakdown Card.<br>• Display Laundry Cost and Total Amount values.<br>• Display Payment Method dropdown.<br>• Display Amount Paid field.<br>• Display Paid and Partial status badges.<br>• Display Order Progress Tracker.<br>• Display current Order Status badge.<br>• Display Time Left field in the Orders table.                                                                                                                                                                                                                                        |
| **Week 3** | **Day 1** | **Develop Customer Management Backend Module**              | • Create Customers database table<br>• Create Customer schema definition<br>• Create Customer Model<br>• Create Customer Validation Module<br>• Implement Create Customer Service<br>• Implement Read Customer Service<br>• Implement Update Customer Service<br>• Implement Delete Customer Service<br>• Create Customer Controller<br>• Create Customer Routes<br>• Connect Frontend API Layer<br>• Create Customer Unit Tests                                                                                                                                                                                                                                                                                                                                                                                                                      | • Customers Table Schema<br>• Customer CRUD Module<br>• Backend MVC Module<br>• Frontend API Integration<br>• Customer Unit Test Suite                                                    | • Create customer records successfully.<br>• Retrieve customer records successfully.<br>• Update customer records successfully.<br>• Delete customer records successfully.<br>• Synchronize frontend and backend correctly.<br>• Pass all Customer Unit Tests.                                                                                                                                                                                                                                                                                                               |
| **Week 3** | **Day 2** | **Develop Laundry Transaction Backend Module**              | • Create Orders database table<br>• Create Order schema definition<br>• Create Order Model<br>• Create Order Validation Module<br>• Implement Create Order Service<br>• Implement Read Order Service<br>• Implement Update Order Service<br>• Create Order Controller<br>• Create Order Routes<br>• Connect Frontend API Layer<br>• Associate Customer records with Orders<br>• Create Order Unit Tests                                                                                                                                                                                                                                                                                                                                                                                                                                               | • Orders Table Schema<br>• Order CRUD Module<br>• Backend MVC Module<br>• Frontend API Integration<br>• Order Unit Test Suite                                                             | • Create order records successfully.<br>• Retrieve order records successfully.<br>• Update order records successfully.<br>• Associate customer records with orders.<br>• Synchronize frontend and backend correctly.<br>• Pass all Order Unit Tests.                                                                                                                                                                                                                                                                                                                         |
| **Week 4** | **Day 1** | **Integrate Payment and Order Status Management**           | • Create Payments database table<br>• Create Payment schema definition<br>• Create Payment Model<br>• Create Payment Service<br>• Create Payment Controller<br>• Create Payment Routes<br>• Connect Payment API to Frontend<br>• Connect Payment Section component to backend<br>• Implement Initial Payment function<br>• Implement Complete Payment function<br>• Create Order Status Service<br>• Create Order Status Controller<br>• Connect Status Tracker to backend<br>• Connect Payment Status Badge to backend<br>• Create Backend Unit Tests<br>• Create API Tests<br>• Create Integration Tests<br>• Create Frontend Component Tests                                                                                                                                                                                                       | • Payments Table Schema<br>• Payment Integration Module<br>• Order Status Integration Module<br>• Backend MVC Module<br>• Frontend API Integration<br>• Payment & Order Status Test Suite | • Store payment records successfully.<br>• Update payment information correctly.<br>• Display Paid and Partial payment status badges.<br>• Update Order Status values in the database.<br>• Display updated Order Progress in the Orders page.<br>• Synchronize frontend and backend correctly.<br>• Pass Backend Unit Tests, API Tests, Integration Tests, and Frontend Component Tests.                                                                                                                                                                                    |
| **Week 4** | **Day 2** | **Complete Staff and Branch Management Module**             | • Create Staff database table<br>• Create Branch database table<br>• Create Staff schema definition<br>• Create Branch schema definition<br>• Create Staff Model<br>• Create Branch Model<br>• Create Staff Validation Module<br>• Implement Create Staff function<br>• Implement Read Staff function<br>• Implement Update Staff function<br>• Implement Delete Staff function<br>• Create Staff Controller<br>• Create Branch Controller<br>• Create Staff Routes<br>• Create Branch Routes<br>• Connect Staff page to backend<br>• Connect Staff Table UI<br>• Connect Add Staff Modal<br>• Connect Edit Staff Modal<br>• Implement Branch Assignment<br>• Implement Staff Role Assignment<br>• Connect Frontend API Layer<br>• Create Backend Unit Tests<br>• Create API Tests<br>• Create Integration Tests<br>• Create Frontend Component Tests | • Staff Table Schema<br>• Branches Table Schema<br>• Staff CRUD Module<br>• Branch Assignment Module<br>• Backend MVC Module<br>• Frontend Staff Integration<br>• Staff Test Suite        | • Create staff records successfully.<br>• Retrieve staff records successfully.<br>• Update staff information successfully.<br>• Delete staff records successfully.<br>• Assign branches correctly.<br>• Assign staff roles correctly.<br>• Synchronize frontend and backend correctly.<br>• Pass Backend Unit Tests, API Tests, Integration Tests, and Frontend Component Tests.                                                                                                                                                                                             |
| **Week 5** | **Day 1** | **Integrate Complete Laundry Business Workflow**            | • Validate Customer → Order workflow<br>• Validate Order → Payment workflow<br>• Validate Payment → Order Status workflow<br>• Validate Staff → Branch workflow<br>• Validate Customer registration workflow<br>• Validate automatic payment computation<br>• Validate payment status updates<br>• Validate order status progression<br>• Validate database synchronization<br>• Validate frontend synchronization<br>• Validate search functionality<br>• Validate pagination<br>• Resolve cross-module integration issues                                                                                                                                                                                                                                                                                                                           | • Fully Integrated Customer Module<br>• Fully Integrated Order Module<br>• Fully Integrated Payment Module<br>• Fully Integrated Order Status Module<br>• Fully Integrated Staff Module   | • Customer → Order → Payment → Release workflow should function correctly.<br>• Payment Status should update automatically.<br>• Order Status should update automatically.<br>• Frontend should remain synchronized with backend changes.<br>• All integration tests should pass successfully.                                                                                                                                                                                                                                                                               |
| **Week 5** | **Day 2** | **System Stabilization and Quality Assurance**              | • Improve Frontend API Integration<br>• Improve Customer Validation<br>• Improve Order Validation<br>• Improve Payment Validation<br>• Improve Staff Validation<br>• Improve API Error Handling<br>• Improve Loading States<br>• Improve Backend Service Layer<br>• Improve Frontend Reusable Components<br>• Refactor duplicated backend logic<br>• Refactor duplicated frontend logic<br>• Execute Backend Unit Tests<br>• Execute Backend API Tests<br>• Execute Backend Integration Tests<br>• Execute Frontend Component Tests<br>• Execute Frontend Inter-component Tests<br>• Fix all failing tests                                                                                                                                                                                                                                            | • Stable Application Build<br>• Optimized Backend<br>• Optimized Frontend<br>• Passing Test Suites                                                                                        | • All Backend Unit Tests should pass.<br>• All Backend API Tests should pass.<br>• All Backend Integration Tests should pass.<br>• All Frontend Component Tests should pass.<br>• All Frontend Inter-component Tests should pass.<br>• No broken workflows should remain.                                                                                                                                                                                                                                                                                                    |
| **Week 6** | **Day 1** | **Final System Validation, Refactoring, and Documentation** | • Execute complete Customer workflow validation<br>• Execute complete Order workflow validation<br>• Execute complete Payment workflow validation<br>• Execute complete Order Status workflow validation<br>• Execute complete Staff workflow validation<br>• Execute complete Branch workflow validation<br>• Execute Full Backend Test Suite<br>• Execute Full Frontend Test Suite<br>• Execute API Test Suite<br>• Execute Integration Test Suite<br>• Perform Manual Acceptance Testing<br>• Refactor backend codebase<br>• Refactor frontend components<br>• Remove unused code<br>• Clean project structure<br>• Finalize README<br>• Finalize API Documentation<br>• Finalize Technical Documentation<br>• Prepare Final Demonstration<br>• Resolve remaining issues                                                                           | • Final Laundry Management System<br>• Final Source Code<br>• Technical Documentation<br>• API Documentation<br>• Final Testing Report<br>• Production-ready Application                  | • Customer Management Module should work completely.<br>• Laundry Order Module should work completely.<br>• Payment Module should work completely.<br>• Order Status Module should work completely.<br>• Staff Management Module should work completely.<br>• Branch Management Module should work completely.<br>• Backend and Frontend should be fully synchronized.<br>• All Backend Unit Tests, API Tests, Integration Tests, Frontend Component Tests, and Inter-component Tests should pass successfully.<br>• The application should be ready for final presentation. |

---

# Expected Final Deliverables

## Frontend Modules

- Customer Management Module
- Laundry Transaction Management Module
- Payment Management Module
- Order Status Tracking Module
- Staff Management Module
- Branch Management Module

---

## Backend Modules

- Customer CRUD Module
- Order CRUD Module
- Payment Management Module
- Order Status Management Module
- Staff CRUD Module
- Branch Management Module

---

## Backend Architecture

The backend follows the **Model–Service–Controller–Route (MSCR)** architecture.

### Models

- Customer Model
- Order Model
- Payment Model
- Staff Model
- Branch Model

### Validation Modules

- Customer Validation
- Order Validation
- Payment Validation
- Staff Validation

### Services

- Customer Service
- Order Service
- Payment Service
- Order Status Service
- Staff Service
- Branch Service

### Controllers

- Customer Controller
- Order Controller
- Payment Controller
- Order Status Controller
- Staff Controller
- Branch Controller

### Routes

- Customer Routes
- Order Routes
- Payment Routes
- Order Status Routes
- Staff Routes
- Branch Routes

---

## Frontend Architecture

The frontend follows a reusable component architecture with a dedicated API service layer.

### Pages

- Dashboard
- Customers
- Orders
- Staff

### Reusable Components

- Customer Components
- Order Components
- Payment Components
- Status Tracker
- Dashboard Cards
- Search Components
- Filter Components
- Modal Components
- Pagination Components

### API Service Layer

- Customer API
- Order API
- Payment API
- Order Status API
- Staff API
- Branch API

---

## Database

The system uses **Supabase PostgreSQL**.

### Database Tables

- Customers
- Orders
- Payments
- Staff
- Branches

---

## System Features

### Customer Management

- Customer Registration
- Customer Search
- Customer Update
- Customer Deletion

### Laundry Transaction Management

- Order Creation
- Order Editing
- Customer Assignment
- Price Breakdown
- Add-ons Management

### Payment Management

- Initial Payment
- Remaining Balance Payment
- Payment Status Tracking
- Payment History

### Order Status Management

- Pending
- Washing
- Drying
- Folding
- Ready
- Released

- Workflow validation
- Status progression
- Database synchronization

### Staff Management

- Staff Registration
- Staff Update
- Staff Deletion
- Staff Role Assignment

### Branch Management

- Branch Assignment
- Branch Management

---

# Testing

## Backend Testing

- Unit Tests
- API Tests
- Integration Tests

### Backend Test Coverage

- Customer Module
- Order Module
- Payment Module
- Order Status Module
- Staff Module
- Branch Module

---

## Frontend Testing

- Component Tests
- Inter-component Tests
- Routing Tests

### Frontend Test Coverage

- Customer Components
- Order Components
- Payment Components
- Status Tracker
- Dashboard Components
- Search Components
- Filters
- Modals
- Forms

---

## System Testing

- End-to-End Workflow Validation
- Manual Acceptance Testing
- Backend–Frontend Synchronization Testing
- Database Validation

---

# Documentation

- README
- Technical Documentation
- API Documentation
- Database Documentation
- Installation Guide
- Testing Report
- Final Project Documentation

---

# Technologies Used

## Frontend

- React
- React Router
- Axios
- Vitest
- Testing Library

## Backend

- Express.js
- Node.js
- Supabase
- Vitest
- Supertest

## Database

- Supabase PostgreSQL

---

# Final Output

A fully integrated **Laundry Management System** developed using **React**, **Express.js**, and **Supabase**, following a **Model–Service–Controller–Route (MSCR)** backend architecture with a dedicated frontend API layer.

The completed system includes:

- Customer Management
- Laundry Transaction Management
- Payment Management
- Order Status Management
- Staff Management
- Branch Management

The application provides synchronized frontend and backend operations, secure database integration, reusable frontend components, modular backend architecture, comprehensive automated testing (Unit, API, Integration, Component, Inter-component, and Routing Tests), complete technical documentation, and a production-ready workflow suitable for deployment and final project presentation.
