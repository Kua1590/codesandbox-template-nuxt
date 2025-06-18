import { mount } from '@vue/test-utils';
import StudentQRCode from '@/components/StudentQRCode.vue';
import QRCode from 'qrcode';

// Mock the qrcode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),
  toCanvas: jest.fn(), // Also mock toCanvas if it's used as an alternative
}));

describe('StudentQRCode.vue', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    QRCode.toDataURL.mockClear();
    QRCode.toCanvas.mockClear();
  });

  test('renders and calls QR generation on mount with studentIdentifier', async () => {
    const studentIdentifier = 'test-student-123';
    const mockDataURL = 'data:image/png;base64,dummyqrcode';
    QRCode.toDataURL.mockResolvedValue(mockDataURL);

    const wrapper = mount(StudentQRCode, {
      propsData: { studentIdentifier }
    });

    // Wait for async operations like generateQRCode to complete
    await wrapper.vm.$nextTick(); // For immediate watcher call
    await wrapper.vm.$nextTick(); // For mounted hook and subsequent updates

    expect(QRCode.toDataURL).toHaveBeenCalledTimes(1);
    expect(QRCode.toDataURL).toHaveBeenCalledWith(studentIdentifier, { errorCorrectionLevel: 'H' });

    // Check if the img src is updated
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe(mockDataURL);
    expect(wrapper.vm.qrCodeDataUrl).toBe(mockDataURL);
  });

  test('updates QR code when studentIdentifier prop changes', async () => {
    const initialIdentifier = 'student-A';
    const updatedIdentifier = 'student-B';
    const initialMockUrl = 'data:image/png;base64,initialqrcode';
    const updatedMockUrl = 'data:image/png;base64,updatedqrcode';

    QRCode.toDataURL.mockResolvedValueOnce(initialMockUrl); // For initial mount

    const wrapper = mount(StudentQRCode, {
      propsData: { studentIdentifier: initialIdentifier }
    });

    await wrapper.vm.$nextTick(); // mounted
    await wrapper.vm.$nextTick(); // generateQRCode call

    expect(QRCode.toDataURL).toHaveBeenCalledWith(initialIdentifier, { errorCorrectionLevel: 'H' });
    expect(wrapper.vm.qrCodeDataUrl).toBe(initialMockUrl);
    let img = wrapper.find('img');
    expect(img.attributes('src')).toBe(initialMockUrl);

    // Change the prop
    QRCode.toDataURL.mockResolvedValueOnce(updatedMockUrl); // For watcher update
    await wrapper.setProps({ studentIdentifier: updatedIdentifier });

    await wrapper.vm.$nextTick(); // watcher
    await wrapper.vm.$nextTick(); // generateQRCode call

    expect(QRCode.toDataURL).toHaveBeenCalledTimes(2); // Called once on mount, once on watch
    expect(QRCode.toDataURL).toHaveBeenCalledWith(updatedIdentifier, { errorCorrectionLevel: 'H' });
    expect(wrapper.vm.qrCodeDataUrl).toBe(updatedMockUrl);
    img = wrapper.find('img'); // Re-find img if component re-renders
    expect(img.attributes('src')).toBe(updatedMockUrl);
  });

  test('handles missing studentIdentifier gracefully', async () => {
    // Mount with empty identifier
    const wrapper = mount(StudentQRCode, {
      propsData: { studentIdentifier: '' }
    });
    await wrapper.vm.$nextTick();

    expect(QRCode.toDataURL).not.toHaveBeenCalled();
    expect(wrapper.vm.qrCodeDataUrl).toBe(null);
    expect(wrapper.find('img').exists()).toBe(false); // No image should be rendered
    // Check if canvas is present as a fallback (if that's the intended behavior)
    // For this component, if qrCodeDataUrl is null, neither img nor canvas content is shown.
    // If a placeholder canvas is always rendered when no image, test for that.
    // Based on current component logic, if no studentIdentifier, qrCodeDataUrl is null, so no img.
    // The canvas ref is present but nothing is drawn to it by default if qrCodeDataUrl is to be used for img.
  });

  test('handles QR code generation error', async () => {
    const studentIdentifier = 'error-case';
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    QRCode.toDataURL.mockRejectedValueOnce(new Error('QR Generation Failed'));

    const wrapper = mount(StudentQRCode, {
      propsData: { studentIdentifier }
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(QRCode.toDataURL).toHaveBeenCalledWith(studentIdentifier, { errorCorrectionLevel: 'H' });
    expect(wrapper.vm.qrCodeDataUrl).toBe(null); // Should be null after error
    expect(console.error).toHaveBeenCalledWith('Failed to generate QR code:', expect.any(Error));
    expect(wrapper.find('img').exists()).toBe(false);

    consoleErrorSpy.mockRestore();
  });
});
