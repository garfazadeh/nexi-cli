import { writeFile } from 'fs';
import { Parser } from 'json2csv';

export default function writeCsv(filename, content, fields) {
	// Write to CSV file
	// Convert responses to CSV format using the defined fields
	const json2csvParser = new Parser({ fields });
	const csv = json2csvParser.parse(content);
	const finalContent = `sep=,\n${csv}`;
	writeFile(filename, finalContent, 'utf8', (err) => {
		if (err) {
			console.error('Error writing to CSV file:', err);
		} else {
			console.log('Responses saved to responses.csv');
		}
	});
}

