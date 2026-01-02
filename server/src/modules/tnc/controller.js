import { TncService } from './service.js';

const service = new TncService();

export const createTnc = async (req, res, next) => {
  try {
    const data = await service.createTnc(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getAllTnc = async (req, res, next) => {
  try {
    const data = await service.getAllTnc();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateTnc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await service.updateTnc(Number(id), req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteTnc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await service.deleteTnc(Number(id));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
