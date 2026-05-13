import express from 'express';
import asyncHandler from 'express-async-handler';
import { db } from '../config/firebase';
import { IContent } from '../models/Content';

const router = express.Router();
const contentRef = db.collection('content');

// @desc    Get all content
// @route   GET /api/content
router.get('/', asyncHandler(async (req, res) => {
  const snapshot = await contentRef.where('active', '==', true).get();
  const content = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
  
  // Sort in memory to avoid requiring a composite index in Firestore
  content.sort((a, b) => (a.order || 0) - (b.order || 0));
  
  res.json(content);
}));

// @desc    Create content
// @route   POST /api/content
router.post('/', asyncHandler(async (req, res) => {
  const { title, description, type, icon, value, imageUrl, order } = req.body;
  const newContent = {
    title,
    description,
    type,
    icon,
    value: value || null,
    imageUrl: imageUrl || null,
    order: order || 0,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Remove undefined fields to avoid Firestore errors
  Object.keys(newContent).forEach(key => (newContent as any)[key] === undefined && delete (newContent as any)[key]);
  
  const docRef = await contentRef.add(newContent);
  res.status(201).json({ id: docRef.id, ...newContent });
}));

// @desc    Update content
// @route   PUT /api/content/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const docRef = contentRef.doc(req.params.id);
  const doc = await docRef.get();
  
  if (doc.exists) {
    const data = doc.data() as IContent;
    const updateData: Partial<IContent> = {
      title: req.body.title || data.title,
      description: req.body.description || data.description,
      type: req.body.type || data.type,
      icon: req.body.icon !== undefined ? req.body.icon : data.icon,
      value: req.body.value !== undefined ? req.body.value : data.value,
      imageUrl: req.body.imageUrl !== undefined ? req.body.imageUrl : data.imageUrl,
      order: req.body.order !== undefined ? req.body.order : data.order,
      active: req.body.active !== undefined ? req.body.active : data.active,
      updatedAt: new Date()
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => (updateData as any)[key] === undefined && delete (updateData as any)[key]);

    await docRef.update(updateData as any);
    res.json({ id: doc.id, ...data, ...updateData });
  } else {
    res.status(404);
    throw new Error('Content not found');
  }
}));

// @desc    Delete content
// @route   DELETE /api/content/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const docRef = contentRef.doc(req.params.id);
  const doc = await docRef.get();
  
  if (doc.exists) {
    await docRef.delete();
    res.json({ message: 'Content removed' });
  } else {
    res.status(404);
    throw new Error('Content not found');
  }
}));

export default router;
