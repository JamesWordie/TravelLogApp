const Destination = require("../models/Destination");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllDestinations = async (req, res) => {
  const destinations = await Destination.find().sort("createdAt");
  res.status(StatusCodes.OK).json({ destinations });
};

const getADestination = async (req, res) => {
  const destinationId = req.params.id;

  const destination = await Destination.findOne({
    _id: destinationId,
  });

  if (!destination) {
    throw new NotFoundError(`No destination with Id: ${destinationId}`);
  }
  res.status(StatusCodes.OK).json({ destination });
};

const createADestination = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const destination = await Destination.create(req.body);
  res.status(StatusCodes.CREATED).json({ destination });
};

const updateADestination = async (req, res) => {
  // Destructure out the user and destination
  const {
    user: { userId },
    params: { id: destinationId },
    body: { name },
  } = req;

  if (name === "") {
    throw new BadRequestError("Name field cannot be empty");
  }

  const destination = await Destination.findByIdAndUpdate(
    {
      _id: destinationId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );

  if (!destination) {
    throw new NotFoundError(`No destination with Id: ${destinationId}`);
  }
  res.status(StatusCodes.OK).json({ destination });
};

const deleteADestination = async (req, res) => {
  const {
    user: { userId },
    params: { id: destinationId },
  } = req;

  const destination = await Destination.findOneAndRemove({
    _id: destinationId,
    createdBy: userId,
  });

  if (!destination) {
    throw new NotFoundError(`No destination with Id: ${destinationId}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllDestinations,
  getADestination,
  createADestination,
  updateADestination,
  deleteADestination,
};
