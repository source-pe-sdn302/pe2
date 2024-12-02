const express = require("express");
const db = require("../models");

const ApiRouter = express.Router();

// Create user

ApiRouter.get("/employee/list", async (req, res, next) => {
  try {
    const employees = await db.Employee.find()
      .populate("department")
      .populate("jobs")
      .populate("manager");
    const r = employees.map((e) => {
      return {
        employeeId: e._id,
        fullname:
          e.name.firstName + " " + e.name.middleName + " " + e.name.lastName,
        email: e.account.email,
        department: e.department.name,
        jobs: e.jobs.map((j) => {
          return {
            name: j.name,
            issues: j.issues.map((i) => {
              return {
                title: i.title,
                isCompleted: i.isCompleted,
              };
            }),
          };
        }),
      };
    });
    res.status(200).json(r);
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
});

ApiRouter.get("/department/:departmentId", async (req, res, next) => {
  try {
    const departmentId = req.params.departmentId;
    const department = await db.Department.findById(departmentId);
    const departmentName = department.name;
    const manager = await (
      await db.Employee.find()
    ).filter((e) => e.manager == null && e.department == departmentId);
    const managerName = manager.map(
      (e) => e.name.firstName + " " + e.name.middleName + " " + e.name.lastName
    )[0];
    const employees = await db.Employee.find({
      department: departmentId,
      manager: manager[0]._id,
    });
    const r = {
      department: departmentName,
      manager: managerName,
      employees: employees.map((e) => {
        return {
          id: e._id,
          fullname:
            e.name.firstName + " " + e.name.middleName + " " + e.name.lastName,
        };
      }),
    };
    res.status(200).json(r);
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
});

ApiRouter.post("/department/create", async (req, res, next) => {
  try {
    const data = req.body;
    const employees = data.employees;
    const newDepartment = await db.Department.create({
      name: data.name,
      description: data.description,
    });
    const employeeCretead = await db.Employee.insertMany(employees);
    const employeeUpdateed = await db.Employee.updateMany(
      { _id: { $in: employeeCretead.map((e) => e._id) } },
      { $set: { department: newDepartment._id } }
    );
    const employeeFound = await db.Employee.find({
      department: newDepartment._id,
    });
    res.status(200).json({
      message: "Department created successfully",
      result: {
        departmentId: newDepartment._id,
        departmentName: newDepartment.name,
        employees: employeeFound.map((e) => {
          return {
            name:
              e.name.firstName +
              " " +
              e.name.middleName +
              " " +
              e.name.lastName,
          };
        }),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        message: error.message,
      },
    });
  }
});
module.exports = ApiRouter;
