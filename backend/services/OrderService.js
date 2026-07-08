// backend/services/OrderService.js

import {
  insertOrder,
  getOrders,
  updateOrder,
} from "../models/OrderModel.js";


// ==========================
// VALIDATION
// ==========================

const validateOrder = (order) => {

  if (!order.customer_id) {
    throw new Error(
      "Customer ID is required"
    );
  }


  if (
    !order.weight_kg ||
    Number(order.weight_kg) <= 0
  ) {
    throw new Error(
      "Weight is required"
    );
  }


  if (
    !order.payment_method ||
    order.payment_method.trim() === ""
  ) {
    throw new Error(
      "Payment method is required"
    );
  }


  if (
    order.amount_paid === undefined ||
    order.amount_paid === null ||
    Number(order.amount_paid) < 0
  ) {
    throw new Error(
      "Amount paid is required"
    );
  }

};



const validateOrderId = (id) => {

  if (!id) {
    throw new Error(
      "Order ID is required"
    );
  }

};



// ==========================
// CRUD FUNCTIONS
// ==========================


// Create Order
export const createOrder = (order) => {

  validateOrder(order);

  insertOrder(order);

  return "Order created successfully";

};



// Read Orders
export const readOrders = () => {

  return getOrders();

};



// Update Order
export const editOrder = (
  id,
  order
) => {

  validateOrderId(id);

  validateOrder(order);


  const updatedOrder =
    updateOrder(
      id,
      order
    );


  if (!updatedOrder) {
    throw new Error(
      "Order not found"
    );
  }


  return "Order updated successfully";

};



// ==========================
// ANALYTICS FUNCTIONS
// ==========================


export const getAnalytics = (
  period
) => {


  const validPeriods = [
    "weekly",
    "monthly",
    "yearly",
  ];



  if (!validPeriods.includes(period)) {
    throw new Error(
      "Unknown analytics period"
    );
  }



  const ordersData =
    getOrders();



  let labels;



  const currentYear =
    new Date().getFullYear();




  if (period === "weekly") {


    labels = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];



  } else if (
    period === "monthly"
  ) {


    labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];



  } else {


    labels = Array.from(
      {
        length: 5,
      },
      (_, index) =>
        String(
          currentYear - 4 + index
        )
    );

  }




  const orders =
    Array(
      labels.length
    ).fill(0);



  const revenue =
    Array(
      labels.length
    ).fill(0);





  ordersData
    .filter(
      (order) =>
        order.status &&
        order.status.toLowerCase() ===
        "completed"
    )
    .forEach(
      (order) => {


        const date =
          new Date(
            order.orderDate
          );



        let index = -1;




        if (
          period === "weekly"
        ) {


          const day =
            date.getDay();



          index =
            day === 0
              ? 6
              : day - 1;




        } else if (
          period === "monthly"
        ) {


          index =
            date.getMonth();




        } else {


          index =
            labels.indexOf(
              String(
                date.getFullYear()
              )
            );

        }




        if (
          index >= 0 &&
          index < labels.length
        ) {


          orders[index] += 1;



          revenue[index] +=
            Number(
              order.totalAmount
            );

        }


      }
    );





  return {
    labels,
    orders,
    revenue,
  };

};





// Analytics shortcuts

export const getWeeklyAnalytics =
  () =>
    getAnalytics(
      "weekly"
    );



export const getMonthlyAnalytics =
  () =>
    getAnalytics(
      "monthly"
    );



export const getYearlyAnalytics =
  () =>
    getAnalytics(
      "yearly"
    );