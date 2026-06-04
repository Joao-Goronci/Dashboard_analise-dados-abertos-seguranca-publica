import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

function ExportPageButton({ pageRef, pageTitle, pageData, additionalData = {}, compact = false }) {
  const handleExportPNG = async () => {
    if (!pageRef || !pageRef.current) return;
    try {
      const canvas = await html2canvas(pageRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      });
      canvas.toBlob((blob) => {
        saveAs(blob, `${pageTitle || 'pagina'}.png`);
      });
    } catch (err) {
      console.error('Erro ao exportar PNG:', err);
      alert('Erro ao gerar imagem. Tente novamente.');
    }
  };

  const handleExportCSV = () => {
    // Coleta todos os dados relevantes da página
    const allData = [];

    // Adiciona KPIs (se existirem)
    if (pageData?.kpis) {
      allData.push({ tipo: 'KPIs', ...pageData.kpis });
    }

    // Adiciona séries de dados fornecidas em additionalData
    Object.entries(additionalData).forEach(([key, dataArray]) => {
      if (dataArray && dataArray.length) {
        dataArray.forEach(item => {
          allData.push({ tipo: key, ...item });
        });
      }
    });

    // Se não houver dados estruturados, tenta extrair do pageData comum
    if (allData.length === 0 && pageData) {
      // Tenta pegar arrays comuns
      const possibleKeys = ['crimesPorMes', 'crimesPorMunicipio', 'topBairros', 'objetosMaisRoubados', 'perfilVitimas'];
      possibleKeys.forEach(key => {
        if (pageData[key] && Array.isArray(pageData[key])) {
          pageData[key].forEach(item => {
            allData.push({ tipo: key, ...item });
          });
        }
      });
    }

    if (allData.length === 0) {
      alert('Nenhum dado disponível para exportar.');
      return;
    }

    // Converte para CSV
    const headers = Object.keys(allData[0]).join(',');
    const rows = allData.map(row => Object.values(row).map(value => 
      typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    ).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${pageTitle || 'pagina'}.csv`);
  };

  return (
    <div className={`export-page-buttons ${compact ? 'compact' : ''}`}>
      <button onClick={handleExportPNG} title="Exportar página como imagem">📸 PNG</button>
      <button onClick={handleExportCSV} title="Exportar todos os dados como CSV">📊 CSV</button>
    </div>
  );
}

export default ExportPageButton;