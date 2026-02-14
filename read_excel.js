import XLSX from 'xlsx';
import fs from 'fs';

const filePath = 'c:\\Users\\GL_Amal\\Downloads\\products_export_2026-02-14.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const categoryStats = {};

    data.forEach(item => {
        const cats = [item.Category, item['Sub Category'], item['Sub Sub Category']];
        cats.forEach(c => {
            if (!c) return;
            if (!categoryStats[c]) {
                categoryStats[c] = {
                    raw: c,
                    hex: Array.from(c).map(char => char.charCodeAt(0).toString(16).padStart(4, '0')).join(' '),
                    count: 0
                };
            }
            categoryStats[c].count++;
        });
    });

    fs.writeFileSync('category_stats.json', JSON.stringify(categoryStats, null, 2));
    console.log('Category stats written to category_stats.json');

    const filteredData = data.map(item => ({
        Name: item.Name,
        Category: item.Category,
        SubCategory: item['Sub Category'],
        SubSubCategory: item['Sub Sub Category']
    }));

    fs.writeFileSync('excel_data.json', JSON.stringify(filteredData, null, 2));
    console.log('Filtered data written to excel_data.json');
} catch (error) {
    console.error('Error reading excel file:', error.message);
}
