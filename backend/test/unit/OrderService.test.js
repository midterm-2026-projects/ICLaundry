import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import * as orderModel from "../../models/OrderModel.js";

import {
  createOrder,
  readOrders,
  editOrder,
} from "../../services/OrderService.js";

import {
  createOrder,
  readOrders,
  editOrder,
  getAnalytics,
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getYearlyAnalytics,
} from "../../services/OrderService.js";


vi.mock("../../models/OrderModel.js", () => {

  let orders = [];

  const resetOrders = (newOrders = []) => {
    orders = structuredClone(newOrders);
  };


  const insertOrder = vi.fn((order) => {

    const newOrder = {
      id: orders.length + 1,
      ...order,
    };

    orders.push(newOrder);

    return newOrder;

  });


  const getOrders = vi.fn(() => {
    return orders;
  });


  const updateOrder = vi.fn(
    (id, updatedOrder) => {

      const orderIndex =
        orders.findIndex(
          (order) =>
            order.id === Number(id)
        );


      if (orderIndex === -1) {
        return null;
      }


      orders[orderIndex] = {
        ...orders[orderIndex],
        ...updatedOrder,
      };


      return orders[orderIndex];

    }
  );


  return {
    resetOrders,
    insertOrder,
    getOrders,
    updateOrder,
  };

});


describe("Order Module Tests", () => {


  beforeEach(() => {

    orderModel.resetOrders([
      {
        id: 1,
        customer_id: 1,
        weight_kg: 5,
        payment_method: "Cash",
        amount_paid: 500,
        orderDate: new Date("2026-07-06"),
        totalAmount: 500,
        status: "Completed",
      },
    ]);


    vi.clearAllMocks();

  });



  describe("Create Order", () => {


    it("It should create an order successfully", () => {


      // Arrange
      const order = {
        customer_id: 2,
        weight_kg: 3,
        payment_method: "GCash",
        amount_paid: 300,
      };


      // Act
      const result =
        createOrder(order);



      // Assert
      expect(result).toBe(
        "Order created successfully"
      );


      expect(
        orderModel.insertOrder
      ).toHaveBeenCalledTimes(1);


    });



    it("It should throw error when customer ID is missing", () => {


      // Arrange
      const order = {
        weight_kg: 5,
        payment_method: "Cash",
        amount_paid: 500,
      };


      // Act
      const action = () =>
        createOrder(order);



      // Assert
      expect(action).toThrow(
        "Customer ID is required"
      );


    });



    it("It should throw error when weight is invalid", () => {


      // Arrange
      const order = {
        customer_id: 1,
        weight_kg: 0,
        payment_method: "Cash",
        amount_paid: 500,
      };


      // Act
      const action = () =>
        createOrder(order);



      // Assert
      expect(action).toThrow(
        "Weight is required"
      );


    });



    it("It should throw error when payment method is missing", () => {


      // Arrange
      const order = {
        customer_id: 1,
        weight_kg: 5,
        payment_method: "",
        amount_paid: 500,
      };


      // Act
      const action = () =>
        createOrder(order);



      // Assert
      expect(action).toThrow(
        "Payment method is required"
      );


    });



    it("It should throw error when amount paid is invalid", () => {


      // Arrange
      const order = {
        customer_id: 1,
        weight_kg: 5,
        payment_method: "Cash",
        amount_paid: -100,
      };


      // Act
      const action = () =>
        createOrder(order);



      // Assert
      expect(action).toThrow(
        "Amount paid is required"
      );


    });


  });

    describe("Read Orders", () => {


    it("It should retrieve all order records", () => {


      // Act
      const orders =
        readOrders();



      // Assert
      expect(orders).toHaveLength(1);


      expect(orders[0]).toEqual({
        id: 1,
        customer_id: 1,
        weight_kg: 5,
        payment_method: "Cash",
        amount_paid: 500,
        orderDate: new Date("2026-07-06"),
        totalAmount: 500,
        status: "Completed",
      });


    });



    it("It should return an empty order list when there are no records", () => {


      // Arrange
      orderModel.resetOrders([]);



      // Act
      const orders =
        readOrders();



      // Assert
      expect(orders).toEqual([]);

      expect(orders).toHaveLength(0);


    });



    it("It should display a newly created order after saving", () => {


      // Arrange
      createOrder({
        customer_id: 2,
        weight_kg: 8,
        payment_method: "GCash",
        amount_paid: 800,
        orderDate: new Date("2026-07-07"),
        totalAmount: 800,
        status: "Pending",
      });



      // Act
      const orders =
        readOrders();



      // Assert
      expect(orders).toHaveLength(2);


      expect(orders[1]).toEqual({
        id: 2,
        customer_id: 2,
        weight_kg: 8,
        payment_method: "GCash",
        amount_paid: 800,
        orderDate: new Date("2026-07-07"),
        totalAmount: 800,
        status: "Pending",
      });


    });



  });



  describe("Update Order", () => {



    it("It should update an existing order successfully", () => {


      // Arrange
      const updatedOrder = {
        customer_id: 1,
        weight_kg: 10,
        payment_method: "GCash",
        amount_paid: 1000,
        orderDate: new Date("2026-07-08"),
        totalAmount: 1000,
        status: "Ready",
      };



      // Act
      const result =
        editOrder(
          1,
          updatedOrder
        );


      const orders =
        orderModel.getOrders();



      // Assert
      expect(result).toBe(
        "Order updated successfully"
      );


      expect(orders[0]).toEqual({
        id: 1,
        ...updatedOrder,
      });


    });



    it("It should update only the selected order", () => {


      // Arrange
      orderModel.resetOrders([
        {
          id: 1,
          customer_id: 1,
          weight_kg: 5,
          payment_method: "Cash",
          amount_paid: 500,
          status: "Pending",
        },
        {
          id: 2,
          customer_id: 2,
          weight_kg: 8,
          payment_method: "GCash",
          amount_paid: 800,
          status: "Washing",
        },
      ]);



      const updatedOrder = {
        customer_id: 1,
        weight_kg: 6,
        payment_method: "Cash",
        amount_paid: 600,
        status: "Ready",
      };



      // Act
      editOrder(
        1,
        updatedOrder
      );


      const orders =
        orderModel.getOrders();



      // Assert
      expect(orders[0].status)
        .toBe("Ready");


      expect(orders[1]).toEqual({
        id: 2,
        customer_id: 2,
        weight_kg: 8,
        payment_method: "GCash",
        amount_paid: 800,
        status: "Washing",
      });


    });



    it("It should throw error when order ID is missing", () => {


      // Arrange
      const updatedOrder = {
        customer_id: 1,
        weight_kg: 5,
        payment_method: "Cash",
        amount_paid: 500,
      };



      // Act
      const action = () =>
        editOrder(
          "",
          updatedOrder
        );



      // Assert
      expect(action).toThrow(
        "Order ID is required"
      );


    });



    it("It should throw error when updating a non-existing order", () => {


      // Arrange
      const updatedOrder = {
        customer_id: 99,
        weight_kg: 5,
        payment_method: "Cash",
        amount_paid: 500,
      };



      // Act
      const action = () =>
        editOrder(
          999,
          updatedOrder
        );



      // Assert
      expect(action).toThrow(
        "Order not found"
      );


    });



  });

    describe("Order Analytics", () => {


    it("It should throw an error for an invalid analytics period", () => {


      // Arrange


      // Act
      const action = () =>
        getAnalytics("invalid");



      // Assert
      expect(action).toThrow(
        "Unknown analytics period"
      );


    });



    it("It should return weekly analytics correctly", () => {


      // Arrange
      orderModel.resetOrders([
        {
          id: 1,
          orderDate: new Date("2026-07-06"),
          totalAmount: 400,
          status: "Completed",
        },
        {
          id: 2,
          orderDate: new Date("2026-07-07"),
          totalAmount: 110,
          status: "Completed",
        },
        {
          id: 3,
          orderDate: new Date("2026-07-08"),
          totalAmount: 260,
          status: "Completed",
        },
      ]);



      // Act
      const result =
        getWeeklyAnalytics();



      // Assert
      expect(result.labels).toEqual([
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
      ]);



      expect(result.orders).toEqual([
        1,
        1,
        1,
        0,
        0,
        0,
        0,
      ]);



      expect(result.revenue).toEqual([
        400,
        110,
        260,
        0,
        0,
        0,
        0,
      ]);


    });



    it("It should return monthly analytics correctly", () => {


      // Arrange
      orderModel.resetOrders([
        {
          id: 1,
          orderDate: new Date("2026-01-10"),
          totalAmount: 8000,
          status: "Completed",
        },
        {
          id: 2,
          orderDate: new Date("2026-02-12"),
          totalAmount: 9500,
          status: "Completed",
        },
      ]);



      // Act
      const result =
        getMonthlyAnalytics();



      // Assert
      expect(result.orders).toEqual([
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ]);



      expect(result.revenue).toEqual([
        8000,
        9500,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ]);


    });



    it("It should return yearly analytics correctly", () => {


      // Arrange
      const currentYear =
        new Date().getFullYear();



      orderModel.resetOrders([
        {
          id: 1,
          orderDate: new Date(
            `${currentYear - 1}-05-10`
          ),
          totalAmount: 60000,
          status: "Completed",
        },
        {
          id: 2,
          orderDate: new Date(
            `${currentYear}-05-10`
          ),
          totalAmount: 112000,
          status: "Completed",
        },
      ]);



      // Act
      const result =
        getYearlyAnalytics();



      // Assert
      expect(result.labels)
        .toContain(
          String(currentYear - 1)
        );



      expect(result.labels)
        .toContain(
          String(currentYear)
        );



      expect(result.revenue)
        .toContain(60000);



      expect(result.revenue)
        .toContain(112000);


    });

        it("It should ignore orders that are not completed", () => {


      // Arrange
      orderModel.resetOrders([
        {
          id: 1,
          orderDate: new Date("2026-01-10"),
          totalAmount: 300,
          status: "Pending",
        },
        {
          id: 2,
          orderDate: new Date("2026-01-11"),
          totalAmount: 700,
          status: "Completed",
        },
      ]);



      // Act
      const result =
        getMonthlyAnalytics();



      // Assert
      expect(result.orders[0])
        .toBe(1);


      expect(result.revenue[0])
        .toBe(700);


      expect(result.revenue[0])
        .not.toBe(300);


    });


  });

///////
});