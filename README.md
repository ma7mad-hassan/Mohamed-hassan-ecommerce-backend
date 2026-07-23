# E-Commerce REST API

A fully functional RESTful API built with Node.js, Express, and MongoDB for managing an e-commerce platform. It handles products, categories, dynamic shopping cart operations, and order processing with automated stock updates.

## 1. Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB
* **ODM:** Mongoose

---

## 2. Features

* **Categories API:** Complete CRUD operations for organizing products into categories.
* **Products API:** Advanced product management including category filtering, price range queries, stock checking, and text search.
* **Cart API:** Persistent shopping cart management—add, update item quantities, remove items, or clear cart.
* **Orders API:** Automated checkout process validating stock, calculating total prices server-side, deducting stock on order creation, and restoring stock on order cancellation.

---

## 3. Prerequisites

Ensure you have the following installed locally before running the project:
* **Node.js** (v18.x or higher recommended)
* **MongoDB** (Local instance or MongoDB Atlas Connection URI)
* **npm*

---
## 4. Installation
* 1.Clone the repository:
   git clone <https://github.com/ma7mad-hassan/Mohamed-hassan-ecommerce-backend.git>
* 2.Install project dependencie
* 3.Configure environment variables
* 4.Seed the database with sample data
* 5.Start the development server

---
## 5. Environment Variables

*PORT: The port number on which the Express server listens	ex: 3000
*DATABASE:	Connection URI string for MongoDB database ex: mongodb://localhost:27017/ecommerce
*NODE_ENV: Environment mode (development or production)	




