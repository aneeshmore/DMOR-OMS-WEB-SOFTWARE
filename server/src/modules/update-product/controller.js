import { updateProductRepository } from './repository.js';

export const getFinalGoods = async (req, res, next) => {
  try {
    const data = await updateProductRepository.getFinalGoods();
    res.json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFinalGood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await updateProductRepository.updateFinalGood(Number(id), req.body);
    res.json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getRawMaterials = async (req, res, next) => {
  try {
    const data = await updateProductRepository.getRawMaterials();
    res.json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRawMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await updateProductRepository.updateRawMaterial(Number(id), req.body);
    res.json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getPackagingMaterials = async (req, res, next) => {
  try {
    const data = await updateProductRepository.getPackagingMaterials();
    res.json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePackagingMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await updateProductRepository.updatePackagingMaterial(Number(id), req.body);
    res.json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};
