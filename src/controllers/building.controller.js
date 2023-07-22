const httpStatus = require("http-status");
const SuccessResponse = require("../utils/success");
const catchAsync = require("../utils/catchAsync");
const pick = require("../utils/pick");
const BuildingService = require("../services/building.service");

class BuildingController {
  createBuilding = catchAsync(async (req, res) => {
    const building = await BuildingService.createBuilding(req.body);
    SuccessResponse.send(res, {
      statusCode: httpStatus.CREATED,
      message: "Create new building successful",
      metadata: {
        building,
      },
    });
  });
  updateBuilding = catchAsync(async (req, res) => {
    const building = await BuildingService.updateBuildingById(req.params.buildingId, req.body);
    SuccessResponse.send(res, {
      message: "Update building successful",
      metadata: {
        building,
      },
    });
  });
  getBuildings = catchAsync(async (req, res) => {
    const filter = pick(req.query, ["name"]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const { results } = await BuildingService.queryBuildings(filter, options);
    SuccessResponse.send(res, {
      message: "Get list building successful",
      metadata: {
        buildings: results,
      },
    });
  });
  getBuilding = catchAsync(async (req, res) => {
    const building = await BuildingService.getBuildingById(req.params.buildingId);
    if (!building) {
      throw new ApiError(httpStatus.NOT_FOUND, "Building not found");
    }
    SuccessResponse.send(res, {
      message: "Get building successful",
      metadata: {
        building,
      },
    });
  });
  deleteBuilding = catchAsync(async (req, res) => {
    await BuildingService.deleteBuildingById(req.params.buildingId);
    SuccessResponse.send(res, {
      message: "Delete building successful",
      metadata: {
        buildingId: req.params.buildingId,
      },
    });
  });
}

module.exports = new BuildingController();
