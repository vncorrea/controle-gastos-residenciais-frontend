import { formatCurrency } from '@/utils/formatters';

describe('formatCurrency', () => {
  it('formata valores positivos em BRL', () => {
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
  });

  it('formata zero corretamente', () => {
    expect(formatCurrency(0)).toBe('R$ 0,00');
  });

  it('formata valores negativos em BRL', () => {
    expect(formatCurrency(-10)).toBe('-R$ 10,00');
  });
});

