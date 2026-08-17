import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import type {
  FinancialMonthlyRevenue,
  FinancialPaymentMethod,
  FinancialTransactionType,
} from '@/types/financial';

export type FinancialReportData = {
  period: string;

  revenue: number;
  expenses: number;
  profit: number;
  averageTicket: number;
  appointments: number;

  transactions: {
    id: string;
    date: string;
    description: string;
    client: string;
    method: FinancialPaymentMethod;
    category: string;
    value: number;
    type: FinancialTransactionType;
  }[];

  monthlyRevenue: FinancialMonthlyRevenue[];

  appointmentsData: {
    date: string;
    client: string;
    service: string;
    value: number;
    status: string;
  }[];
};

const COLORS = {
  dark: [73, 58, 53] as [number, number, number],
  brown: [128, 101, 91] as [number, number, number],
  muted: [164, 138, 127] as [number, number, number],
  soft: [246, 237, 232] as [number, number, number],
  border: [235, 226, 221] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  green: [102, 128, 109] as [number, number, number],
};

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('pt-BR');
}

export function exportFinancialReport(data: FinancialReportData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(...COLORS.soft);
  doc.roundedRect(15, 15, pageWidth - 30, 38, 7, 7, 'F');

  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('MINEA', 22, 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('GESTÃO & BEM-ESTAR', 22, 30);

  doc.setTextColor(...COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Relatório financeiro', 22, 42);

  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Período: ${data.period}`, 22, 48);

  doc.setTextColor(...COLORS.brown);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - 22, 48, {
    align: 'right',
  });

  let y = 64;

  const cards = [
    ['FATURAMENTO', data.revenue],
    ['DESPESAS', data.expenses],
    ['LUCRO', data.profit],
    ['TICKET MÉDIO', data.averageTicket],
  ];

  const gap = 4;
  const cardWidth = (pageWidth - 30 - gap * 3) / 4;

  cards.forEach(([label, value], index) => {
    const x = 15 + index * (cardWidth + gap);

    doc.setFillColor(...COLORS.white);
    doc.setDrawColor(...COLORS.border);

    doc.roundedRect(x, y, cardWidth, 27, 5, 5, 'FD');

    doc.setTextColor(...COLORS.muted);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text(String(label), x + 5, y + 8);

    doc.setTextColor(...COLORS.dark);
    doc.setFontSize(11);
    doc.text(formatCurrency(Number(value)), x + 5, y + 19);
  });

  y += 38;

  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('INDICADORES', 15, y);

  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(13);
  doc.text('Resumo do período', 15, y + 8);

  y += 15;

  doc.setFillColor(...COLORS.soft);
  doc.roundedRect(15, y, pageWidth - 30, 22, 5, 5, 'F');

  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  doc.text('Agendamentos', 22, y + 8);
  doc.text('Ticket médio', 85, y + 8);
  doc.text('Receita líquida', 148, y + 8);

  doc.setTextColor(...COLORS.dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);

  doc.text(String(data.appointments), 22, y + 16);
  doc.text(formatCurrency(data.averageTicket), 85, y + 16);
  doc.text(formatCurrency(data.profit), 148, y + 16);

  y += 34;

  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('MOVIMENTAÇÕES', 15, y);

  doc.setTextColor(...COLORS.dark);
  doc.setFontSize(13);
  doc.text('Atendimentos do período', 15, y + 8);

  y += 13;

  autoTable(doc, {
    startY: y,

    margin: {
      left: 15,
      right: 15,
    },

    head: [['Data', 'Cliente', 'Serviço', 'Status', 'Valor']],

    body: data.appointmentsData.map((appointment) => [
      formatDate(appointment.date),
      appointment.client,
      appointment.service,
      appointment.status,
      formatCurrency(appointment.value),
    ]),

    theme: 'plain',

    styles: {
      font: 'helvetica',
      fontSize: 8,
      textColor: COLORS.dark,
      cellPadding: 4,
      lineColor: COLORS.border,
      lineWidth: 0.2,
    },

    headStyles: {
      fillColor: COLORS.soft,
      textColor: COLORS.brown,
      fontStyle: 'bold',
      fontSize: 7,
    },

    alternateRowStyles: {
      fillColor: [252, 249, 247],
    },

    columnStyles: {
      0: { cellWidth: 23 },
      1: { cellWidth: 38 },
      2: { cellWidth: 62 },
      3: { cellWidth: 30 },
      4: {
        halign: 'right',
        cellWidth: 28,
      },
    },

    didParseCell: (hookData) => {
      if (hookData.section === 'body' && hookData.column.index === 3) {
        const status = String(hookData.cell.raw);

        if (status.toLowerCase().includes('conclu')) {
          hookData.cell.styles.textColor = COLORS.green;
          hookData.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  const finalY =
    (
      doc as jsPDF & {
        lastAutoTable?: {
          finalY: number;
        };
      }
    ).lastAutoTable?.finalY ?? y;

  const totalY = finalY + 12;

  if (totalY < pageHeight - 35) {
    doc.setFillColor(...COLORS.dark);

    doc.roundedRect(15, totalY, pageWidth - 30, 24, 5, 5, 'F');

    doc.setTextColor(...COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);

    doc.text('TOTAL DO PERÍODO', 22, totalY + 9);

    doc.setFontSize(13);

    doc.text(formatCurrency(data.revenue), pageWidth - 22, totalY + 10, { align: 'right' });
  }

  const pages = doc.getNumberOfPages();

  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);

    doc.setDrawColor(...COLORS.border);

    doc.line(15, pageHeight - 17, pageWidth - 15, pageHeight - 17);

    doc.setTextColor(...COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);

    doc.text('Minea · Gestão & Bem-estar', 15, pageHeight - 10);

    doc.text(`Página ${page} de ${pages}`, pageWidth - 15, pageHeight - 10, { align: 'right' });
  }

  const filename = `relatorio-financeiro-${new Date().toISOString().slice(0, 10)}.pdf`;

  doc.save(filename);
}
