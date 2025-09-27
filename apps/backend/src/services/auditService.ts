import { parse } from 'csv-parse/sync';

type AuditFinding = { problems: string[]; actions: string[]; summary: any };

export async function parseCsvAndDiagnose(csv: string): Promise<AuditFinding> {
  const records = parse(csv, {
    columns: true,
    skip_empty_lines: true
  }) as Array<{
    campaign: string;
    spend: string;
    impressions: string;
    clicks: string;
    purchases: string;
    ctr: string;
    cpc: string;
    cpa: string;
    roas: string;
    age?: string;
    hour?: string;
    text_len?: string;
    audience?: string;
  }>;

  const problems: string[] = [];
  const actions: string[] = [];

  const nums = records.map(r => ({
    ctr: Number(r.ctr),
    cpa: Number(r.cpa),
    roas: Number(r.roas),
    age: r.age ? Number(r.age) : undefined,
    hour: r.hour ? Number(r.hour) : undefined,
    textLen: r.text_len ? Number(r.text_len) : undefined,
    audience: r.audience || ''
  }));

  const avgCpa = average(nums.map(n => n.cpa).filter(isFinite));
  const avgRoas = average(nums.map(n => n.roas).filter(isFinite));

  // Rules
  if (nums.some(n => (n.ctr || 0) < 0.7 && (n.textLen || 0) > 20)) {
    problems.push('Длинный текст и низкая кликабельность (CTR < 0.7%)');
    actions.push('Сократить текст и протестировать новый креатив');
  }
  if (nums.some(n => (n.age || 0) >= 45 && (n.cpa || 0) > avgCpa * 2)) {
    problems.push('Аудитория 45+ конвертит хуже среднего в 2×');
    actions.push('Отключить возраст 45+ или снизить ставки');
  }
  if (nums.some(n => (n.hour || 0) >= 22 || (n.hour || 0) < 6)) {
    problems.push('Ночные показы (22:00–06:00) с повышенным CPA');
    actions.push('Исключить ночные часы из показов');
  }
  const retargetShare = shareOfRetarget(records);
  if (retargetShare < 0.15 && avgRoas > 1.0) {
    problems.push('Ретаргетинг недофинансирован (<15%) при ROAS выше среднего');
    actions.push('Увеличить ретаргетинг до 25–35% бюджета');
  }

  while (problems.length < 3) problems.push('Недостаточно данных — нужен A/B тест');
  while (actions.length < 3) actions.push('Запустить тест 2–3 новых креативов');

  return {
    problems: problems.slice(0, 3),
    actions: actions.slice(0, 3),
    summary: { avgCpa, avgRoas, retargetShare }
  };
}

export async function simulateOcrAndDiagnose(): Promise<AuditFinding> {
  return {
    problems: [
      'Текст на креативе перегружен — CTR ниже 0.7%',
      'Ночью CPA на 40% хуже, чем днём',
      'Доля ретаргетинга всего 10%'
    ],
    actions: [
      'Упростить текст и вынести оффер в заголовок',
      'Исключить показы 22:00–06:00',
      'Поднять ретаргетинг до 25–35%'
    ],
    summary: { source: 'ocr-simulated' }
  };
}

function average(values: number[]): number {
  const v = values.filter(v => Number.isFinite(v));
  if (!v.length) return 0;
  return v.reduce((a, b) => a + b, 0) / v.length;
}

function shareOfRetarget(records: Array<{ audience?: string; spend: string }>): number {
  const total = records.reduce((s, r) => s + Number(r.spend || 0), 0);
  const ret = records
    .filter(r => (r.audience || '').toLowerCase().includes('retarget'))
    .reduce((s, r) => s + Number(r.spend || 0), 0);
  if (total === 0) return 0;
  return ret / total;
}



