const ComboPackage = require('@models/ComboPackage');
const User = require('@models/User');
const response = require('../responses');

module.exports = {
  // ── Admin: package CRUD ────────────────────────────────────────────────────

  createPackage: async (req, res) => {
    try {
      const { name, description, price, driving_lessons, course_lessons } = req.body;
      if (!name || price == null || driving_lessons == null || course_lessons == null) {
        return res.status(400).json({ message: 'name, price, driving_lessons, course_lessons are required' });
      }
      const pkg = await ComboPackage.create({ name, description, price, driving_lessons, course_lessons });
      return response.ok(res, pkg);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  updatePackage: async (req, res) => {
    try {
      const { id, ...fields } = req.body;
      if (!id) return res.status(400).json({ message: 'id is required' });
      const pkg = await ComboPackage.findByIdAndUpdate(id, { $set: fields }, { new: true });
      if (!pkg) return res.status(404).json({ message: 'Package not found' });
      return response.ok(res, pkg);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  deletePackage: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ message: 'id is required' });
      await ComboPackage.findByIdAndDelete(id);
      return response.ok(res, { message: 'Package deleted' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  togglePackageActive: async (req, res) => {
    try {
      const { id, isActive } = req.body;
      if (!id || isActive === undefined) return res.status(400).json({ message: 'id and isActive required' });
      const pkg = await ComboPackage.findByIdAndUpdate(id, { $set: { isActive } }, { new: true });
      if (!pkg) return res.status(404).json({ message: 'Package not found' });
      return response.ok(res, pkg);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // ── Public: list packages ──────────────────────────────────────────────────

  getPackages: async (req, res) => {
    try {
      const { all } = req.query;
      const filter = all === 'true' ? {} : { isActive: true };
      const packages = await ComboPackage.find(filter).sort({ price: 1 });
      return response.ok(res, packages);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // ── User: purchase a package ───────────────────────────────────────────────

  purchasePackage: async (req, res) => {
    try {
      const { package_id } = req.body;
      if (!package_id) return res.status(400).json({ message: 'package_id is required' });

      const pkg = await ComboPackage.findById(package_id);
      if (!pkg || !pkg.isActive) return res.status(404).json({ message: 'Package not found or inactive' });

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            'combo.package_id': pkg._id,
            'combo.package_name': pkg.name,
            'combo.purchased_at': new Date(),
          },
          $inc: {
            'combo.driving_lessons_remaining': pkg.driving_lessons,
            'combo.course_lessons_remaining': pkg.course_lessons,
          },
        },
        { new: true, select: '-password' },
      );

      return response.ok(res, { combo: user.combo, message: 'Package purchased successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // ── User: get my combo balance ─────────────────────────────────────────────

  getMyCombo: async (req, res) => {
    try {
      const user = await User.findById(req.user.id, 'combo').populate('combo.package_id', 'name price driving_lessons course_lessons');
      return response.ok(res, user?.combo || {});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // ── Internal: deduct one lesson (called during booking) ───────────────────

  useLesson: async (req, res) => {
    try {
      const { lesson_type } = req.body; // 'driving' | 'course'
      if (!['driving', 'course'].includes(lesson_type)) {
        return res.status(400).json({ message: "lesson_type must be 'driving' or 'course'" });
      }

      const field = lesson_type === 'driving'
        ? 'combo.driving_lessons_remaining'
        : 'combo.course_lessons_remaining';

      const user = await User.findById(req.user.id, 'combo');
      const remaining = lesson_type === 'driving'
        ? user?.combo?.driving_lessons_remaining
        : user?.combo?.course_lessons_remaining;

      if (!remaining || remaining <= 0) {
        return res.status(400).json({ message: 'No lessons remaining in combo package' });
      }

      const updated = await User.findByIdAndUpdate(
        req.user.id,
        { $inc: { [field]: -1 } },
        { new: true, select: 'combo' },
      );

      return response.ok(res, { combo: updated.combo, message: 'Lesson used successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};
