import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { OverflowContainer } from '../';

afterEach(function () {
  cleanup();
});

function renderContainer(labels: string[]) {
  return render(
    <OverflowContainer overflow={(hiddenCount) => <span>+{hiddenCount}</span>}>
      {labels.map((label) => (
        <span key={label}>{label}</span>
      ))}
    </OverflowContainer>,
  );
}

describe('overflow container', function () {
  it('renders all children without marking any as overflowing', () => {
    const output = renderContainer(['a', 'b', 'c']);

    expect(output.getByText('a')).toBeInTheDocument();
    expect(output.getByText('b')).toBeInTheDocument();
    expect(output.getByText('c')).toBeInTheDocument();
    expect(
      output.container.querySelectorAll('[data-overflowing]'),
    ).toHaveLength(0);
  });

  it('renders the worst-case overflow indicator only inside the hidden probe', () => {
    const output = renderContainer(['a', 'b', 'c']);

    const worstCase = output.getByText('+3');
    expect(worstCase.parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders no probe when there are no children', () => {
    const output = renderContainer([]);

    expect(output.container.querySelector('[aria-hidden="true"]')).toBeNull();
  });
});
