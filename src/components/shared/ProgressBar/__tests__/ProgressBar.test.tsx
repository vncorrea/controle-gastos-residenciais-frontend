import { render, screen } from '@testing-library/react';
import { ProgressBar } from '@/components/shared/ProgressBar';

describe('ProgressBar', () => {
  it('mostra label e clamp em 0-100', () => {
    render(<ProgressBar percentage={150} showLabel />);
    expect(screen.getByText('100.0%')).toBeInTheDocument();
  });

  it('altera cor customizada no estilo inline', () => {
    const { container } = render(<ProgressBar percentage={50} color="#ff0000" showLabel={false} />);
    const fill = container.querySelector('.progress-bar-fill') as HTMLElement;
    expect(fill).toHaveStyle({ width: '50%', backgroundColor: '#ff0000' });
  });
});

