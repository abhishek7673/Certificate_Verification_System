import xlsx from "xlsx";
import PDFDocument from 'pdfkit';
import Certificate from '../models/certificateModel.js';

export const generateCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;
        console.log(certificateId)
        const certificate = await Certificate.findOne({ certificateId });

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        const doc = new PDFDocument();
        let filename = `Certificate-${certificateId}.pdf`;
        filename = encodeURIComponent(filename);

        // Set headers to display the PDF in a new window
        res.setHeader('Content-disposition', `inline; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.fontSize(25).text('Certificate of Completion', { align: 'center' });
        doc.moveDown();
        doc.fontSize(20).text(`This is to certify that`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(20).text(`${certificate.studentName}`, { align: 'center', underline: true });
        doc.moveDown();
        doc.fontSize(20).text(`has successfully completed the internship in`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(20).text(`${certificate.domain}`, { align: 'center', underline: true });
        doc.moveDown();
        doc.fontSize(20).text(`from ${new Date(certificate.startDate).toLocaleDateString()} to ${new Date(certificate.endDate).toLocaleDateString()}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(20).text(`Duration: ${certificate.duration} months`, { align: 'center' });

        doc.end();
        doc.pipe(res);
    } catch (error) {
        res.status(500).json({ message: 'Error generating certificate', error });
    }
};

export const fileUpload = async (req, res) => {
    try {
        const filePath = req.file.path;

        const workbook = xlsx.readFile(filePath, { cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        let jsonData = xlsx.utils.sheet_to_json(worksheet);

        const mapKeys = (row) => {
            return {
                certificateId: row["Certificate ID"],
                studentName: row.Name,
                domain: row.Domain,
                duration: row.Duration,
                startDate: row["Start Date"],
                endDate: row["End Date"],
            };
        };

        const transformedData = jsonData.map(mapKeys);

        console.log(transformedData)

        await Certificate.insertMany(transformedData);

        res.status(200).json({ message: 'Data uploaded and stored successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing the file' });
    }
};