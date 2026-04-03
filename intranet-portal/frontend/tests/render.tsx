import { render as rtlRender, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean;
}

function customRender(ui: ReactElement, options: CustomRenderOptions = {}) {
  const { withRouter = true, ...renderOptions } = options;

  return rtlRender(ui, {
    wrapper: ({ children }: { children: ReactNode }) =>
      withRouter ? <BrowserRouter>{children}</BrowserRouter> : <>{children}</>,
    ...renderOptions,
  });
}

export * from '@testing-library/react';
export { customRender as render };
