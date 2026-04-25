import React from 'react';
import * as XLSX from 'xlsx';
import { useTranslation } from 'react-i18next';

const ExcelExportBtn = ({ data, fileName = "export", className, title }) => {
    const { t } = useTranslation();
    const buttonTitle = title || t('export.button');

    const handleExport = () => {
        if (!data || data.length === 0) {
            alert(t('export.noData'));
            return;
        }

        // 1. Çalışma Kitabı Oluştur
        const wb = XLSX.utils.book_new();

        // 2. Veriyi Çalışma Sayfasına Çevir
        const ws = XLSX.utils.json_to_sheet(data);

        // 3. Sütun Genişliklerini Ayarla (Opsiyonel - Daha şık görünüm için)
        const wscols = Object.keys(data[0]).map(() => ({ wch: 20 }));
        ws['!cols'] = wscols;

        // 4. Sayfayı Kitaba Ekle
        XLSX.utils.book_append_sheet(wb, ws, t('export.sheetName'));

        // 5. Dosyayı İndir
        XLSX.writeFile(wb, `${fileName}_${new Date().toLocaleDateString()}.xlsx`);
    };

    return (
        <button
            onClick={handleExport}
            className={className || "px-4 py-2.5 bg-background-dark border border-border-dark rounded-lg text-text-muted hover:text-white transition-all flex items-center gap-2 text-sm font-medium"}
        >
            <span className="material-symbols-outlined text-lg">download</span>
            <span>{buttonTitle}</span>
        </button>
    );
};

export default ExcelExportBtn;