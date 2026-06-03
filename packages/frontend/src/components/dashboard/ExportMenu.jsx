import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

function ExportMenu({ chartRef, data, title, fileName }) {
  const handleExportImage = async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      canvas.toBlob((blob) => {
        saveAs(blob, `${fileName || title}.png`);
      });
    } catch (err) {
      console.error('Erro ao exportar imagem:', err);
    }
  };

  const handleExportCSV = () => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${fileName || title}.csv`);
  };

  return (
    <div className="export-menu">
      <button onClick={handleExportImage} title="Exportar como PNG">📷 PNG</button>
      <button onClick={handleExportCSV} title="Exportar dados como CSV">📄 CSV</button>
    </div>
  );
}

export default ExportMenu;