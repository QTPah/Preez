import Report from '../models/Report.js';

export const getAllUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ reportType: 'user' }).populate('targetId reportedBy', 'username');
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user reports', error: error.message });
  }
};

export const updateUserReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { action } = req.body;

    if (!['resolve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status: action === 'resolve' ? 'resolved' : 'rejected' },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user report status', error: error.message });
  }
};
