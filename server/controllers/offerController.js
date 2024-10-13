import Offer from '../models/Offer.js';
import Report from '../models/Report.js';

export const getAllOfferReports = async (req, res) => {
  try {
    const reports = await Report.find({ type: 'offer' }).populate('targetId reportedBy', 'title username');
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching offer reports', error: error.message });
  }
};

export const updateOfferReportStatus = async (req, res) => {
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
    res.status(500).json({ success: false, message: 'Error updating offer report status', error: error.message });
  }
};
