## Objective #: 1

**Owner (Member Name):** Reynan M. Estobo

**Objective Title:** Develop the Centralized Customer, Transaction, and Branch Management System

**Objective Description**

Responsible for developing customer, transaction, payment, order status, and branch management modules, integrating backend services, implementing business logic, frontend integration, and comprehensive testing to ensure reliable and synchronized system operations.

---

| **Week 5** | **Day 1** | **Develop Order Management Module (Frontend & Backend)** | • Validate Order Management workflow<br>• Validate New Order creation workflow<br>• Validate Order editing workflow<br>• Validate Customer → Order relationship<br>• Validate laundry weight computation<br>• Validate automatic price calculation<br>• Validate add-on selection and quantity handling<br>• Validate payment information during order creation<br>• Validate payment status computation (Unpaid, Partial, Paid)<br>• Validate Order Status workflow (Pending → Washing → Drying → Folding → Ready for Pick-up → Released)<br>• Validate Order Details display<br>• Validate Order search functionality<br>• Validate Order database synchronization<br>• Validate frontend and backend order integration<br>• Resolve Order Management integration issues | • Fully Integrated Order Management Module<br>• Functional Order Creation Workflow<br>• Functional Order Editing Workflow<br>• Functional Payment Status Integration<br>• Functional Order Status Tracking Module | • Orders should be created successfully.<br>• Order information should be updated successfully.<br>• Payment status should compute correctly.<br>• Order status should progress correctly.<br>• Frontend should synchronize with backend changes.<br>• All Order Unit Tests, API Tests, Integration Tests, Component Tests, and End-to-End Tests should pass successfully. |
| **Week 5** | **Day 2** | **Develop Customer Management Module (Frontend & Backend)** | • Validate Customer Management workflow<br>• Validate customer registration workflow<br>• Validate customer update workflow<br>• Validate customer deletion workflow<br>• Validate customer search functionality<br>• Validate customer information fields (Name, Phone Number, Email, Address)<br>• Validate customer data storage and retrieval<br>• Validate duplicate customer prevention<br>• Validate Customer → Order relationship integration<br>• Improve Customer Validation<br>• Improve Customer API handling<br>• Improve Customer error handling<br>• Improve Customer loading states<br>• Refactor Customer frontend components<br>• Refactor Customer backend services<br>• Execute Customer Unit Tests<br>• Execute Customer API Tests<br>• Execute Customer Integration Tests<br>• Execute Customer Frontend Component Tests<br>• Fix Customer Management issues | • Fully Integrated Customer Management Module<br>• Customer CRUD Functionality<br>• Customer Search Functionality<br>• Customer-Order Relationship Integration<br>• Passing Customer Test Suite | • Customer records should be created successfully.<br>• Customer information should be updated successfully.<br>• Customer records should be deleted successfully.<br>• Customer search should function correctly.<br>• Customer data should persist after refresh.<br>• Customer and Order modules should synchronize correctly.<br>• All Customer Unit Tests, API Tests, Integration Tests, Component Tests, and End-to-End Tests should pass successfully. |

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
