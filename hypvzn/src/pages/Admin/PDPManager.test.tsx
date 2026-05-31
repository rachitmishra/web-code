import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import PDPManager from './PDPManager';
import { useLoaderData, useSubmit, useActionData } from 'react-router';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: vi.fn(),
    useSubmit: vi.fn(),
    useActionData: vi.fn(),
  };
});

describe('PDPManager', () => {
  const mockLayout = {
    plugins: [
      { id: '1', type: 'ImageGallery', visible: true },
      { id: '2', type: 'ProductInfo', visible: false }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useLoaderData as any).mockReturnValue({ layout: mockLayout });
    (useSubmit as any).mockReturnValue(vi.fn());
    (useActionData as any).mockReturnValue(null);
  });

  it('renders plugin list from layout', () => {
    render(<MemoryRouter><PDPManager /></MemoryRouter>);
    expect(screen.getByText('ImageGallery')).toBeInTheDocument();
    expect(screen.getByText('ProductInfo')).toBeInTheDocument();
  });

  it('toggles visibility when checkbox is clicked', () => {
    render(<MemoryRouter><PDPManager /></MemoryRouter>);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();

    fireEvent.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
  });

  it('reorders plugins when move buttons are clicked', () => {
    render(<MemoryRouter><PDPManager /></MemoryRouter>);
    
    // Initial order
    const getPluginTypes = () => screen.getAllByText(/ImageGallery|ProductInfo/).map(el => el.textContent);
    expect(getPluginTypes()).toEqual(['ImageGallery', 'ProductInfo']);

    const moveDownBtns = screen.getAllByTitle(/Move Down/i);
    // Click the first one (which should be enabled)
    fireEvent.click(moveDownBtns[0]);

    // Updated order
    expect(getPluginTypes()).toEqual(['ProductInfo', 'ImageGallery']);
  });

  it('calls submit with layout when save button is clicked', async () => {
    const submit = vi.fn();
    (useSubmit as any).mockReturnValue(submit);
    
    render(<MemoryRouter><PDPManager /></MemoryRouter>);
    
    const saveBtn = screen.getByRole('button', { name: /Save Layout/i });
    fireEvent.click(saveBtn);

    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        layout: expect.stringContaining('"type":"ImageGallery"')
      }),
      expect.anything()
    );
  });
});
